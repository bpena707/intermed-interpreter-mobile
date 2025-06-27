import { useQuery } from '@tanstack/react-query';
import { Appointment } from '@/types/apiTypes';
import {useAuth} from "@clerk/clerk-expo";
import axios from "axios";


const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const useGetIndividualAppointment = (id: string) => {
    const { getToken, userId } = useAuth()
    //define the query
    const query = useQuery<Appointment>({
        enabled: !!id && !!userId,
        staleTime:0,
        refetchOnWindowFocus:true,
        //queryKey is the name of the data stored in cache to be reused later again instead or parsing data all over again
        queryKey: ['appointment', userId, id],
        //queryFn is function that query will use to request data as promise which resloves data or a throws error if it fails
        queryFn: async () => {
            console.log("Fetching appointment for ID:", id)
            if (!userId || !id) {
                throw new Error('UserId and appointmentID is required to get appointment')
            }

            if (!apiUrl) {
                console.error("apiUrl environment variable is not set!");
                throw new Error("API configuration error.");
            }

            const token = await getToken()

            const url = `${apiUrl}/appointments/${id}`;
            console.log(`Making GET request to: ${url}`)
            try {
                const response = await axios.get(url,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        timeout: 5000
                    })
                console.log("API Response Data from axios:", response.data);
                if (response.data && typeof response.data.data !== 'undefined') {
                    return response.data.data;
                } else {
                    // If the expected nested 'data' property isn't there.
                    console.error("Unexpected API response structure. Expected response.data.data to exist.", response.data);
                    throw new Error("Unexpected response structure from server.");
                }
            }catch (error) {
                console.error('Failed to fetch appointment:', error);

                if (axios.isAxiosError(error)) {
                    // If it's an AxiosError, TypeScript knows it has a .message property
                    // (and potentially .response)
                    console.error('Axios error details:', error.response?.status, error.response?.data);
                    const statusText = error.response?.statusText ? ` (${error.response.statusText})` : '';
                    const serverMessage = typeof error.response?.data === 'string' ? `: ${error.response.data}` : '';
                    throw new Error(`Failed to fetch appointment${statusText}${serverMessage}`);
                } else {
                    // Handle other types of errors (e.g., network errors)
                    throw new Error('An unexpected error occurred while fetching the appointment.');
                }
            }
            // const response = await fetch (
            //
            //     {
            //         headers: {
            //             Authorization: `Bearer ${token}`
            //         }
            //     })
            // console.log("API Response Status:", response.status);
            // if (!response.ok) {
            //     throw new Error('Failed to fetch appointment')
            // }
            // //destructure the data object from the response
            // const { data } = await response.json()
            // console.log("API Response Data:", data);
            // return data;
        }
    })
    return query
}