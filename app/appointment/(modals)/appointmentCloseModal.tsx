import {View, Text, StyleSheet, SafeAreaView, Platform, Pressable, Modal} from 'react-native';
import {Link, router, useLocalSearchParams} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Card, CardContent, CardTitle} from "@/app/components/ui/card";
import {useGetIndividualAppointment} from "@/app/features/appointments/api/use-get-individual-appointment";
import {useGetIndividualFacility} from "@/app/features/facilities/api/use-get-individual-facility";
import {useGetIndividualPatient} from "@/app/features/patients/use-get-individual-patient";
import {useEditAppointment} from "@/app/features/appointments/api/use-edit-appointment";
import CustomButton from "@/app/components/ui/CustomButton";

type Props = {
    id: string;
    visible: boolean;
    onClose: () => void;

}

const AppointmentCloseModal = ({
    id,
    visible,
    onClose
}: Props) => {

    return (
        <Modal
            animationType="slide"
            presentationStyle={'pageSheet'}
            transparent={false}
            visible={visible}
            onRequestClose={onClose}>
            <View className='flex-1 items-center justify-center ' >
                <View className='w-72 p-20 bg-[#606070] border rounded-2xl'  >
                    <Text >Hello World!</Text>
                    <CustomButton variant={'destructive'} onPress={onClose}>
                        <Text>Close</Text>
                    </CustomButton>
                </View>
            </View>
        </Modal>
    );
}
export default AppointmentCloseModal;
