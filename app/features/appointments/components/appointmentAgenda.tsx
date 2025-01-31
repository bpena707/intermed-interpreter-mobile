//this file will contain the agenda component from react-native-calendars

import {ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Agenda} from "react-native-calendars";
import {useGetAppointments} from "@/app/features/appointments/api/use-get-appointments";
import Colors from "@/constants/Colors";
import {formatDataForAgenda} from "@/lib/utils";
import {AntDesign, FontAwesome6} from "@expo/vector-icons";
import { format, parse } from 'date-fns';
import {Link, router} from "expo-router";

const AgendaComponent = () => {
    const { data: appointment, isLoading, isError } = useGetAppointments();
    const formattedData: any = formatDataForAgenda(appointment ?? []);

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
        //the start time and end time are in 24 hour format, so we need to convert them to 12 hour format useing date-fns parser and formatter
        const timeStringStartTime = appointment.startTime;
        const parsedStartTime = parse(timeStringStartTime, "HH:mm:ss", new Date());
        const formattedStartTime = format(parsedStartTime, "hh:mm a");

        const timeStringEndTime = appointment.endTime;
        const parsedEndTime = parse(timeStringEndTime, "HH:mm:ss", new Date());
        const formattedEndTime = format(parsedEndTime, "hh:mm a");

        const appointmentType = () => {
            switch (appointment.appointmentType) {
                case 'Follow-Up':
                    return 'rgba(70, 130, 180, 0.5)'
                case 'Initial':
                    return 'rgba(255, 159, 127, 0.5)'
                case 'IME/AME':
                    return 'rgba(128, 128, 0, 0.5)'
                case 'Second-Opinion':
                    return 'rgba(128, 0, 0, 0.5)'
                case 'QME':
                    return 'rgba(255, 215, 0, 0.5)'
                case 'Conference':
                    return 'rgba(128, 0, 128, 0.5)'
                case 'IEP':
                    return 'rgba(255, 105, 180, 0.5)'
                case 'Other':
                    return 'rgba(112, 128, 144, 0.5)'

            }

        }

        return(
            // <Link
            //     href={`/appointment/${appointment.id}`}
            //     style={[styles.item, { height: appointment.height, backgroundColor: appointmentType() }]}
            //     asChild>
                <TouchableOpacity
                    style={[styles.item, { height: appointment.height, backgroundColor: appointmentType() }]}
                    className='flex-row justify-between items-center '
                    onPress={() => router.push(`/appointment/${appointment.id}`)}
                >
                    <View className='justify-center gap-y-1'>
                        <Text className='capitalize' >{appointment.patient} {appointment.patientLastName}</Text>
                        <Text>{formattedStartTime}-{formattedEndTime}</Text>
                        <Text className='capitalize'>{appointment.facility}</Text>
                        <Text>{appointment.facilityAddress} {appointment.facilityCity} {appointment.facilityState}</Text>
                    </View>
                    <View>
                        <AntDesign name="rightcircleo" size={24} color="#D8DCE2" />
                    </View>
                </TouchableOpacity>
            // </Link>
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
        marginTop: 17,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 0.5, width: 0.5 }, // IOS
        shadowOpacity: 0.5, // IOS
        shadowRadius: 10, //IOS
        elevation: 1, // Android
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
    },
    button: {
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        backgroundColor: '#fff',
        elevation: 2, // Android



    }
})