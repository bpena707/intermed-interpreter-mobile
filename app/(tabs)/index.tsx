import { View, Text, StyleSheet } from 'react-native';
import AgendaComponent from "@/app/features/appointments/components/appointmentAgenda";
import IndexHeader from "@/app/features/appointments/components/indexHeader";
import {Stack} from "expo-router";

export default function Tab() {
    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    header: () => <IndexHeader />
                }}
            />
            <AgendaComponent />

        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100
    },

});
