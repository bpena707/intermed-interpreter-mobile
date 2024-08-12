import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from "@tanstack/react-query";
import { useGetAppointments } from "@/app/api/use-get-appointments";

interface Appointment {
    id: string;
    date: string;
    notes: string | null;
    startTime: string;
    endTime: string | null;
    appointmentType: string | null;
    facility: string;
    facilityId: string | null;
    patient: string;
    patientId: string | null;

}

export default function Tab() {
    const { data } = useGetAppointments()

    return (
        <View style={styles.container}>
            <Text>Appointments</Text>
            {data?.map((appointment: Appointment) => (
                <View key={appointment.id}>
                    <Text>{appointment.date}</Text>
                    <Text>{appointment.facility}</Text>
                    <Text>{appointment.patient}</Text>
                </View>
            ))}
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
