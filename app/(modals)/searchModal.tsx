import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {Input} from "@/app/components/ui/input";

export default function Tab() {
    return (
        <SafeAreaView >
            <View >
                <Input
                    placeholder={'Search patient by name...'}
                    returnKeyLabel={'Search'}
                />
            </View>

        </SafeAreaView>
    );
}


