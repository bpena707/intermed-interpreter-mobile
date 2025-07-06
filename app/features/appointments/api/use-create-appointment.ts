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
    isCertified?: boolean
}

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
    isCertified: boolean
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL

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

          if (!apiUrl) {
              console.error("apiUrl environment variable is not set!");
              throw new Error("API configuration error.");
          }

          const url = `${apiUrl}/appointments`
          console.log(`Making POST request to: ${url}`)

          try{
              const response = await axios.post(url, json,
                  {
                        headers: {
                            Authorization: `Bearer ${await getToken()}`,
                        },
                        timeout: 5000
                  }
              )
              return response.data
          }catch (error) {
              console.error('Failed to create appointment (axios catch):', error);
              if (axios.isAxiosError(error)) {
                  // ... (detailed Axios error message extraction) ...
                  const serverErrorData = error.response?.data;
                  let apiErrorMessage = error.message;
                  if (serverErrorData) {
                      if (typeof serverErrorData === 'object' && serverErrorData !== null) {
                          if ((serverErrorData as any).error && typeof (serverErrorData as any).error === 'string') {
                              apiErrorMessage = (serverErrorData as any).error;
                          } else if ((serverErrorData as any).message && typeof (serverErrorData as any).message === 'string') {
                              apiErrorMessage = (serverErrorData as any).message;
                          }
                      } else if (typeof serverErrorData === 'string' && serverErrorData.trim() !== '') {
                          apiErrorMessage = serverErrorData;
                      }
                  }
                  throw new Error(`Failed to create appointment${error.response?.status ? ` (Status ${error.response.status})` : ''}: ${apiErrorMessage}`);
              } else if (error instanceof Error) {
                  throw new Error(`Failed to create appointment: ${error.message}`);
              } else {
                  throw new Error('An unexpected error occurred while creating the appointment.');
              }
          }
      },
      onSuccess: () => {
          Toast.show({
              type: 'success',
              text1: 'Follow Up request created successfully',
          });
          queryClient.invalidateQueries({ queryKey: ["appointments"] })
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