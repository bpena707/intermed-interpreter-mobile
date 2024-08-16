import { View, Text, StyleSheet } from 'react-native';
import {Link, useLocalSearchParams} from "expo-router";
import {useGetIndividualAppointment} from "@/app/features/appointments/api/use-get-individual-appointment";

export default function Tab() {
    const { id } = useLocalSearchParams<{id: string}>()
    const appointmentQuery = useGetIndividualAppointment(id)
    const appointment = appointmentQuery.data || []


    return (
        <View style={styles.container}>
            <Text>{appointment.id}</Text>
            <Text>{appointment.name}</Text>
            <Text>{appointment.startTime}</Text>
            <Text>{appointment.endTime}</Text>
            <Text>{appointment.appointmentType}</Text>
            <Link href={'/(modals)/appointmentActions'}>appointmentActions</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
