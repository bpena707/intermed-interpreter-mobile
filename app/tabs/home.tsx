import { View, Text, StyleSheet } from 'react-native';
import AgendaComponent from "@/app/features/appointments/components/appointmentAgenda";
import IndexHeader from "@/app/features/appointments/components/indexHeader";
import {Stack, useLocalSearchParams} from "expo-router";
import {useGetIndividualFacility} from "@/app/features/facilities/api/use-get-individual-facility";

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
        marginTop: 60
    },

});
