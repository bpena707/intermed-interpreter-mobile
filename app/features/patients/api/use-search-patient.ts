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

            // TODO: Replace hardcoded localhost with Platform check or env variable for better portability
            const baseUrl = 'http://localhost:3000';
            const url = `${baseUrl}/api/patients/search`;
            console.log(`[useSearchPatients] Axios GET: ${url} Params: q=${searchQuery}`);
            try {
                const response = await axios.get<PatientsApiResponse>(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                    params: {
                        q: searchQuery
                    }
                });

                const patients = response.data?.data || [];
                console.log(`[useSearchPatients] Received ${patients.length} patients for "${searchQuery}"`);
                return patients;

            } catch (error) {
                console.error("[useSearchPatients] Axios error:", error);
                // Axios throws specific errors, try to extract message
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<any>; // Type assertion
                    const apiErrorMessage = axiosError.response?.data?.error || axiosError.message;
                    throw new Error(apiErrorMessage);
                } else {
                    // Rethrow other types of errors
                    throw error;
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
