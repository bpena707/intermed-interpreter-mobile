// hooks/useDeclineOffer.ts
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "@clerk/clerk-expo";
import axios from "axios";
import Toast from "react-native-toast-message";

interface DeclineOfferResponse {
    success: boolean;
    message: string;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const useDeclineOffer = () => {
    const queryClient = useQueryClient()
    const {getToken, userId} = useAuth()

    const mutation = useMutation<
        DeclineOfferResponse,
        Error,
        string // appointmentId
    >({
        mutationFn: async (appointmentId: string) => {
            if (!userId) {
                throw new Error('No user found')
            }

            const url = `${apiUrl}/appointments/offers/${appointmentId}/decline`

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
                    throw new Error(`Failed to decline offer: ${error.response?.data?.error || error.message}`);
                } else if (error instanceof Error) {
                    throw new Error(`Failed to decline offer: ${error.message}`);
                } else {
                    throw new Error('An unexpected error occurred');
                }
            }
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Offer Declined',
                text2: 'You have declined this appointment'
            });
            queryClient.invalidateQueries({ queryKey: ["available-offers", userId] })
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to decline appointment',
                text2: error.message
            });
        }
    })

    return mutation
}