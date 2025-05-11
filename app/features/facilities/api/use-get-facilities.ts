import { useQuery } from '@tanstack/react-query';
import {Appointment, Facility} from '@/types/apiTypes';
import {useAuth, useUser} from "@clerk/clerk-expo";
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const useGetFacilities = () => {
    const { getToken, userId } = useAuth()

    //define the query
    const query = useQuery<Facility[]>({
        //queryKey is the name of the data stored in cache to be reused later again instead or parsing data all over again
        queryKey: ['facilities', userId],
        //queryFn is function that query will use to request data as promise which resloves data or a throws error if it fails
        queryFn: async () => {
            if (!userId) {
                throw new Error('UserId is required to fetch facilities')
            }

            const token = await getToken()
            if (!token) {
                throw new Error('Token is required to fetch facilities')
            }
            console.log('Token:', token);

            if (!apiUrl) {
                console.error("apiUrl environment variable is not set!");
                throw new Error("API configuration error.");
            }

            const url = `${apiUrl}/facilities`;
            console.log(`Making GET request to: ${url}`)

            try {
                const response = await axios.get(url, {
                    headers:{
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 5000
                })
                console.log("API Response Data for facilities (from axios):", response.data);
                if (response.data && Array.isArray(response.data.data)) {
                    return response.data.data;
                } else {
                    // If the expected nested 'data' array isn't there.
                    console.error("Unexpected API response structure. Expected response.data.data to be an array.", response.data);
                    throw new Error("Unexpected response structure from server.");
                }
            }catch (error) {
                console.error('Failed to fetch facilities:', error);
                if (axios.isAxiosError(error)) {
                    console.error('Axios error details for facilities:', error.response?.status, error.response?.data);
                    const statusText = error.response?.statusText ? ` (${error.response.statusText})` : '';
                    const serverMessage = (error.response?.data && typeof error.response.data === 'object' && (error.response.data as any).message)
                        ? `: ${(error.response.data as any).message}`
                        : (typeof error.response?.data === 'string' ? `: ${error.response.data}` : '');

                    throw new Error(`Failed to fetch facilities: Server responded with status ${error.response?.status}${statusText}${serverMessage || (' - ' + error.message)}`);
                } else if (error instanceof Error) {
                    throw new Error(`Failed to fetch facilities: ${error.message}`);
                } else {
                    throw new Error('An unexpected error occurred while fetching facilities.');
                }
            }




            // const response = await fetch ('', {
            //     method: 'GET',
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // })

        }
    })
    return query
}