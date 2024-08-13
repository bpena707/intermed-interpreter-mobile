import {View, Text, StyleSheet, FlatList} from 'react-native';
import { useQuery } from "@tanstack/react-query";
import { useGetAppointments } from "@/app/api/use-get-appointments";
import {AgendaItemsMap, formatDataForAgenda} from "@/lib/utils";

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
export interface FormattedAppointment {
    id: string;
    startTime: string;
    endTime: string;
    appointmentType: string;
    facility: string;
    patient: string;
    notes: string | null;
    date: string;  // Adding a formatted date string for display
}

export default function Tab() {
    const { data } = useGetAppointments()

    const formattedData: AgendaItemsMap = formatDataForAgenda(data);

    return (
        <View>
            <Text>History</Text>
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
