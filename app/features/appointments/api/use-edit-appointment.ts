import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {useAuth, useUser} from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import {param} from "ts-interface-checker";

//types are added to define the type of object that will be requested and returned
// type AppointmentResponseType = {
//     patientId: string
//     interpreterId: string
//     facilityId: string
//     date: string
//     startTime: string
//     endTime: string
//     appointmentType: string
//     notes: string
//     status: string
//     duration: number
// }
//
// type AppointmentRequestType = {
//     patientId?: string | null;
//     interpreterId?: string | null;
//     facilityId?: string | null;
//     date?: string; // Adjust based on your date handling
//     startTime?: string;
//     endTime?: string | null;
//     appointmentType?: string | null;
//     notes?: string | null;
//     status?: string | null;
//     duration?: number;
// }
// id: string
// patientId: string
// interpreterId: string
// facilityId: string
// date: string
// startTime: string
// endTime: string
// notes: string
// appointmentType: string
// status: string
// duration: number

// types.ts

// Define a type for the update data, excluding 'id'
export type UpdateAppointmentType = {
    date?: string; // Format: 'YYYY-MM-DD'
    startTime?: string; // Format: 'HH:MM:SS'
    endTime?: string; // Format: 'HH:MM:SS' or null
    notes?: string | null;
    appointmentType?: string | null;
    projectedDuration?: string | null;
    status?: string | null; // e.g., 'Pending', 'Confirmed', etc.
    patientId?: string | null;
    facilityId?: string | null;
    interpreterId?: string | null;

};

// Define the expected response type
export type AppointmentResponseType = {
    id: string;
    date: string;
    startTime: string;
    endTime: string | null;
    notes: string | null;
    projectedDuration: string | null;
    appointmentType: string | null;
    status: string | null;
    patientId: string | null;
    facilityId: string | null;
    interpreterId: string | null;
};

const handleError = (error: AxiosError) => {
    if (error.response && error.response.data) {
        // Attempt to extract the error message from the response
        const serverError = (error.response.data as any).error || 'An error occurred';
        Toast.show({
            type: 'error',
            text1: 'Failed to update appointment',
            text2: serverError
        });
        console.error(`Error ${error.response.status}:`, error.response.data);
    } else if (error.request) {
        // Request was made but no response received
        Toast.show({
            type: 'error',
            text1: 'No response from server',
            text2: 'Please try again later.'
        });
        console.error('No response received:', error.request);
    } else {
        // Something else happened
        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: error.message || 'An error occurred'
        });
        console.error('Error:', error.message);
    }
    console.error('Full error object:', error);
};


export const useEditAppointment = (id: string) => {
    const queryClient = useQueryClient()
    const { getToken, userId } = useAuth()

    const mutation = useMutation<
        AppointmentResponseType,
        AxiosError,
       UpdateAppointmentType
    >({
        //mutation fetches the data from the api and updates with the PATCH method
        mutationFn: async (updatedData) => {

            if (!userId) {
                throw new Error('UserId is required to create appointment')
            }
            try {
                const response  = await axios.patch(
                    `http://localhost:3000/api/appointments/${id}`,
                    updatedData,
                    {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`,
                            'Content-Type': 'application/json',
                        },

                    }
                )
                return await response.data

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    handleError(error);
            } else {
                    console.error('Unexpected error:', error);
                    Toast.show({
                        type: 'error',
                        text1: 'An unexpected error occurred',
                        text2: 'Please try again later.'
                    });
                }
                throw error;
            }

            },

        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Appointment updated successfully',
            })
            queryClient.invalidateQueries({ queryKey: ["appointments"] })
            queryClient.invalidateQueries({ queryKey: ["appointments", { id }] });
        },
        onError: (error: AxiosError)=> {

        }
        // onError: (error) => {
        //     Toast.show({
        //         type: 'error',
        //         text1: 'Failed to update appointment',
        //         text2: error?.message || 'An error occurred'
        //     })
        //     console.error(`Failed to update appointment ${error.stack}`)
        //
        // }
    })
    return mutation
}