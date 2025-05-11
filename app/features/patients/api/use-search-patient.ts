// src/hooks/usePatients.ts

import { useQuery } from '@tanstack/react-query';
import { useAuth } from "@clerk/clerk-expo";
import axios, { AxiosError } from 'axios'; // Import axios

// Define the type for the search result item
// TODO: Adjust this to match your actual API response
export interface PatientSearchResult {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
}

// Define a type for the expected API response structure (if nested under 'data')
// TODO: Adjust if your API returns the array directly
interface PatientsApiResponse {
    data: PatientSearchResult[];
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

/**
 * Custom Tanstack Query hook to search for patients using Axios.
 * @param searchQuery The search term entered by the user.
 * @returns The Tanstack Query result object.
 */
export const useSearchPatients = (searchQuery: string) => {
    const { getToken } = useAuth();

    const isEnabled = searchQuery.trim().length > 0;

    const query = useQuery<PatientSearchResult[], Error>({
        queryKey: ['patientSearch', searchQuery],

        queryFn: async (): Promise<PatientSearchResult[]> => {
            if (!isEnabled) {
                return []; // Don't fetch if not enabled
            }

            const token = await getToken();
            if (!token) {
                throw new Error('Authentication token is required');
            }

            if (!apiUrl) {
                console.error("apiUrl environment variable is not set!");
                throw new Error("API configuration error.");
            }

            // TODO: Replace hardcoded localhost with Platform check or env variable for better portability

            const url = `${apiUrl}/patients/search`; // Endpoint for searching patients
            console.log(`[useSearchPatients] Axios GET: ${url} Params: q=${searchQuery}`);
            try {
                const response = await axios.get<PatientsApiResponse>(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                    params: {
                        q: searchQuery
                    },
                    timeout:5000
                });

                const patients = response.data?.data || [];
                console.log(`[useSearchPatients] Received ${patients.length} patients for "${searchQuery}"`);
                return patients;

            } catch (error) {
                console.error("[useSearchPatients] Axios error:", error);
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<any>; // Keep type assertion if accessing custom fields
                    // Attempt to get a specific error message from the API response body
                    const serverErrorData = axiosError.response?.data;
                    let apiErrorMessage = axiosError.message; // Default to Axios's message

                    if (serverErrorData) {
                        if (typeof serverErrorData === 'object' && serverErrorData !== null) {
                            if ((serverErrorData as any).error && typeof (serverErrorData as any).error === 'string') {
                                apiErrorMessage = (serverErrorData as any).error;
                            } else if ((serverErrorData as any).message && typeof (serverErrorData as any).message === 'string') {
                                apiErrorMessage = (serverErrorData as any).message;
                            }
                        } else if (typeof serverErrorData === 'string' && serverErrorData.trim() !== '') {
                            apiErrorMessage = serverErrorData;
                        }
                    }
                    throw new Error(apiErrorMessage);
                } else if (error instanceof Error) { // 4. Ensure type safety for non-Axios errors
                    throw new Error(`Failed to search patients: ${error.message}`);
                } else {
                    throw new Error('An unexpected error occurred while searching patients.');
                }
            }
        },
        enabled: isEnabled,
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    return query;
};
