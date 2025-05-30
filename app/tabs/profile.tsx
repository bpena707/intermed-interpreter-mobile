import {View, Text, StyleSheet, Image, ActivityIndicator, Alert, TouchableOpacity} from 'react-native';
import AgendaComponent from "@/app/features/appointments/components/appointmentAgenda";
import IndexHeader from "@/app/features/appointments/components/indexHeader";
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import {UserButton} from "@clerk/clerk-react";
import {useUser} from "@clerk/clerk-expo";
import {useGetCurrentInterpreter} from "@/app/features/profile/api/use-get-interpreter";
import {useDeleteInterpreter} from "@/app/features/profile/api/use-delete-interpreter";
import Toast from "react-native-toast-message";

export default function ProfileClient() {
    // const { data: interpreter } = useGetCurrentInterpreter()
    const { user, isLoaded } = useUser()
    const router = useRouter()

    const deleteAccount = useDeleteInterpreter(user?.id || '')

    if (!isLoaded) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // --- Handle Case where user is somehow not available after loading ---
    if (!user) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-gray-500 dark:text-gray-400">User data not available.</Text>
            </View>
        );
    }

    const handleDeleteAlert = () => {
        if (!user?.id) { // Safety check
            Toast.show({type: 'error', text1: 'Cannot Delete', text2: 'User information is not available.'});
            return;
        }
        Alert.alert("Are you sure you want to delete you account?", "This action cannot be undone and will delete all of your data",[
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                    //Calls the delete user function
                    console.log(`Initiating deletion for user ID: ${user.id}`);
                    deleteAccount.mutate()
                }
            }
        ],
            { cancelable: true }
        );
    }

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    return (
        <View className={'flex flex-1 items-center mt-8 '}>
            {user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} height={120} width={120} borderRadius={24} />
            ) : (
                // Display Initials Fallback if no image
                <View >
                    <Text>no image</Text>
                </View>
            )}

            <Text className='text-2xl font-bold text-black dark:text-white'>
                {fullName || user.username || 'User Name'} {/* Show full name or fallback */}
            </Text>
            {/* ------------------------------------------ */}

            {/* You can display other info available on the user object too */}
            <Text className='text-lg text-gray-600 dark:text-gray-400 mt-1'>
                {user.primaryEmailAddress?.emailAddress}
            </Text>

            <TouchableOpacity
                onPress={handleDeleteAlert}
                disabled={!user?.id || deleteAccount.isPending}
            >
                {deleteAccount.isPending ? (
                    <ActivityIndicator size="large" />
                ):(
                    <Text className='text-lg text-red-600  mt-5'>
                        delete account
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
