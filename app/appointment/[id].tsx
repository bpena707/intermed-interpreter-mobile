import { View, Text, StyleSheet } from 'react-native';
import {Link, useLocalSearchParams} from "expo-router";

export default function Tab() {
    const { id } = useLocalSearchParams<{id: string}>()
    return (
        <View style={styles.container}>
            <Text>Appointment</Text>
            <Link href={'/(modals)/appointmentActions'}>appointmentActions</Link>
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
