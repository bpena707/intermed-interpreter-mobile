import {Text, TouchableOpacity, View} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import {router} from "expo-router";

export const BackButton= () => {
    return(
        <View className='flex-row items-center '>
            <TouchableOpacity onPress={router.back} className='flex-row  items-center pl-1 top-0 pb-1 pt-1 mb-0 ml-1 bg-white rounded-2xl pr-2'>
                <Ionicons name="chevron-back" size={24} color="black" />
                <Text className='text-lg text-blue-700'>Back</Text>
            </TouchableOpacity>
        </View>
    )
}