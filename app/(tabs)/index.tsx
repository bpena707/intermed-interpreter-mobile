import { View, Text, StyleSheet } from 'react-native';
import {Link, Stack} from "expo-router";
import IndexHeader from "@/app/components/indexHeader";
import { Agenda } from "react-native-calendars";

export default function Tab() {
    return (
        <View style={{ flex: 1, marginTop: 100 }}>
            <Stack.Screen
                options={{
                    header: () => <IndexHeader />
                }}
            />
            <Agenda />
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
