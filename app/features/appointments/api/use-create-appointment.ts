import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "@clerk/clerk-expo";
import axios from "axios";
import Toast from "react-native-toast-message";

export interface AppointmentRequest  {
    date?: Date; // Format: 'YYYY-MM-DD'
    startTime?: string; // Format: 'HH:MM:SS'
    endTime?: string; // Format: 'HH:MM:SS' or null
    notes?: string | null;
    appointmentType?: string | null;
    projectedDuration?: string | null;
    status?: string | null; // e.g., 'Pending', 'Confirmed', etc.
    patientId?:  string | null;
    facilityId?: string | null;
    interpreterId?: string | null;
    newFacilityAddress?: string | null;
    isCertified?: boolean
};

// Define the expected response type
export interface AppointmentResponse  {
    date: Date;
    startTime: string;
    endTime: string | null;
    notes: string | null;
    projectedDuration: string | null;
    appointmentType: string | null;
    status: string | null;
    patientId: string | null;
    facilityId: string | null;
    interpreterId: string | null;
    newFacilityAddress: string | null;
    isCertified: boolean
};

export const useCreateAppointment = () => {
    const queryClient = useQueryClient()
    const {getToken, userId} = useAuth()

  const mutation = useMutation<
      AppointmentResponse,
        Error,
        AppointmentRequest
  >({
      mutationFn: async (json:AppointmentRequest) => {
          if (!userId ) {
              throw new Error('No user found with id ')
          }

          const response  = await axios.post(
              'http://localhost:3000/api/appointments',
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