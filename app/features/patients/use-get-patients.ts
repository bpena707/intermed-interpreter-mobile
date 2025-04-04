import {useAuth, useUser} from "@clerk/clerk-expo";
import {useQuery} from "@tanstack/react-query";
import {Patient} from "@/types/apiTypes";

export const useGetPatients = () => {
    const { getToken, userId } = useAuth()
    const { user } = useUser()
    //define the query
    const query = useQuery<Patient[]>({
        //queryKey is the name of the data stored in cache to be reused later again instead or parsing data all over again
        queryKey: ['patients', userId],
        //queryFn is function that query will use to request data as promise which resloves data or a throws error if it fails
        queryFn: async () => {
            if (!userId) {
                throw new Error('UserId is required to fetch patient data ')
            }

            const token = await getToken()
            if (!token) {
                throw new Error('Token is required to fetch patients')
            }
            console.log('Token:', token);

            const response = await fetch ('http://localhost:3000/api/patients/search?=q${encodedURIcomponent(query)}', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData?.error || `Failed to fetch patients (status ${response.status})`);
            }

            //destructure the data object from the response
            const { data } = await response.json()
            return data || [];
        }
    })
    return query
}