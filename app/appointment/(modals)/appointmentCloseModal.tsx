import {View, Text, StyleSheet, SafeAreaView, Platform, Pressable, Modal} from 'react-native';
import {Link, router, useLocalSearchParams} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Card, CardContent, CardTitle} from "@/app/components/ui/card";
import {useGetIndividualAppointment} from "@/app/features/appointments/api/use-get-individual-appointment";
import {useGetIndividualFacility} from "@/app/features/facilities/api/use-get-individual-facility";
import {useGetIndividualPatient} from "@/app/features/patients/use-get-individual-patient";
import {useEditAppointment} from "@/app/features/appointments/api/use-edit-appointment";
import CustomButton from "@/app/components/ui/CustomButton";
import {z} from "zod";
import { useForm, Controller } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";

type Props = {
    id: string;
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: CloseAppointmentFormData) => void;
    appointmentId: string;
    patientId: string;
    appointmentData: {
        endTime?: string;
        notes?: string;
        date?: string;
    }
}

//zod schema for only for editable fields
const closeAppointmentSchema = z.object({
    endTime: z.string().min(1, {message: 'End time is required'}),
    notes: z.string().optional(),
    followUp: z.boolean(),
    status: z.literal('Closed') //literal is fixed value closed to change appointment status to close
})

type CloseAppointmentFormData = z.input<typeof closeAppointmentSchema>

const AppointmentCloseModal = ({
    id,
    visible,
    onClose,
    onSubmit,
    appointmentData,
    appointmentId,
    patientId
}: Props) => {

    const {
        control,
        handleSubmit,
    } = useForm<CloseAppointmentFormData>({
        resolver: zodResolver(closeAppointmentSchema),
        defaultValues: {
            endTime: appointmentData.endTime || "",
            notes: appointmentData.notes || undefined,
            followUp: false,
            status: 'Closed'
        }
    })

    const handleFormSubmit = (data: CloseAppointmentFormData) => {
        onSubmit(data)
        onClose()
    }

    return (
        <Modal
            animationType="slide"
            presentationStyle={'pageSheet'}
            transparent={false}
            visible={visible}
            onRequestClose={onClose}>
            <View className='flex-1 items-center justify-center ' >
                <View className='p-20 bg-[#606070] border rounded-2xl'  >
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
