import { useQuery } from '@tanstack/react-query';
import { Appointment } from '@/types/apiTypes';

export const useGetIndividualAppointment = (id?: string) => {

    //define the query
    const query = useQuery<Appointment>({

        //queryKey is the name of the data stored in cache to be reused later again instead or parsing data all over again
        queryKey: ['appointment', {id}],
        //queryFn is function that query will use to request data as promise which resloves data or a throws error if it fails
        queryFn: async () => {
            const response = await fetch (`http://localhost:3000/api/appointments/${id}`)

            if (!response.ok) {
                throw new Error('Failed to fetch appointment')
            }

            //destructure the data object from the response
            const { data } = await response.json()
            return data;
        }
    })
    return query
}