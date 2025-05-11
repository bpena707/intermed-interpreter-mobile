// src/hooks/useInterpreters.ts (or similar)

import { useQuery } from '@tanstack/react-query';
import { useAuth } from "@clerk/clerk-expo";
import axios, { AxiosError } from 'axios';

export interface InterpreterProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    isCertified: boolean;
    // Add other fields if selected in API
}

// --- Type for the *actual* API response shape ---
interface InterpreterApiResponse {
    data: InterpreterProfile | null; // API might return { data: null } if not found, though 404 is better
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const useGetCurrentInterpreter = () => {
    const { getToken, userId } = useAuth();
    const isEnabled = !!userId;

    // Query result type is InterpreterProfile, Error type for errors
    const query = useQuery<InterpreterProfile, Error>({
        queryKey: ['interpreter', 'currentUser', userId],
        queryFn: async (): Promise<InterpreterProfile> => {
            const token = await getToken();
            console.log('[useGetCurrentInterpreter] Token fetched:', token ? `Yes (length ${token.length})` : 'No/Null');
            if (!token) throw new Error('Authentication token is required');

            const url = `${apiUrl}/interpreters/me`;
            console.log(`[useGetCurrentInterpreter] Axios GET: ${url}`);

            try {
                // Tell Axios the expected response shape includes the 'data' wrapper
                const response = await axios.get<InterpreterApiResponse>(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                    timeout: 5000
                });

                // ---> Correctly extract the nested data <---
                const interpreterData = response.data?.data; // Access response.data.data
                console.log('[useGetCurrentInterpreter] Raw response.data?.data:', JSON.stringify(interpreterData));
                // ------------------------------------------

                // Check if the nested data (the actual profile) exists and has an ID
                if (!interpreterData || typeof interpreterData !== 'object' || !interpreterData.id) {
                    // If API returned 200 but data is missing/invalid inside, throw specific error
                    throw new Error("Interpreter profile data missing or invalid in API response");
                }

                console.log("[useGetCurrentInterpreter] Success, data validated:", interpreterData);
                return interpreterData; // Return the NESTED interpreter object

            } catch (error) {
                console.error("[useGetCurrentInterpreter] Axios error:", error);
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<any>;
                    // If API returned 404, message will likely be "Interpreter profile not found"
                    const apiErrorMessage = axiosError.response?.data?.error || axiosError.message;
                    throw new Error(apiErrorMessage);
                } else {
                    throw error;
                }
            }
        },
        enabled: isEnabled,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 15,
    });

    return query;
};