// hooks/useGetAvailableOffers.ts
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {useAuth} from "@clerk/clerk-expo";
import axios from "axios";
import {useCallback} from "react";

export interface OfferResponse {
    appointmentId: string;
    bookingId: number;
    date: Date | string;
    startTime: string;
    appointmentType: string | null;
    isRushAppointment: boolean;
    facilityName: string;
    facilityAddress: string;
    patientFirstName: string;
    patientLastName: string;
    distanceMiles: string;
    notifiedAt: Date | string;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const useGetAvailableOffers = () => {
    const { getToken, userId } = useAuth()
    const queryClient = useQueryClient()

    const query = useQuery<OfferResponse[]>({
        queryKey: ['available-offers', userId],
        queryFn: async () => {
            if (!userId) {
                throw new Error('UserId is required to fetch offers')
            }

            const token = await getToken()
            if (!token) {
                throw new Error('Token is required to fetch offers')
            }

            if (!apiUrl) {
                console.error("apiUrl environment variable is not set!");
                throw new Error("API configuration error.");
            }

            const url = `${apiUrl}/appointments/offers/available`;
            console.log(`Making GET request to: ${url}`)

            try {
                const response = await axios.get(url, {
                    headers: {
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
            } catch (error) {
                console.error('Failed to fetch offers:', error);

                if (axios.isAxiosError(error)) {
                    console.error('Axios error details:', error.response?.status, error.response?.data);
                    const statusText = error.response?.statusText ? ` (${error.response.statusText})` : '';
                    const serverMessage = typeof error.response?.data === 'string' ? `: ${error.response.data}` : '';
                    throw new Error(`Failed to fetch offers: Server responded with status ${error.response?.status}${statusText}${serverMessage || (' - ' + error.message)}`);
                } else if (error instanceof Error) {
                    throw new Error(`Failed to fetch offers: ${error.message}`);
                } else {
                    throw new Error('An unexpected error occurred while fetching offers.');
                }
            }
        },
        staleTime: 10000, // 10 seconds - shorter for offers since they're time-sensitive
        refetchInterval: 30000, // Auto-refresh every 30 seconds to get new offers
        refetchOnWindowFocus: true
    })

    const refetchWithClearCache = useCallback(async () => {
        console.log('Clearing offers cache and refetching...');

        await queryClient.invalidateQueries({
            queryKey: ['available-offers', userId]
        });

        return query.refetch();
    }, [queryClient, userId]);

    return {
        ...query,
        refetchWithClearCache
    }
}