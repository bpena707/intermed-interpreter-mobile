import { View, Text, StyleSheet } from 'react-native';
import CustomButton from "@/app/components/ui/CustomButton";

export default function Tab() {
    return (
        <View className={'items-center justify-center'}>

                <CustomButton title={"Confirm"} bgVariant={'danger'} textVariant={'danger'}   />

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
