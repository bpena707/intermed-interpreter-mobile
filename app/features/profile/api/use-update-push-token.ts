
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';
import Toast from 'react-native-toast-message';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const useUpdatePushToken = () => {
    const { getToken } = useAuth();

    const mutation = useMutation({
        mutationFn: async ({ token }: { token: string }) => {
            if (!apiUrl) throw new Error("API URL not configured");

            const url = `${apiUrl}/interpreters/me/push-token`;
            const authToken = await getToken();

            return axios.patch(url, { token }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
        },
        onSuccess: () => {
            console.log("Successfully saved push token to backend.");
        },
        onError: (error) => {
            console.error("Failed to save push token:", error);
            Toast.show({
                type: 'error',
                text1: 'Could not enable notifications',
                text2: 'Please try again later.',
            });
        }
    });

    return mutation;
};