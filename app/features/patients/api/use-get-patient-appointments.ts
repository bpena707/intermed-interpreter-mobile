// src/hooks/useAppointments.ts

import { useQuery } from '@tanstack/react-query';
import { useAuth } from "@clerk/clerk-expo";
import axios, { AxiosError } from 'axios';

// --- Define Type for Appointment Data ---
// TODO: Adjust this interface to match the exact fields returned
// by your GET /admin/appointments endpoint
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

// Define type for the API response structure (if nested)
// TODO: Adjust if your API returns the array directly
interface AppointmentsApiResponse {
    data: PatientAppointment[];
}

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


            // TODO: Replace hardcoded localhost
            const baseUrl = 'http://localhost:3000';
            const url = `${baseUrl}/api/appointments`; // Endpoint for appointments
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
                    }
                });

                const appointments = response.data?.data || [];
                console.log(`[usePatientAppointments] Received ${appointments.length} appointments for patient ${patientId}`);
                return appointments;

            } catch (error) {
                console.error("[usePatientAppointments] Axios error:", error);
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<any>;
                    const apiErrorMessage = axiosError.response?.data?.error || axiosError.message;
                    throw new Error(apiErrorMessage);
                } else {
                    throw error;
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