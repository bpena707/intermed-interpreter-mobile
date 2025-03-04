import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Link, Stack} from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import CustomButton from "@/app/components/ui/custom-button";
import {useClerk} from "@clerk/clerk-expo";

const IndexHeader = () => {
    const { signOut } = useClerk()

    return (
        <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
                <View style={styles.container}>
                    <View style={styles.actionRow}>
                        <CustomButton className='h-10 w-10 mr-1 bg-[#f0f0f0] border-[#f0f0f0] rounded-full' onPress={() => signOut({redirectUrl: '/'})} >
                            <View >
                                <FontAwesome name="sign-out" size={20} color="black" className='border-none' />
                            </View>

                        </CustomButton>
                        {/*asChild allows link to be used around touchable opacity */}
                        <Link href={'/(modals)/searchModal'} asChild>
                            <TouchableOpacity style={styles.searchButton}>
                                <Ionicons name={'search'} size={20} />
                                <View>
                                    <Text>
                                        Search patient by name
                                    </Text>
                                </View>

                            </TouchableOpacity>
                        </Link>
                        <TouchableOpacity style={styles.alertButton} >
                            <FontAwesome name={'bell'} size={20} color={'#000'} />
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