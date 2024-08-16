//this file will contain the agenda component from react-native-calendars

import {View, Text, StyleSheet, ActivityIndicator, Pressable} from "react-native";
import {Agenda} from "react-native-calendars";
import {useGetAppointments} from "@/app/features/appointments/api/use-get-appointments";
import Colors from "@/constants/Colors";
import {AgendaItemsMap, formatDataForAgenda} from "@/lib/utils";
import app from "react-native/template/App";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {FontAwesome6} from "@expo/vector-icons";
import {bold} from "colorette";

const AgendaComponent = () => {
    const { data, isLoading, isError } = useGetAppointments();
    const formattedData: any = formatDataForAgenda(data ?? []);

    if (isLoading) {
        return (
            <View>
                <ActivityIndicator size={"large"} color= {Colors.primary} />
            </View>
        )
    }

    if(isError) {
        return (
            <View>
                <Text>Failed to fetch appointments</Text>
            </View>
        )
    }

    const renderItem =(appointment: any) => {
        return(
            <Pressable style={[styles.item, { height: appointment.height }]}>
                <Text >{appointment.name}</Text>
                <Text>{appointment.startTime}-{appointment.endTime}</Text>
                <Text>{"Appointment Type: " + appointment.appointmentType}</Text>


            </Pressable>
        )

    }

    const renderEmptyDate = () => {
        return (
            <View style={styles.emptyData}>
                <FontAwesome6 style={{ marginBottom: 20 }} name="calendar-xmark" size={50} color="black" />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>No appointments today</Text>
            </View>
        )
    }

    return(
        <View style={styles.container}>
            <Agenda
                items={formattedData}
                renderItem={renderItem}
                showOnlySelectedDayItems
                renderEmptyData={renderEmptyDate}
                theme={{
                    selectedDayBackgroundColor: '#ef4444',
                    todayTextColor: '#ef4444',
                    dotColor: '#0284c7',
                    textDayFontWeight: '600',
                    textMonthFontWeight: 'bold',
                    agendaTodayColor: '#ef4444',
                }}

            />
        </View>
    )
}

export default AgendaComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})