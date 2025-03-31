import { useQuery } from '@tanstack/react-query';
import {Appointment, Facility} from '@/types/apiTypes';
import {useAuth, useUser} from "@clerk/clerk-expo";

export const useGetFacilities = () => {
    const { getToken, userId } = useAuth()
    const { user } = useUser()
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

            const response = await fetch ('http://localhost:3000/api/facilities', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to fetch facilities: ${errorMessage}`);
            }

            //destructure the data object from the response
            const { data } = await response.json()
            return data;
        }
    })
    return query
}