import {Alert, FlatList, RefreshControl, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {useGetAvailableOffers} from "@/app/features/appointments/api/use-get-available-offers";
import {OfferResponse} from "@/app/features/appointments/api/use-get-available-offers";
import {useRouter} from "expo-router";
import {format, parse} from "date-fns";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import {useDeclineOffer} from "@/app/features/appointments/api/use-decline-offer";
import {useAcceptOffer} from "@/app/features/appointments/api/use-accept-offer";


const offers = () => {
    const {data: offers, isLoading, refetch, isRefetching} = useGetAvailableOffers()
    const router = useRouter();

    const acceptMutation = useAcceptOffer()
    const declineMutation = useDeclineOffer()

    const handleAcceptWithConfirmation = (appointmentId: string, bookingId: number) => {
        Alert.alert(
            "Accept Appointment",
            `Are you sure you want to accept booking #${bookingId}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Accept",
                    onPress: () => acceptMutation.mutate(appointmentId)
                }
            ]
        );
    }

    const handleDeclineWithConfirmation = (appointmentId: string, bookingId: number) => {
        Alert.alert(
            "Decline Appointment",
            `Are you sure you want to decline booking #${bookingId}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Decline",
                    style: 'destructive',
                    onPress: () => declineMutation.mutate(appointmentId)
                }
            ]
        );
    }

    const renderOffer = ({item}: {item: OfferResponse}) => {

        const timeStringStartTime = item?.startTime;
        const parsedStartTime = parse(timeStringStartTime || '', "HH:mm:ss", new Date());
        const formattedStartTime = format(parsedStartTime, "hh:mm aaa");

        return (
                <View className={'bg-white rounded-xl py-2 pl-2 pr-24 mb-3 shadow-sm relative'}>
                    <View>
                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                            Booking Id: {item.bookingId}
                        </Text>
                        <Text className={'text-sm font-semibold text-gray-900 mb-1 capitalize'}>
                            {item.facilityName}
                        </Text>
                    </View>

                    <View className="flex-row mb-1v items-center">
                        <Text className="text-gray-600 text-sm flex-1">
                            {item.facilityAddress}
                        </Text>
                    </View>
                    <View className="flex-row items-center mb-2">
                        <Text className="text-gray-600 text-sm">
                            {format(new Date(item.date), 'EEEEEE, MMM dd, yyyy')} at {formattedStartTime}
                        </Text>
                    </View>
                    {item.appointmentType && (
                        <Text className="text-gray-600 text-sm mt-1">
                            Type: {item.appointmentType}
                        </Text>
                    )}

                    <Text className="text-blue-600 font-medium mt-1">
                        Distance: {parseFloat(item.distanceMiles).toFixed(1)} miles
                    </Text>
                    <View className="absolute right-0 top-0 bottom-0 w-20 flex flex-col">
                        <TouchableOpacity
                            className="flex-1 bg-green-500/70 items-center justify-center rounded-tr-xl "
                            onPress={() => handleAcceptWithConfirmation(item.appointmentId, item.bookingId)}
                            disabled={acceptMutation.isPending}
                        >
                            <FontAwesome5 name="check-circle" size={24} color="green" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-1 bg-red-500/70 items-center justify-center rounded-br-xl"
                            onPress={() => handleDeclineWithConfirmation(item.appointmentId, item.bookingId)}
                            disabled={declineMutation.isPending}
                        >
                            <Feather name="x-circle" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                </View>
            )
    }

    return (
        <SafeAreaView className={'flex-1 bg-white'}>
            <View className="flex-row items-center px-5 py-4 bg-white border-b border-gray-200 space-x-5">
                <TouchableOpacity onPress={() => router.back()} className="mr-8">
                    <Text className="text-blue-600 text-base">Back</Text>
                </TouchableOpacity>
                <View>
                    <Text className="text-2xl font-bold text-gray-900">
                        Available Offers
                    </Text>
                    <Text className="text-sm text-gray-700 mt-1">
                        {offers?.length || 0} appointment{offers?.length !== 1 ? 's' : ''} available
                    </Text>
                </View>
            </View>
            <FlatList
                data={offers}
                renderItem={renderOffer}
                keyExtractor={(item) => item.appointmentId}
                contentContainerStyle={{ padding: 8 }}
                refreshControl={
                    <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
                }
                ListEmptyComponent={
                    <View className="items-center mt-16">
                        <Text className="text-gray-600 text-base">
                            No offers available at the moment
                        </Text>
                        <Text className="text-gray-400 text-sm mt-2">
                            Pull down to refresh
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    )
}

export default offers