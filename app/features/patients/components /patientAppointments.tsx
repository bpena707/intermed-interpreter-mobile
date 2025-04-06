// app/patientAppointments.tsx (Bare Bones Version)

import React from 'react';
import {View, Text, SafeAreaView, FlatList, TouchableOpacity, Button, ActivityIndicator} from 'react-native';
// Expo Router hooks for navigation parameters and setting screen options
import {useLocalSearchParams, Stack, router} from 'expo-router';
import {PatientAppointment, usePatientAppointments} from "@/app/features/patients/api/use-get-patient-appointments";
import {Card, CardContent, CardHeader, CardTitle} from "@/app/components/ui/card";
import {addHours, format, parse} from "date-fns";
import {useGetIndividualPatient} from "@/app/features/patients/api/use-get-individual-patient";
import Colors from "@/constants/Colors";

export default function PatientAppointmentsScreen() {
    // Get parameters passed from the search modal
    const { patientId, patientName } = useLocalSearchParams<{ patientId: string; patientName?: string }>();

    const {data:patientAppointment, isLoading, isFetching, error} = usePatientAppointments(patientId);





    //this function estabilishes the layout of the appointment item as cards that render in the flatlist
    const renderAppointmentItem = ({ item }: {item: PatientAppointment}) => {

        const appointmentStatus = () => {
            switch (item?.status) {
                case 'Interpreter Requested':
                    return (
                        <View className='flex-row items-center bg-rose-500/20 rounded-2xl px-2.5 py-1'>
                            <Text className='text-pink-700 font-semibold'>Interpreter Requested</Text>
                        </View>
                    )
                case 'Confirmed':
                    return (
                        <View className='flex-row items-center bg-emerald-500/60 rounded-2xl px-2.5 py-1'>
                            <Text className='font-semibold text text-emerald-800'>Confirmed</Text>
                        </View>
                    )
                case 'Pending Authorization':
                    return (
                        <View className='flex-row items-center bg-violet-500/60 rounded-2xl px-2.5 py-1'>
                            <Text className='font-semibold text-violet-800'>Pending Authorization</Text>
                        </View>
                    )
                case 'Pending Confirmation':
                    return (
                        <View className='flex-row items-center bg-yellow-500/60 rounded-2xl px-2.5 py-1'>
                            <Text className='font-semibold text-yellow-700'>Pending Confirmation</Text>
                        </View>
                    )
                case 'Closed':
                    return (
                        <View className='flex-row items-center bg-blue-500/60 rounded-2xl px-2.5 py-1'>
                            <Text className='font-semibold text-blue-800'>Closed</Text>
                        </View>
                    )
                case 'Late CX':
                    return (
                        <View className='flex-row items-center bg-red-700/70 rounded-2xl px-2.5 py-1'>
                            <Text className='font-semibold text-red-950'>Late CX</Text>
                        </View>
                    )
                case 'No Show':
                    return (
                        <View className='flex-row items-center bg-red-700/70 rounded-2xl px-2.5 py-1'>
                            <Text className='font-semibold text-red-950'>No Show</Text>
                        </View>
                    )
            }
        }

        //parse the time string from the appointment object and format it to readable time
        const timeStringStartTime = item.startTime;
        const parsedStartTime = parse(timeStringStartTime || '', "HH:mm:ss", new Date());
        const formattedStartTime = format(parsedStartTime, "hh:mm aaa");

        const timeStringEndTime = item?.endTime;
        const parsedEndTime = item?.endTime ? parse(timeStringEndTime || '', "HH:mm:ss", new Date()) : addHours(parsedStartTime, 2)
        const formattedEndTime = format(parsedEndTime, "hh:mm a");
        return (
            <>
            <TouchableOpacity onPress={() => router.push(`/appointment/${item.id}`)} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 mb-2 w-full">
                <Card>
                    <CardHeader >
                        <CardTitle >
                            <View className={'flex flex-row justify-between items-center w-full '}>
                                <Text className={'text-lg font-bold '}>Booking Id {item.bookingId}</Text>
                                <Text className='text-sm'>{appointmentStatus()}</Text>
                            </View>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                           Date:  {item.date ? format(item.date, 'cccccc, PPP') : ''}
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            Duration: {formattedStartTime} - {formattedEndTime}
                        </Text>
                        <Text>
                            {item.facility}
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            {item.isCertified ? 'Certified' : 'Qualified'}
                        </Text>

                    </CardContent>
                </Card>
            </TouchableOpacity>
        </>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100 dark:bg-black">
            <Stack.Screen
                options={{
                    title: patientName ? `${patientName}` : 'Patient Appointments',
            }}
            />
            <View className="flex-1 p-1 items-center">
                <View className='flex flex-row w-full  gap-x-8'>
                    <View className='position-absolute top-0 left-0'>
                        <Button title="Go Back" onPress={() => router.back()} />
                    </View>
                    <View className='pt-4'>
                        <Text className="text-xl font-bold mb-4 text-center text-black dark:text-white">
                            {patientName || 'Patient Details'}
                        </Text>
                    </View>
                </View>

                {/* Show loading spinner ONLY on initial load OR if error is present but refetching */}
                {(isLoading || (error && isFetching)) && (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
                )}

                {/* Show error message if error occurred and not currently loading/fetching */}
                {error && !isFetching && (
                    <View className="flex-1 items-center justify-center px-4">
                        <Text className="text-red-600 text-center text-base">
                            Error fetching appointments: {error.message}
                        </Text>
                    </View>
                )}
                {/* this section is where the list is rendered using a flatlist */}
                {!isFetching && !isLoading && !error && patientAppointment && patientAppointment.length > 0 && (
                    <FlatList
                        data={patientAppointment} // Use fetched data
                        renderItem={renderAppointmentItem} // Use the render function
                        keyExtractor={(item) => item.id} // Use appointment ID as key
                        // Add some padding at the bottom
                        contentContainerStyle={{ paddingBottom: 20 }}
                        className="p-1 w-full" // Add a little space below header/title area
                    />
                )}

            </View>
        </SafeAreaView>
    );
}