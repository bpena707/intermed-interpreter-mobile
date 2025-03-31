import axios from "axios";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import {useAuth, useUser} from "@clerk/clerk-expo";

// Define a type for the update data, excluding 'id'
export interface FollowupRequest {
    date: Date;
    startTime: string;
    projectedDuration?: string;
    status: string;
    appointmentType: string;
    notes?: string;
    patientId: string;
    facilityId?: string;
    interpreterId?: string;
    newFacilityAddress?: string;
}

// Define the expected response type
export interface FollowupResponse {
    date: Date;
    startTime: string;
    projectedDuration?: string;
    status: string;
    appointmentType: string;
    notes?: string;
    patientId: string;
    facilityId?: string;
    newFacilityAddress?: string;
    // interpreterId: string;
}


export const useCreateFollowupRequest = () => {
    const queryClient= useQueryClient()
    const {getToken, userId} = useAuth()

    const mutation = useMutation<
        FollowupResponse,
        Error,
        FollowupRequest
    >({
        mutationFn: async (json: FollowupRequest) => {
            if (!userId) {
                throw new Error('UserId is required to create followup request')
            }

            const response = await axios.post(
                'http://localhost:3000/api/followUpRequests',
                json,
                {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`
                    },
                    timeout: 5000
                }
            )
            if (response.data.status !== 201 && response.status !== 200) {
                throw new Error('Failed to create followup request')
            }

            return response.data
        },
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Follow Up request created successfully',
            });
            queryClient.invalidateQueries({ queryKey: ["followups"] })
        },
        onError: (error) => {
            Toast.show({
                type: 'error',
                text1: 'Failed to create followup request',
            });
            console.error(error)
        }
    })
    return mutation
}