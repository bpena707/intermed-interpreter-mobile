//this file will contain the agenda component from react-native-calendars

import {
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Agenda} from "react-native-calendars";
import {useGetAppointments} from "@/app/features/appointments/api/use-get-appointments";
import Colors from "@/constants/Colors";
import {formatDataForAgenda} from "@/lib/utils";
import {AntDesign, FontAwesome6} from "@expo/vector-icons";
import {addHours, format, parse} from 'date-fns';
import {router} from "expo-router";
import {useCallback, useMemo, useRef, useState} from "react";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';


const AgendaComponent = () => {
    const { data: appointments, isLoading, isError, refetchWithClearCache } = useGetAppointments();
    // const formattedData: any = formatDataForAgenda(appointment ?? []);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const agendaRef = useRef(null);

    // Clean onRefresh without forcing re-mount
    const onRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await refetchWithClearCache();
            console.log("Agenda data refreshed with cache cleared.");
        } catch (error) {
            console.error("Failed to refresh agenda:", error);
        } finally {
            setIsRefreshing(false);
        }
    }, [refetchWithClearCache]);

    // Memoize formatted data with a unique version to force updates
    const formattedData = useMemo(() => {
        console.log("Formatting and sorting agenda data...");
        const formatted = formatDataForAgenda(appointments ?? []);

        // Add a timestamp to each item to ensure uniqueness
        Object.keys(formatted).forEach(dateKey => {
            formatted[dateKey] = formatted[dateKey].map(item => ({
                ...item,
                _version: Date.now() // This forces the agenda to recognize data changes
            }));
        });

        console.log("Formatted data with version:", formatted);
        return formatted;
    }, [appointments]);

    const dataKey = useMemo(() => {
        return JSON.stringify(Object.keys(formattedData).map(dateKey =>
            formattedData[dateKey].map(item => `${item.id}-${item.startTime}`)
        ));
    }, [formattedData]);

    if (isLoading && !isRefreshing) {
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
        //the start time and end time are in 24-hour format, so we need to convert them to 12-hour format useing date-fns parser and formatter
        const timeStringStartTime = appointment.startTime
        const parsedStartTime = parse(timeStringStartTime, "HH:mm:ss", new Date())
        const formattedStartTime = format(parsedStartTime, "hh:mm a")

        const timeStringEndTime = appointment.endTime
        const parsedEndTime = appointment.endTime ? parse(timeStringEndTime, "HH:mm:ss", new Date()) : addHours(parsedStartTime, 2)
        const formattedEndTime = format(parsedEndTime, "hh:mm a")

        // const appointmentType = () => {
        //     switch (appointment.appointmentType) {
        //         case 'Follow-Up':
        //             return {
        //                 backgroundColor: 'rgba(37, 99, 235, 0.85)',
        //                 textColor: 'rgba(29, 78, 216, 1)',
        //             }
        //         case 'Initial':
        //             return 'rgba(255, 159, 127, 0.5)'
        //         case 'IME/AME':
        //             return 'rgba(128, 128, 0, 0.5)'
        //         case 'Second-Opinion':
        //             return 'rgba(128, 0, 0, 0.5)'
        //         case 'QME':
        //             return 'rgba(255, 215, 0, 0.5)'
        //         case 'Conference':
        //             return 'rgba(128, 0, 128, 0.85)'
        //         case 'IEP':
        //             return 'rgba(255, 105, 180, 0.85)'
        //         case 'Other':
        //             return 'rgba(112, 128, 144, 0.5)'
        //
        //     }
        //
        // }

        const getAppointmentStyles = (appointment: any) => {
            switch (appointment.appointmentType) {
                case 'Follow-Up':
                    return {
                        backgroundColor: 'rgba(59, 130, 246, 0.90)', // The darker blue button
                        textColor: 'white' // An even darker blue text
                    };
                case 'Initial':
                    return {
                        backgroundColor: 'rgba(34, 139, 34, 0.90)',
                        textColor: 'rgba(255, 255, 255, 1)' // White text
                    };
                case 'IME/AME':
                    return {
                        backgroundColor: 'rgba(255, 69, 0, 0.90)',
                        textColor: 'rgba(255, 255, 255, 1)' // White text
                    };
                case 'QME':
                    return {
                        backgroundColor: 'rgba(220, 20, 60, 0.90)',
                        textColor: 'rgba(255, 255, 255, 1)' // White text
                    };
                case 'Second-Opinion':
                    return {
                        backgroundColor: 'rgba(139, 0, 139, 0.90)',
                        textColor: 'rgba(255, 255, 255, 1)' // White text
                    };
                case 'Conference':
                    return {
                        backgroundColor: 'rgba(0, 139, 139, 0.90)',
                        textColor: 'rgba(255, 255, 255, 1)' // White text
                    };
                default:
                    return {
                        backgroundColor: 'rgba(112, 128, 144, 0.5)',
                        textColor: 'rgba(255, 255, 255, 1)'
                    };
            }
        };

        const appointmentStatus = () => {
            switch (appointment?.status) {
                case 'Interpreter Requested':
                    return (
                        <View className='flex-row items-center bg-rose-500/20 rounded-2xl px-2.5'>
                            <Text className='text-pink-700 font-semibold'>Interpreter Requested</Text>
                        </View>
                    )
                case 'Confirmed':
                    return (
                        <View className='flex-row items-center bg-emerald-500/60  rounded-2xl px-2.5'>
                            <Text className='font-semibold text-emerald-800 '>Confirmed</Text>
                        </View>
                    )
                case "Pending Authorization":
                    return (
                        <View className='flex-row items-center bg-violet-500/60 rounded-2xl px-2.5'>
                            <Text className='font-semibold text-violet-800'>Pending Authorization</Text>
                        </View>
                    )
                case 'Pending Confirmation':
                    return (
                        <View className='flex-row items-center bg-yellow-500/60 rounded-2xl px-2.5'>
                            <Text className='font-semibold text-yellow-800'>Pending Confirmation</Text>
                        </View>
                    )
                case 'Closed':
                    return (
                        <View className='flex-row items-center bg-sky-500/60 rounded-2xl px-2.5'>
                            <Text className='font-semibold text-blue-700 '>Closed</Text>
                        </View>
                    )
                case 'Late CX':
                    return (
                        <View className='flex-row items-center bg-red-500/60 rounded-2xl px-2.5'>
                            <Text className='font-semibold text-red-700'>Late CX</Text>
                        </View>
                    )
                case 'No Show':
                    return (
                        <View className='flex-row items-center bg-red-700/70 rounded-2xl px-2.5'>
                            <Text className='font-semibold text-red-900'>No Show</Text>
                        </View>
                    )
            }
        }

        const appointmentStyles = getAppointmentStyles(appointment);

        return(
                <TouchableOpacity
                    style={[styles.item, { height: appointment.height, backgroundColor: appointmentStyles.backgroundColor }]}
                    className='flex-row justify-between items-center'
                    onPress={() => router.push(`/appointment/${appointment.id}`)}
                >
                    <View className='justify-center gap-y-1 '>
                        <View className={'flex flex-row items-center gap-x-1'}>
                            <Ionicons name="person-circle-outline" size={12} color="white" />
                            <Text className='capitalize' style={{ color: appointmentStyles.textColor }} >{appointment.patient} {appointment.patientLastName} ({appointment.bookingId})</Text>
                        </View>

                        <View className={'flex flex-row items-center gap-x-1 '}>
                            <Feather name="clock" size={12} color="white"  />
                            <Text className={'text-white  '}>{formattedStartTime}-{formattedEndTime}</Text>
                        </View>
                        <View className={'flex flex-row items-center gap-x-1'}>
                            <Ionicons name="location-outline" size={12} color="white" />
                            <Text className='capitalize text-white'>{appointment.facility}</Text>
                        </View>
                        <Text className={'text-white'}>{appointmentStatus()}</Text>
                    </View>
                    <View>
                        <AntDesign name="rightcircleo" size={24} color="#D8DCE2" />
                    </View>
                </TouchableOpacity>
        )
    }

    const renderEmptyDate = () => {
        return (
            <ScrollView
                contentContainerStyle={styles.emptyData}
                refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                />
            }
            >
                <FontAwesome6 style={{ marginBottom: 20 }} name="calendar-xmark" size={50} color="black" />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>No appointments today</Text>
            </ScrollView>
        )
    }

    return(
        <View style={styles.container}>
            <Agenda
                key={`agenda-${dataKey}`}
                ref={agendaRef}
                items={formattedData}
                renderItem={renderItem}
                showOnlySelectedDayItems
                renderEmptyData={renderEmptyDate}
                selected={selectedDate}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                theme={{
                    selectedDayBackgroundColor: '#ef4444',
                    todayTextColor: '#ef4444',
                    dotColor: '#0284c7',
                    textDayFontWeight: '600',
                    textMonthFontWeight: 'bold',
                    agendaTodayColor: '#ef4444',
                }}
                refreshing={isRefreshing}
                refreshControl={
                <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                />
                }
                contentContainerStyle={{ flexGrow: 1 }}
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
        flexGrow: 1,
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