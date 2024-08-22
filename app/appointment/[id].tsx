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
    const { data: facility, isLoading: isFacilityLoading, error: facilityError } = useGetIndividualFacility(appointment?.facilityId);
    const {data: patient, isLoading: isPatientLoading, error: patientError} = useGetIndividualPatient(appointment?.patientId)


    if (isAppointmentLoading || isFacilityLoading || isPatientLoading) return <ActivityIndicator size='large' />

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);

    },[])


    console.log(facility)
    console.log(facility.address)
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
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View>
                    <Card className={'rounded-t-none'}>
                        <CardHeader className='pt-0'>
                            <CardTitle >
                                <Text >Certified Medical</Text>
                            </CardTitle>
                            <CardDescription>
                                <Text>Confirmed</Text>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <View style={{ height: 300, width: 300, marginLeft:30 }}>
                                <Map />
                            </View>
                        </CardContent>
                        <CardFooter>
                            <View className={'flex flex-row items-center justify-start'}>
                                <Ionicons name="location-outline" size={20} color="#f43f5e" />
                                <Text >{facility.address} {facility.city}, {facility.state} {facility.zipCode}</Text>
                            </View>
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
                            <Text className='capitalize'>Patient: {patient.firstName} {patient.lastName}</Text>
                            <Text>Contact: {patient.phoneNumber}</Text>
                        </CardContent>
                        <CardFooter>
                            <Text>Card Footer</Text>
                        </CardFooter>
                    </Card>
                </View>
                <View style={styles.infoContainer}>

                    <Text>{facility.operatingHours}</Text>
                    <Text>{facility.phoneNumber}</Text>
                    <Text>{facility.facilityType}</Text>
                    <Text>{appointment.startTime}</Text>
                    <Text>{appointment.endTime}</Text>
                    <Text>{appointment.appointmentType}</Text>
                    <Link href={'/(modals)/appointmentActions'}>appointmentActions</Link>
                </View>
                <View className={'mx-5 mt-10'}>
                    <CustomButton title={"Confirm"} bgVariant={'primary'} textVariant={'primary'}  />
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
