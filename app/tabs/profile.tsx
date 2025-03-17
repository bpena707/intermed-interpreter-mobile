import { View, Text, StyleSheet } from 'react-native';
import AgendaComponent from "@/app/features/appointments/components/appointmentAgenda";
import IndexHeader from "@/app/features/appointments/components/indexHeader";
import {Stack} from "expo-router";
import Map from "@/app/components/map";

export default function Tab() {
    return (
        <View>
            <Text> Profile </Text>
            <Map/>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100
    },
});
