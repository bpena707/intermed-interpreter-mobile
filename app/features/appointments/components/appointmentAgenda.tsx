//this file will contain the agenda component from react-native-calendars

import {ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Agenda} from "react-native-calendars";
import {useGetAppointments} from "@/app/features/appointments/api/use-get-appointments";
import Colors from "@/constants/Colors";
import {formatDataForAgenda} from "@/lib/utils";
import {FontAwesome6} from "@expo/vector-icons";
import { format, parse } from 'date-fns';
import {Link, router} from "expo-router";

const AgendaComponent = () => {
    const { data, isLoading, isError } = useGetAppointments();
    const formattedData: any = formatDataForAgenda(data ?? []);

    if (isLoading) {
        return (
            <View style={styles.loader}>
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
        const timeStringStartTime = appointment.startTime;
        const parsedStartTime = parse(timeStringStartTime, "HH:mm:ss", new Date());
        const formattedStartTime = format(parsedStartTime, "hh:mm a");

        const timeStringEndTime = appointment.endTime;
        const parsedEndTime = parse(timeStringEndTime, "HH:mm:ss", new Date());
        const formattedEndTime = format(parsedEndTime, "hh:mm a");



        return(
            <Link
                href={`/appointment/${appointment.id}`}
                style={[styles.item, { height: appointment.height }]}
                asChild>
                <TouchableOpacity
                >
                    <Text >{appointment.name}</Text>
                    <Text>{formattedStartTime}-{formattedEndTime}</Text>
                    <Text>{"Appointment Type: " + appointment.appointmentType}</Text>
                    <Text>{appointment.facility}</Text>
                </TouchableOpacity>
            </Link>
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
    },
    loader:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})