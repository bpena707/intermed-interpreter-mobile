import {View, Text, StyleSheet, SafeAreaView, Platform, Pressable, Modal} from 'react-native';
import {Link, router, useLocalSearchParams} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Card, CardContent, CardDescription, CardTitle} from "@/app/components/ui/card";
import {useGetIndividualAppointment} from "@/app/features/appointments/api/use-get-individual-appointment";
import {useGetIndividualFacility} from "@/app/features/facilities/api/use-get-individual-facility";
import {useGetIndividualPatient} from "@/app/features/patients/use-get-individual-patient";
import {useEditAppointment} from "@/app/features/appointments/api/use-edit-appointment";
import CustomButton from "@/app/components/ui/CustomButton";
import {z} from "zod";
import { useForm, Controller } from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/app/components/ui/Input";
import {TextArea} from "@/app/components/ui/text-area";
import {CustomSwitch} from "@/app/components/ui/switch";

type Props = {
    id: string;
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: CloseAppointmentFormData) => void;
    appointmentId: string;

    appointmentData: {
        endTime?: string;
        notes?: string;
        date?: string;
        patientName?: string;
        facilityName?: string;
        facilityAddress?: string;
        startTime?: string;
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
    appointmentId
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
            <View className='flex-1 p-5 ' >
                {/*<View className='p-20 bg-[#606070] border rounded-2xl'  >*/}
                <View className='items-center'>
                    <Text className='text-3xl font-extrabold mb-5'>Close Appointment</Text>
                </View>
                <Card>
                    <CardTitle className='mb-2'>
                        <Text className='text-xl font-bold text-center'>Appointment Details</Text>
                    </CardTitle>
                    <CardContent>
                        <Text className='font-bold text-lg'>
                            Patient:
                           <Text className='font-normal'> {appointmentData.patientName}</Text>
                        </Text>
                        <Text className='font-bold text-lg'>
                            Facility:
                            <Text className='font-normal'> {appointmentData.facilityName}</Text>
                        </Text>
                        <Text className='font-bold  text-lg'>
                            Date:
                            <Text className='font-normal'> {appointmentData.date}</Text>
                        </Text>
                        <Text className='font-bold text-lg'>
                            Start Time:
                            <Text className='font-normal'> {appointmentData.startTime}</Text>
                        </Text>
                        <View className='flex flex-col gap-y-3'>
                            <View className='flex flex-col'>
                                <Text className='font-bold text-lg'>End Time</Text>
                                <Controller
                                    name='endTime'
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <Input
                                            onChangeText={onChange}
                                            value={value}
                                            selectTextOnFocus
                                        ></Input>
                                    )}
                                />
                            </View>
                            <View className='flex flex-col'>
                                <Text className='font-bold text-lg'>Notes</Text>
                                <Controller
                                    name='notes'
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        <TextArea
                                            onChangeText={onChange}
                                            value={value}
                                            selectTextOnFocus
                                        />
                                    )}
                                />
                            </View>
                            <View className='flex flex-row'>
                                <Card className='border border-gray-300 w-full p-2'>
                                    <CardTitle>
                                        <Text className='text-lg font-semibold'>Turn on for follow up</Text>
                                    </CardTitle>
                                    <CardDescription >
                                        <Text>You will be directed to another screen to input data</Text>
                                    </CardDescription>
                                    <CardContent className='flex items-end'>
                                        <Controller
                                            name='followUp'
                                            control={control}
                                            render={({field: {onChange, value}}) => (
                                                <CustomSwitch
                                                    value={value}
                                                    onValueChange={onChange}
                                                />
                                            )}
                                        />
                                    </CardContent>
                                </Card>
                            </View>
                        </View>
                    </CardContent>
                </Card>
                <View className='flex items-end'>
                    <CustomButton variant={'default'} onPress={onClose}>
                        <Text className='text-white text-2xl font-semibold'>Submit</Text>
                    </CustomButton>
                </View>

                {/*</View>*/}
            </View>
        </Modal>
    );
}
export default AppointmentCloseModal;
