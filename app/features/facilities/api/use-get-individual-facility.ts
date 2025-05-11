import { useQuery } from '@tanstack/react-query';
import {Facility} from "@/types/apiTypes";
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const useGetIndividualFacility = (id?: string) => {
    //define the query
    const query = useQuery<Facility>({

        //queryKey is the name of the data stored in cache to be reused later again instead or parsing data all over again
        queryKey: ['facility', {id}],
        //queryFn is function that query will use to request data as promise which resloves data or a throws error if it fails
        queryFn: async () => {

            if (!id) {
                throw new Error('Facility ID is required to fetch facility')
            }
            if (!apiUrl) {
                console.error("apiUrl environment variable is not set!");
                throw new Error("API configuration error.");
            }

            const url = `${apiUrl}/facilities/${id}`;
            console.log(`Making GET request to: ${url}`)

            try {
                const response = await axios.get(url, {
                    timeout:5000
                })
                console.log("API Response Data for individual facility (from axios):", response.data);
                if (response.data && typeof response.data.data !== 'undefined') {
                    return response.data.data;
                } else {
                    // If the expected nested 'data' property isn't there.
                    console.error("Unexpected API response structure. Expected response.data.data to exist.", response.data);
                    throw new Error("Unexpected response structure from server.");
                }
            }catch (error){
                console.error(`Failed to fetch individual facility with id ${id}:`, error);
                if (axios.isAxiosError(error)) {
                    console.error('Axios error details for individual facility:', error.response?.status, error.response?.data);
                    const statusText = error.response?.statusText ? ` (${error.response.statusText})` : '';
                    const serverMessage = (error.response?.data && typeof error.response.data === 'object' && (error.response.data as any).message)
                        ? `: ${(error.response.data as any).message}`
                        : (typeof error.response?.data === 'string' ? `: ${error.response.data}` : '');

                    throw new Error(`Failed to fetch facility: Server responded with status ${error.response?.status}${statusText}${serverMessage || (' - ' + error.message)}`);
                } else if (error instanceof Error) {
                    throw new Error(`Failed to fetch facility: ${error.message}`);
                } else {
                    throw new Error('An unexpected error occurred while fetching facility.');
                }
            }
            // const response = await fetch (``)
            //
            // if (!response.ok) {
            //     throw new Error('Failed to fetch facility')
            // }
            //
            // //destructure the data object from the response
            // const { data } = await response.json()
            // return data;
        },
        enabled: !!id
    })
    return query
}