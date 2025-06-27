import { useQuery } from '@tanstack/react-query';
import {Patient} from "@/types/apiTypes";
import {useAuth} from "@clerk/clerk-expo";
import axios from "axios";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;
// export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const useGetIndividualPatient = (id?: string) => {
    const { getToken, userId } = useAuth()
    //define the query
    const query = useQuery<Patient>({

        //queryKey is the name of the data stored in cache to be reused later again instead or parsing data all over again
        queryKey: ['patient', userId, {id}],
        //queryFn is function that query will use to request data as promise which resloves data or a throws error if it fails
        queryFn: async () => {
            // await delay(5000)

            if (!userId) {
                console.warn("User ID is undefined in queryFn for getIndividualPatient. This shouldn't run if 'enabled' is set correctly.");
                throw new Error('User ID is required to fetch individual patient.');
            }

            if (!id) {
                console.warn("Patient ID is undefined in queryFn for getIndividualPatient. This shouldn't run if 'enabled' is set correctly.");
                throw new Error('Patient ID is required to fetch individual patient.');
            }

            if (!apiUrl) {
                console.error("apiUrl environment variable is not set!");
                throw new Error("API configuration error.");
            }

            const token = await getToken();
            if (!token) {
                throw new Error('Authentication token is required to fetch individual patient');
            }

            const url = `${apiUrl}/patients/${id}`;
            console.log(`Making GET request to: ${url}`);
            try {
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    timeout: 5000
                })
                console.log("API Response Data for individual patient (from axios):", response.data);
                if (response.data && typeof response.data.data !== 'undefined') {
                    return response.data.data;
                } else {
                    // If the expected nested 'data' property isn't there.
                    console.error("Unexpected API response structure. Expected response.data.data to exist.", response.data);
                    throw new Error("Unexpected response structure from server.");
                }
            }catch(error) {
                console.error(`Failed to fetch individual patient with id ${id}:`, error);
                if (axios.isAxiosError(error)) {
                    console.error('Axios error details for individual patient:', error.response?.status, error.response?.data);
                    const statusText = error.response?.statusText ? ` (${error.response.statusText})` : '';
                    const serverMessage = (error.response?.data && typeof error.response.data === 'object' && (error.response.data as any).message)
                        ? `: ${(error.response.data as any).message}`
                        : (typeof error.response?.data === 'string' ? `: ${error.response.data}` : '');

                    // Corrected the error message to mention "patient"
                    throw new Error(`Failed to fetch patient: Server responded with status ${error.response?.status}${statusText}${serverMessage || (' - ' + error.message)}`);
                } else if (error instanceof Error) {
                    throw new Error(`Failed to fetch patient: ${error.message}`); // Corrected message
                } else {
                    throw new Error('An unexpected error occurred while fetching patient.'); // Corrected message
                }
            }


            // const response = await fetch (
            //     ``,
            //     {
            //         headers: {
            //             Authorization: `Bearer ${await getToken()}`
            //         }
            //     }
            // )
            //
            // if (!response.ok) {
            //     throw new Error('Failed to fetch facility')
            // }
            //
            // //destructure the data object from the response
            // const { data } = await response.json()
            // return data;
        },
        enabled: !!id && !!userId
    })
    return query

}