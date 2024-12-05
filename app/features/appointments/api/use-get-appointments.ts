import { useQuery } from '@tanstack/react-query';
import { Appointment } from '@/types/apiTypes';
import {useAuth, useUser} from "@clerk/clerk-expo";



export const useGetAppointments = () => {

    const { getToken, userId } = useAuth()
    const { user } = useUser()
    //define the query
    const query = useQuery<Appointment[]>({
        //queryKey is the name of the data stored in cache to be reused later again instead or parsing data all over again
        queryKey: ['appointments'],
        //queryFn is function that query will use to request data as promise which resloves data or a throws error if it fails
        queryFn: async () => {
            if (!userId) {
                throw new Error('UserId is required to create interpreter')
            }

            const token = await getToken()

            const response = await fetch ('http://localhost:3000/api/appointments', {
                headers: {
                    method: 'GET',
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch appointments')
            }

            //destructure the data object from the response
            const { data } = await response.json()
            return data;
        }
    })
    return query
}