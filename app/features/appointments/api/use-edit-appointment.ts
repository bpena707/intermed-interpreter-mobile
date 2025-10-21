import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {useAuth} from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import {Animated} from "react-native";
import delay = Animated.delay;

// Define a type for the update data, excluding 'id'
export type UpdateAppointmentType = {
    date?: string; // Format: 'YYYY-MM-DD'
    startTime?: string; // Format: 'HH:MM:SS'
    endTime?: string; // Format: 'HH:MM:SS' or null
    notes?: string | null;
    interpreterNotes: string | undefined;
    appointmentType?: string | null;
    projectedDuration?: string | null;
    status?: string | null; // e.g., 'Pending', 'Confirmed', etc.
    patientId?: string | null;
    facilityId?: string | null;
    interpreterId?: string | null;
    isCertified?: boolean | null;
};

// Define the expected response type
export type AppointmentResponseType = {
    id: string;
    bookingId: string;
    date: string;
    startTime: string;
    endTime: string | null;
    notes: string | null;
    interpreterNotes: string | undefined;
    projectedDuration: string | null;
    appointmentType: string | null;
    status: string | null;
    patientId: string | null;
    facilityId: string | null;
    interpreterId: string | null;
    isCertified: boolean | null;
};

const apiUrl = process.env.EXPO_PUBLIC_API_URL

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
            if (!id){
                throw new Error('Appointment ID is required to update appointment')
            }

            if (!apiUrl) {
                console.error("apiUrl environment variable is not set!");
                throw new Error("API configuration error.");
            }

            const url = `${apiUrl}/appointments/${id}`

            try {
                const response  = await axios.patch(
                    url,
                    updatedData,
                    {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`,
                            'Content-Type': 'application/json',
                        },
                        timeout: 5000
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
            queryClient.invalidateQueries({ queryKey: ["appointments", userId] })
            queryClient.invalidateQueries({ queryKey: ["appointment", userId, id] });

        },
        onError: (error: AxiosError)=> {

        }
    })
    return mutation
}