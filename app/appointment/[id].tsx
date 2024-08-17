import {View, Text, StyleSheet, SafeAreaView, Button} from 'react-native';
import {Link, useLocalSearchParams} from "expo-router";
import {useGetIndividualAppointment} from "@/app/features/appointments/api/use-get-individual-appointment";
import Map from "@/app/components/map";

export default function Tab() {

    //this series of functions is used to get the appointment id from the url, and then use that id to get the appointment data,
    // then extract data from the appointment object or if it is empty its null object
    const { id } = useLocalSearchParams<{id: string}>()
    const appointmentQuery = useGetIndividualAppointment(id)
    const appointment = appointmentQuery.data || []


    return (
        <SafeAreaView style={{ flex:1  }}>

            <View style={styles.container}>
                <View >
                    <Text style={styles.headerText}>Certified Medical</Text>
                    <Text>Confirmed</Text>
                </View>
                <View style={{ height: 300, width: 300, marginLeft:50 }}>
                    <Map />
                </View>

                <Text>{appointment.id}</Text>
                <Text>{appointment.facility}</Text>
                <Text>{appointment.startTime}</Text>
                <Text>{appointment.endTime}</Text>
                <Text>{appointment.appointmentType}</Text>
                <Button title={'Confirm'} />
                <Link href={'/(modals)/appointmentActions'}>appointmentActions</Link>
            </View>
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

    }

});
