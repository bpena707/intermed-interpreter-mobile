import axios from "axios";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {useAuth, useUser} from "@clerk/clerk-expo";

interface OnBoardingType  {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    // targetLanguages: string[],
    // isCertified: boolean,
}

export const useCreateInterpreter = () => {
    const queryClient = useQueryClient()
    const { getToken, userId } = useAuth()
    const { user } = useUser()

    

    const mutation = useMutation({
        mutationFn: async (data: OnBoardingType) => {
            const response = await axios.post(
                'http://10.0.0.148:3000/api/interpreters',
                {...data, onboardingCompleted: true},
                {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`
                    }
                }
            )

            if (response.status != 200) {
                throw new Error('Failed to create interpreter')
            }
            await user?.update(({
                unsafeMetadata: {
                    onboardingComplete: true
                }
            }))
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