import {useQuery, useQueryClient} from '@tanstack/react-query';
import { Appointment } from '@/types/apiTypes';
import {useAuth, useUser} from "@clerk/clerk-expo";
import axios from "axios";
import {useCallback} from "react";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const useGetAppointments = () => {
    const { getToken, userId } = useAuth()
    const { user } = useUser()
    const queryClient = useQueryClient()
    //define the query
    const query = useQuery<Appointment[]>({
        //queryKey is the name of the data stored in cache to be reused later again instead or parsing data all over again
        queryKey: ['appointments', userId],
        //queryFn is function that query will use to request data as promise which resloves data or a throws error if it fails
        queryFn: async () => {
            if (!userId) {
                throw new Error('UserId is required to fetch appointments')
            }

            const token = await getToken()
            if (!token) {
                throw new Error('Token is required to fetch appointments')
            }
            console.log('Token:', token);

            if (!apiUrl) {
                console.error("apiUrl environment variable is not set!");
                throw new Error("API configuration error.");
            }

            const url = `${apiUrl}/appointments`;
            console.log(`Making GET request to: ${url}`)

            try {
                const response = await axios.get(url,
                    {
                        headers:{
                            Authorization: `Bearer ${token}`,
                        },
                        timeout: 5000
                    })

                if (response.data && Array.isArray(response.data.data)) {
                    return response.data.data
                } else if (Array.isArray(response.data)) {
                    return response.data
                } else {
                    console.error("Unexpected response structure:", response.data);
                    throw new Error('Unexpected response structure from API');
                }
            }catch (error) { // <-- error starts as unknown
                console.error('Failed to fetch appointments:', error);

                if (axios.isAxiosError(error)) {
                    // If it's an AxiosError, TypeScript knows it has a .message property
                    // (and potentially .response)
                    console.error('Axios error details:', error.response?.status, error.response?.data);
                    const statusText = error.response?.statusText ? ` (${error.response.statusText})` : '';
                    const serverMessage = typeof error.response?.data === 'string' ? `: ${error.response.data}` : '';
                    // Using error.message is safe here as a fallback if statusText isn't available
                    throw new Error(`Failed to fetch appointments: Server responded with status ${error.response?.status}${statusText}${serverMessage || (' - ' + error.message)}`);

                } else if (error instanceof Error) {
                    throw new Error(`Failed to fetch appointments: ${error.message}`);
                } else {
                    // If it's not an AxiosError AND not an Error instance, handle the truly unknown case.
                    // You cannot safely access .message here.
                    throw new Error('An unexpected error occurred while fetching appointments.');
                }
            }
        },
        staleTime: 30000, // 30 seconds stale time for data
        refetchOnWindowFocus: true // Refetch data when app is back into focus
    })

    const refetchWithClearCache = useCallback(async () => {
        console.log('Clearing appointments cache and refetching...');

        // Step 1: Invalidate the cache
        await queryClient.invalidateQueries({
            queryKey: ['appointments', userId]
        });

        // Step 2: Force a fresh fetch
        return query.refetch();
    }, [queryClient, userId, query.refetch]);

    return {
        ...query,
        refetchWithClearCache // Expose the enhanced refetch function
    }
}