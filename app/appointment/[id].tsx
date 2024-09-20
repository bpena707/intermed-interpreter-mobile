import {View, Text, StyleSheet, SafeAreaView, Button, ActivityIndicator, ScrollView, RefreshControl} from 'react-native';
import {Link, Stack, useLocalSearchParams} from "expo-router";
import {useGetIndividualAppointment} from "@/app/features/appointments/api/use-get-individual-appointment";
import {useGetIndividualFacility} from "@/app/features/facilities/api/use-get-individual-facility";
import {useGetIndividualPatient} from "@/app/features/patients/use-get-individual-patient";
import Map from "@/app/components/map";
import {FontAwesome6} from "@expo/vector-icons";
import CustomButton from "@/app/components/ui/CustomButton";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/components/ui/card";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useCallback, useState} from "react";
import { Facility } from "@/types/apiTypes";
import {format, parse} from "date-fns";
import {formatPhoneNumber} from "@/lib/utils";

export default function Tab() {


    //this series of functions is used to get the appointment id from the url, and then use that id to get the appointment data,
    // then extract data from the appointment object or if it is empty its null object
    const { id } = useLocalSearchParams<{id: string}>()
    // const appointmentQuery = useGetIndividualAppointment(id)
    // const appointment = appointmentQuery.data || []
    //
    // const facilityQuery = useGetIndividualFacility(appointment.facilityId)
    // const facility = facilityQuery.data || []

    const { data: appointment, isLoading: isAppointmentLoading, error: appointmentError } = useGetIndividualAppointment(id)
    const { data: facility , isLoading: isFacilityLoading, error: facilityError } = useGetIndividualFacility(appointment?.facilityId);
    const {data: patient, isLoading: isPatientLoading, error: patientError} = useGetIndividualPatient(appointment?.patientId)


    if (isAppointmentLoading || isFacilityLoading || isPatientLoading) return <ActivityIndicator size='large' />

    // const [refreshing, setRefreshing] = useState(false);
    // const onRefresh = useCallback(() => {
    //     setRefreshing(true);
    //     setTimeout(() => setRefreshing(false), 2000);
    //
    // },[])

    const timeStringStartTime = appointment?.startTime;
    const parsedStartTime = parse(timeStringStartTime || '', "HH:mm:ss", new Date());
    const formattedStartTime = format(parsedStartTime, "hh:mm a");

    const timeStringEndTime = appointment?.endTime;
    const parsedEndTime = parse(timeStringEndTime || '', "HH:mm:ss", new Date());
    const formattedEndTime = format(parsedEndTime, "hh:mm a");

    const appointmentStatus = () =>{
        switch (appointment?.status) {
            case 'Confirmed':
                return (
                    <View className='flex-row items-center bg-[#10b981] rounded-2xl px-2.5 py-1'>
                        <Text className='font-semibold'>Confirmed</Text>
                    </View>
                )
            case 'Pending':
                return (
                    <View className='flex-row items-center bg-[#fde047] rounded-2xl px-2.5 py-1'>
                        <Text className='font-semibold'>Pending</Text>
                    </View>
                )
            case 'Closed':
                return (
                    <View className='flex-row items-center bg-[#0ea5e9] rounded-2xl px-2.5 py-1'>
                        <Text className='font-semibold'>Closed</Text>
                    </View>
                )
            case 'Cancelled':
                return (
                    <View className='flex-row items-center bg-red-500 rounded-2xl px-2.5 py-1'>
                        <Text className='font-semibold'>Cancelled</Text>
                    </View>
                )
        }
    }
    return (
        <SafeAreaView style={{ flex:1, marginBottom: 0 }}>
            <Stack.Screen
                options={{
                    headerTitle: '',
                    headerStyle: {
                        backgroundColor: '#fff',
                    },
                    headerBackTitle: 'Back',
                    headerShadowVisible: false,

                }}
            />

            <ScrollView
                className={'flex-1'}
                // refreshControl={
                //     <RefreshControl
                //         refreshing={refreshing}
                //         onRefresh={onRefresh}
                //     />
                // }
            >
                <View>
                    <Card className={'rounded-t-none'}>
                        <CardHeader className='pt-0 '>
                            <CardTitle className='flex-row justify-between mb-2' >
                                <Text>Certified Medical</Text>
                            </CardTitle>
                            <CardDescription>
                                <Text>{appointmentStatus()}</Text>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='justify-center items-center'>
                            <View style={{ height: 200, width: '100%' }}>
                                <Map />
                            </View>
                        </CardContent>
                        <CardFooter>
                            {facility ? (
                                <View className={'flex flex-row items-center justify-start'}>
                                    <Ionicons name="location-outline" size={20} color="#f43f5e" />
                                    <Text >{facility.address} {facility.city}, {facility.state} {facility.zipCode}</Text>
                                </View>
                            ) : (
                                <Text>Facility not found</Text>
                            )}
                        </CardFooter>
                    </Card>
                </View>
                <View className='mt-2'>
                    <Card>
                        <CardHeader >
                            <CardTitle>
                                <Text>Patient</Text>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {patient ? (
                                <View>
                                    <Text className='capitalize'>Patient: {patient.firstName} {patient.lastName}</Text>
                                    <Text>Contact: {formatPhoneNumber(patient.phoneNumber)}</Text>
                                    <Text className='capitalize'>Language: {patient.preferredLanguage}</Text>
                                </View>
                            ) : (
                                <Text>Patient not found</Text>
                            )}
                        </CardContent>
                    </Card>
                </View>
                <View className='mt-2'>
                    <Card>
                        <CardHeader >
                            <CardTitle>
                                <Text>Appointment Details</Text>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {appointment && facility ? (
                                <View>
                                    <Text className='capitalize'>Facility: {facility.name} | Specialty: {facility.facilityType}</Text>
                                    <Text className='capitalize'>Facility Contact: {formatPhoneNumber(facility.phoneNumber)}</Text>
                                    <Text className='capitalize'>Appointment Type: {appointment.appointmentType}</Text>
                                    <Text>Duration: {formattedStartTime} - {formattedEndTime}</Text>
                                </View>
                            ) : (
                                <Text>Patient not found</Text>
                            )}
                        </CardContent>
                    </Card>
                </View>
                <View className={'mx-5 mt-5 flex-col'}>

                </View>

            </ScrollView>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerText :{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom    : 20

    },
    infoContainer: {
        alignItems: "flex-start",
        marginLeft: 20

    }

});
