import { useQuery } from '@tanstack/react-query';


export const useGetIndividualPatient = (id?: string) => {

    //define the query
    const query = useQuery({

        //queryKey is the name of the data stored in cache to be reused later again instead or parsing data all over again
        queryKey: ['facility', {id}],
        //queryFn is function that query will use to request data as promise which resloves data or a throws error if it fails
        queryFn: async () => {
            const response = await fetch (`http://localhost:3000/api/facilities/${id}`)

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