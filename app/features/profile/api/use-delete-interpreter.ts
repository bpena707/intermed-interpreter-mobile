import {useMutation, useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {useAuth} from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import {router} from "expo-router";

const apiUrl = process.env.EXPO_PUBLIC_API_URL

export const useDeleteInterpreter = (id: string) => {
    const queryClient = useQueryClient()
    const { getToken, signOut, userId } = useAuth()

    const mutation = useMutation({
        mutationFn: async() => {

            if (id !== userId) {
                console.error(`Security Alert: Attempt to delete user ${id} by authenticated user ${userId}.`);
                throw new Error("You can only delete your own account.");
            }


            if (!apiUrl) {
                console.error("apiUrl environment variable is not set!");
                throw new Error("API configuration error.");
            }

            const url = `${apiUrl}/interpreters/${id}`
            console.log(`Making DELETE request to: ${url}`)

            const response = await axios.delete(
                url,
                {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`
                    },
                    timeout: 5000
                }
            )
        },
        onSuccess: async () => {
            Toast.show({
                type: 'success',
                text1: 'Interpreter deleted successfully',
                text2: 'The interpreter has been removed from your profile.'
            })

            try {
                await signOut();
                console.log("User signed out from Clerk on client-side.");
            } catch (signOutError) {
                console.error("Error during client-side signOut after account deletion:", signOutError);
                // Proceed with navigation even if client-side signOut has an issue,
                // as the backend session is gone.
            }
            queryClient.clear()
            router.replace('/sign-up')
        },
        onError: (error: Error) => { // error is now of type Error
            let detailMessage = 'An error occurred while deleting your account.';
            if (axios.isAxiosError(error)) {
                const serverErrorData = error.response?.data as any;
                if (serverErrorData) {
                    detailMessage = serverErrorData.error || serverErrorData.message || error.message;
                } else if (error.request) {
                    detailMessage = "No response from server. Check connection.";
                } else {
                    detailMessage = error.message;
                }
            } else {
                detailMessage = error.message || detailMessage;
            }
            Toast.show({
                type: 'error',
                text1: 'Deletion Failed',
                text2: detailMessage,
            });
            console.error('Failed to delete account:', error);
        }

    })

    return mutation
}