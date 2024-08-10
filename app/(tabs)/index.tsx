import { View, Text, StyleSheet } from 'react-native';
import {Link, Stack} from "expo-router";
import IndexHeader from "@/app/components/indexHeader";

export default function Tab() {
    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    header: () => <IndexHeader />
                }}
            />
            {/*<Text>Tab Home</Text>*/}
            {/*<Link href={`/appointment/123`}>appointment detail</Link>*/}
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
