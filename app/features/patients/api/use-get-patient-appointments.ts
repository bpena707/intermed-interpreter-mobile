// src/hooks/useAppointments.ts

import { useQuery } from '@tanstack/react-query';
import { useAuth } from "@clerk/clerk-expo";
import axios, { AxiosError } from 'axios';

export interface PatientAppointment {
    id: string;
    bookingId?: string | null; // Optional if not always used/present
    date: string; // Expecting 'YYYY-MM-DD' string from DB/API
    startTime: string; // Expecting 'HH:mm:ss' string
    endTime?: string | null; // Optional
    projectedEndTime?: string | null; // Optional
    duration?: string | null; // Optional (might be number?)
    projectedDuration?: string | null; // Optional (might be number?)
    appointmentType: string;
    status: string;
    notes?: string | null; // Optional
    isCertified?: boolean | null; // Optional
    facility: string; // Facility Name
    facilityAddress?: string; // Optional if not always needed on this screen
    facilityId: string; // Facility ID
}

interface AppointmentsApiResponse {
    data: PatientAppointment[];
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL

/**
 * Custom hook to fetch appointments for a specific patient ID using Axios.
 * @param patientId The ID of the patient, or null/undefined if no patient is selected.
 * @returns The Tanstack Query result object.
 */
export const usePatientAppointments = (patientId: string | undefined | null) => {
    const { getToken } = useAuth();

    // Only enable the query if a valid patientId is provided
    const isEnabled = !!patientId;

    const query = useQuery<PatientAppointment[], Error>({
        // Query key includes 'patientAppointments' and the specific patientId
        queryKey: ['patientAppointments', patientId],

        queryFn: async (): Promise<PatientAppointment[]> => {
            // The 'enabled' flag prevents this from running if patientId is null/undefined
            if (!patientId) {
                return [];
            }

            const token = await getToken();
            if (!token) {
                throw new Error('Authentication token is required');
            }

            if (!apiUrl) {
                console.error("apiUrl environment variable is not set!");
                throw new Error("API configuration error.");
            }

            // TODO: Replace hardcoded localhost
            const url = `${apiUrl}/appointments`; // Endpoint for appointments
            console.log(`[usePatientAppointments] Axios GET: <span class="math-inline">\{url\} Params\: patientId\=</span>{patientId}`);

            try {
                const response = await axios.get<AppointmentsApiResponse>(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                    // Pass patientId as a query parameter
                    params: {
                        patientId: patientId
                    },
                    timeout: 5000
                });

                const appointments = response.data?.data || [];
                console.log(`[usePatientAppointments] Received ${appointments.length} appointments for patient ${patientId}`);
                return appointments;

            } catch (error) {
                console.error("[usePatientAppointments] Axios error:", error);
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<any>; // Keep if you access custom fields on error.response.data
                    // Attempt to get a specific error message from the API response body
                    // This tries a few common ways an API might structure its error messages
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
                    throw new Error(`Failed to fetch patient appointments: ${error.message}`);
                } else {
                    throw new Error('An unexpected error occurred while fetching patient appointments.');
                }
            }
        },

        // Only run the query if patientId is valid
        enabled: isEnabled,

        // Optional: Configure caching behavior
        staleTime: 1000 * 60 * 5, // 5 minutes (appointments might not change as often as search)
        gcTime: 1000 * 60 * 15,  // 15 minutes
        refetchOnWindowFocus: true, // Good to refetch appointments if user comes back to the screen
    });

    return query;
};