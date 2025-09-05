import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomButton from "@/app/components/ui/custom-button";
import {useClerk} from "@clerk/clerk-expo";
import {useRouter} from "expo-router";
import {useGetAvailableOffers} from "@/app/features/appointments/api/use-get-available-offers";
import Octicons from '@expo/vector-icons/Octicons';

interface IndexHeaderProps {
    onSearchPress: () => void; // Function to call when search is pressed
}

const IndexHeader = ({
    onSearchPress,
}: IndexHeaderProps) => {
    const { signOut } = useClerk()
    const router = useRouter()

    const {data: offers} = useGetAvailableOffers()

    const offerCount = offers?.length || 0

    return (
        <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
                <View style={styles.container}>
                    <View style={styles.actionRow}>
                        <CustomButton className='h-10 w-10 mr-1 bg-[#f0f0f0] border-[#f0f0f0] rounded-full' onPress={() => signOut({redirectUrl: '/'})} >
                            <View >
                                <FontAwesome name="sign-out" size={20} color="black" className='border-none' />
                            </View>
                        </CustomButton>
                            <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
                                <Ionicons name={'search'} size={20} />
                                <View>
                                    <Text>
                                        Search patient by name
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/appointment/offers')}  style={styles.alertButton} >
                            <Octicons name="bell" size={20} color="black" />
                            {offerCount > 0 && (
                                <View
                                    className="absolute right-0 top-0 bg-blue-500 rounded-full w-4 h-4 items-center justify-center"
                                >
                                    <Text className={'text-white'}>
                                        {offerCount}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: 60,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        paddingBottom:16,
        alignItems: 'center',
    },
    alertButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 20,
        borderColor: Colors.gray,
    },
    searchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 30,
        borderColor: Colors.lightGray,
        borderWidth: StyleSheet.hairlineWidth,
        width: 280,


        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: {
            width: 1,
            height: 1,
        }
    }

})

export default IndexHeader;