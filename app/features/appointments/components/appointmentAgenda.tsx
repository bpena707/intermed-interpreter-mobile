//this file will contain the agenda component from react-native-calendars

import {View, Text, StyleSheet} from "react-native";
import {Agenda} from "react-native-calendars";
import { Appointment } from "@/types/appointmentTypes";

const AgendaComponent = () => {


    return(
        <View style={styles.container}>
            <Agenda

            />
        </View>
    )
}

export default AgendaComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})