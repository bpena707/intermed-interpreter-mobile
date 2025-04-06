import { useQuery } from '@tanstack/react-query';
import {Patient} from "@/types/apiTypes";
import {useAuth} from "@clerk/clerk-expo";

export const useGetIndividualPatient = (id?: string) => {
    const { getToken, userId } = useAuth()
    //define the query
    const query = useQuery<Patient>({

        //queryKey is the name of the data stored in cache to be reused later again instead or parsing data all over again
        queryKey: ['patient',userId, {id}],
        //queryFn is function that query will use to request data as promise which resloves data or a throws error if it fails
        queryFn: async () => {
            const response = await fetch (
                `http://localhost:3000/api/patients/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`
                    }
                }
            )

            if (!response.ok) {
                throw new Error('Failed to fetch facility')
            }

            //destructure the data object from the response
            const { data } = await response.json()
            return data;
        }
    })
    return query

}