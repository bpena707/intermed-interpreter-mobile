import {View, Text, StyleSheet, Pressable, Alert} from 'react-native';
import {Link, Stack} from "expo-router";
import IndexHeader from "@/app/components/indexHeader";
import {Agenda, AgendaEntry} from "react-native-calendars";
import {useGetAppointments} from "@/app/api/use-get-appointments";
import {AgendaItemsMap, formatDataForAgenda} from "@/lib/utils";


// const events = {
//     "2024-08-10": [
//         {
//             "id": "1",
//             "name": "Live: notJust.Hack Kickstart",
//             "height": 50,
//             "day": "2022-11-24"
//         }
//     ],
//     "2024-08-11": [
//         {
//             "id": "2",
//             "name": "Workshop: Build any mobile application with React Native",
//             "height": 50,
//             "day": "2022-11-25"
//         },
//         {
//             "id": "3",
//             "name": "Q&A session",
//             "height": 50,
//             "day": "2022-11-25"
//         }
//     ],
// }

export default function Tab() {

    const renderItem = (appointment: AgendaEntry, isFirst: boolean) => {
        const fontSize = isFirst ? 16 : 14;
        const color = isFirst ? 'black' : '#43515c';

        return (
            // Pressable is used to make the appointment clickable
            <Pressable
                style={[styles.item, {height: appointment.height}]}
                onPress={() => Alert.alert('You have an appointment with ' + appointment.name)}
            >
                <Text style={{ fontSize, color }} >
                    {appointment.name}
                </Text>
            </Pressable>

        )
    }

    // this is for if i had a scrollable agenda with multiple days render at the bottom of the calendar for now only one date at a time
    const renderEmptyDate = () => {


        return (
            <View style={styles.emptyDate}>
                <Text>No appointments</Text>
            </View>
        )
    }
    const {data, isLoading, error} = useGetAppointments()
    if (isLoading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;
    const formattedData: AgendaItemsMap = formatDataForAgenda(data ?? [])
    return (
        <View style={{ flex: 1, marginTop: 100 }}>
            <Stack.Screen
                options={{
                    header: () => <IndexHeader />
                }}
            />
            <Agenda
                items={formattedData}
                renderItem={renderItem}
                renderEmptyDate={renderEmptyDate}
                showOnlySelectedDayItems
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
    );
}

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
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
});
