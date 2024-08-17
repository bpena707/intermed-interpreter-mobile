import {View, Text, StyleSheet, SafeAreaView, Button, ActivityIndicator, ScrollView} from 'react-native';
import {Link, Stack, useLocalSearchParams} from "expo-router";
import {useGetIndividualAppointment} from "@/app/features/appointments/api/use-get-individual-appointment";
import {useGetIndividualFacility} from "@/app/features/facilities/api/use-get-individual-facility";
import {useGetIndividualPatient} from "@/app/features/patients/use-get-individual-patient";
import Map from "@/app/components/map";
import {FontAwesome6} from "@expo/vector-icons";

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


    console.log(facility)
    console.log(facility.address)
    return (
        <SafeAreaView style={{ flex:1  }}>
            <Stack.Screen
                options={{
                    headerTitle: '',
                    headerTransparent: true,
                    headerBackTitle: 'Back',
                    headerTintColor: 'black',
                }}
            />

            <ScrollView style={styles.container}>
                <View >
                    <Text style={styles.headerText}>Certified Medical</Text>
                    <Text>Confirmed</Text>
                </View>
                <View style={{ height: 300, width: 300, marginLeft:50 }}>
                    <Map />
                </View>
                <View style={styles.infoContainer}>
                    <View>
                        <Text>Patient: {patient.firstName} {patient.lastName}</Text>
                        <Text>Contact: {patient.phoneNumber}</Text>
                    </View>
                    <Text>Facility: {facility.name}</Text>
                    <Text>Address: {facility?.address}</Text>
                    <FontAwesome6 name="location-dot" size={16} color="black" />
                    <Text>{facility.city} {facility.state}</Text>
                    <Text>{facility.zip}</Text>
                    <Text>{facility.operatingHours}</Text>
                    <Text>{facility.phoneNumber}</Text>
                    <Text>{facility.facilityType}</Text>
                    <Text>{appointment.startTime}</Text>
                    <Text>{appointment.endTime}</Text>
                    <Text>{appointment.appointmentType}</Text>
                    <Button title={'Confirm'} />
                    <Link href={'/(modals)/appointmentActions'}>appointmentActions</Link>
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
