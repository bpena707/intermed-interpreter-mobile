import { View, Text, StyleSheet } from 'react-native';
import AgendaComponent from "@/app/features/appointments/components/appointmentAgenda";
import IndexHeader from "@/app/features/appointments/components/indexHeader";
import {Stack, useLocalSearchParams} from "expo-router";
import {useGetIndividualFacility} from "@/app/features/facilities/api/use-get-individual-facility";
import {useState} from "react";
import SearchModal from "@/app/(modals)/searchModal";

export default function Home() {
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);

    //Handler for opening the search modal
    const openSearchModal = () => {
        console.log("Opening search modal..."); // Add log for debugging
        setIsSearchModalVisible(true);
    };

    const closeSearchModal = () => {
        console.log("Closing search modal..."); // Add log for debugging
        setIsSearchModalVisible(false);
    };

    return (
        <>
            <View style={styles.container}>
                <Stack.Screen
                    options={{
                        header: () => <IndexHeader onSearchPress={openSearchModal} />
                    }}
                />
                <AgendaComponent />

                <SearchModal
                    visible={isSearchModalVisible}
                    onClose={closeSearchModal}
                />
            </View>
        </>




    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 60
    },

});
