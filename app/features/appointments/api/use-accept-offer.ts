// hooks/useAcceptOffer.ts
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "@clerk/clerk-expo";
import axios from "axios";
import Toast from "react-native-toast-message";

interface AcceptOfferResponse {
    success: boolean;
    message: string;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const useAcceptOffer = () => {
    const queryClient = useQueryClient()
    const {getToken, userId} = useAuth()

    const mutation = useMutation<
        AcceptOfferResponse,
        Error,
        string
    >({
        mutationFn: async (appointmentId: string) => {
            if (!userId) {
                throw new Error('No user found')
            }

            const url = `${apiUrl}/appointments/offers/${appointmentId}/accept`

            try {
                const response = await axios.post(url, {}, {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`,
                    },
                    timeout: 5000
                })
                return response.data
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 409) {
                        throw new Error('This appointment has already been taken');
                    }
                    throw new Error(`Failed to accept offer: ${error.response?.data?.error || error.message}`);
                } else if (error instanceof Error) {
                    throw new Error(`Failed to accept offer: ${error.message}`);
                } else {
                    throw new Error('An unexpected error occurred');
                }
            }
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Appointment Accepted!',
                text2: 'You have successfully accepted this appointment'
            });
            // Invalidate both offers and appointments
            queryClient.invalidateQueries({ queryKey: ["available-offers", userId] })
            queryClient.invalidateQueries({ queryKey: ["appointments", userId] })
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to accept appointment',
                text2: error.message
            });
        }
    })

    return mutation
}