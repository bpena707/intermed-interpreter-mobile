import {Text, TouchableOpacity, View} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import {router} from "expo-router";

export const BackButton= () => {
    return(
        <View className='flex-row items-center '>
            <TouchableOpacity onPress={router.back} className='flex-row m-0 items-center pl-1'>
                <Ionicons name="chevron-back" size={24} color="black" />
                <Text className='text-lg text-blue-700'>Back</Text>
            </TouchableOpacity>
        </View>
    )
}