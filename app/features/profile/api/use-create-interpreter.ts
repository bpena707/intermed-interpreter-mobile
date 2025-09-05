import axios from "axios";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {useAuth, useUser} from "@clerk/clerk-expo";

interface OnBoardingType  {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    address?: string,
    latitude?: number,
    longitude?: number,
    // targetLanguages: string[],
    // isCertified: boolean,
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL

export const useCreateInterpreter = () => {
    const queryClient = useQueryClient()
    const { getToken, userId } = useAuth()
    const { user } = useUser()

    const mutation = useMutation({
        mutationFn: async (data: Omit<OnBoardingType, 'clerkUserId'>) => {

            if (!userId) {
                throw new Error('UserId is required to create interpreter')
            }

            if (!apiUrl) {
                console.error("apiUrl environment variable is not set!");
                throw new Error("API configuration error.");
            }

            const payload = {
                ...data,
                onboardingCompleted: true,
            }

            const url = `${apiUrl}/interpreters`
            console.log(`Making POST request to:, ${url}`)
            // In your hook, before the axios call:
            console.log("Sending to API:", payload)

            try {
                const response = await axios.post(
                    url,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`
                        },
                        timeout: 5000
                    }
                )

                if (response.status != 201 && response.status != 200) {
                    throw new Error('Failed to create interpreter')
                }
                await user?.update(({
                    unsafeMetadata: {
                        onboardingComplete: true
                    }
                }))

                return response.data
            }catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("API Error Response:", error.response?.data);
                    console.error("API Error Status:", error.response?.status);
                    console.error("Request that failed:", error.config?.data);

                    // Throw a more descriptive error
                    const errorMessage = error.response?.data?.error ||
                        error.response?.data?.details ||
                        error.response?.data?.message ||
                        'Failed to create interpreter';
                    throw new Error(errorMessage);
                }
                throw error;
            }
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Profile created successfully',
            });
            //refetch all patients when a new patient is created to update the cache through the queryKey
            queryClient.invalidateQueries({ queryKey: ["interpreters"] })
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to submit info',
                text2: error?.message || 'An error occurred'
            });
            console.error('Failed to create interpreter', error)
        }

    })
    return mutation
}