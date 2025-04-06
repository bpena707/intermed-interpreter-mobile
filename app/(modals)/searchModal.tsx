import {
    View,
    Text,
    SafeAreaView,
    Keyboard,
    TouchableOpacity,
    ActivityIndicator,
    FlatList, Modal, Pressable
} from 'react-native';
import {Input} from "@/app/components/ui/input";
import {PatientSearchResult, useSearchPatients} from "@/app/features/patients/api/use-search-patient";
import {useEffect, useState} from "react";
import {useRouter} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";

interface SearchModalProps {
    visible: boolean;
    onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ visible, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter()

    const {data: patients, isLoading, isError, isFetching, error} = useSearchPatients(searchQuery)

    const handleSearchChange = (text: string)=> {
        setSearchQuery(text)
    }

    const handlePatientSelect = (patient: PatientSearchResult) => {
        Keyboard.dismiss()
        onClose();
        setTimeout(() => {
            router.push({
                pathname: '/features/patients/components /patientAppointments',
                params: {
                    patientId: patient.id,
                    patientName: `${patient.firstName} ${patient.lastName}`
                }
            })
        }, 50)

    }

    const isQueryEnabled = searchQuery.trim().length > 0;

    const renderPatientItem = ({item}: {item: PatientSearchResult}) => {
        return (
            <TouchableOpacity
                className="py-3 px-1.5 border-b border-gray-200 dark:border-gray-700 active:opacity-70" // Added dark mode border
                onPress={() => handlePatientSelect(item)}
            >
                <Text className="text-base font-medium text-black dark:text-white">{item.firstName} {item.lastName}</Text>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        if (!visible) {
            setSearchQuery('');
        }
    }, [visible]);

    return (
        <Modal
            animationType="slide" // Or 'fade'
            presentationStyle={'fullScreen'} // iOS specific style, similar to Expo Router modal
            transparent={false} // Usually false for full screen modals
            visible={visible}
            onRequestClose={onClose} // For hardware back button on Android
        >

        <SafeAreaView className='flex-1 bg-gray-100 dark:bg-gray-900' >
            <View className='flex-row bg-gray-100 dark:bg-gray-800 p-3 h-[60px] items-center justify-center border-b border-gray-200 dark:border-gray-700 relative rounded-t-lg'>
                <Text className='text-lg font-semibold text-black dark:text-white'>Search Patient</Text>
                <Pressable
                    onPress={onClose} // Calls the close function from parent
                    // Increase touch area, add rounding, subtle feedback
                    className='absolute right-2 top-0 bottom-0 justify-center p-2 active:opacity-60'
                >
                    <Text> <Ionicons name="close" size={30} color="#6B7280" />  </Text>
                </Pressable>
                {/* ------------------------- */}
            </View>
            <View className={'flex-1 p-4'} >
                {/*<View className='justify-center'>*/}
                {/*    <Text className='text-2xl font-semibold mb-2'>Patient Search</Text>*/}
                {/*    <Pressable*/}
                {/*        onPress={onClose} // Calls the close function from parent*/}
                {/*        // Increase touch area, add rounding, subtle feedback*/}
                {/*        className='absolute right-2 top-0 bottom-0 justify-center p-1 active:opacity-60'*/}
                {/*    >*/}
                {/*        <Text><Ionicons name="close" size={30} color="#6B7280" />  </Text>*/}
                {/*    </Pressable>*/}
                {/*</View>*/}

                <Input
                    placeholder={'Search patient by name...'}
                    returnKeyLabel={'Search'}
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    returnKeyType={'search'}
                    autoFocus
                    className='w-full rounded-md'
                />

                {/* Loading Indicator: Show if fetching (initial or background) */}
                {isFetching && <ActivityIndicator size="large" className="mt-5" color={Colors.primary} />}

                {/* Error Message: Show if error occurred and not currently fetching */}
                {error && !isFetching && <Text className="text-red-600 text-center mt-5">Error: {error.message}</Text>}

                {/* No Results Message: Show if not fetching, no error, query was enabled, but patients array is empty */}
                {!isFetching && !error && isQueryEnabled && patients?.length === 0 && (
                    <Text className="text-center mt-5 text-gray-500 dark:text-gray-400">No patients found matching "{searchQuery}"</Text>
                )}

                {/* Results List: Show if not fetching, no error, and patients array has data */}
                {!isFetching && !error && patients && patients.length > 0 && (
                    <FlatList
                        data={patients} // Use the data from the hook
                        renderItem={renderPatientItem}
                        keyExtractor={(item) => item.id}
                        className="mt-2.5"
                        keyboardShouldPersistTaps="handled"
                    />
                )}
            </View>
        </SafeAreaView>
        </Modal>
    );
}

export default SearchModal;


