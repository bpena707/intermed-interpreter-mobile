import {Modal, Pressable, Text, View} from 'react-native';
import {Card, CardContent, CardDescription, CardFooter, CardTitle} from "@/app/components/ui/card";
import CustomButton from "@/app/components/ui/CustomButton";
import {date, z} from "zod";
import {Controller, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/app/components/ui/Input";
import {TextArea} from "@/app/components/ui/text-area";
import {CustomSwitch} from "@/app/components/ui/switch";
import {format, parse} from "date-fns";
import TimePicker from "@/app/components/ui/time-picker";
import {AntDesign} from "@expo/vector-icons";


type Props = {
    id: string;
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: CloseAppointmentFormData) => void;
    appointmentId: string;
    appointmentData: {
        endTime?: string;
        projectedEndTime?: string;
        duration?: number;
        projectedDuration?: string;
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

    const timeStringStartTime = appointmentData.startTime;
    const parsedStartTime = parse(timeStringStartTime || '', "HH:mm:ss", new Date());
    const formattedStartTime = format(parsedStartTime, "hh:mm aaa");

    const timeStringEndTime = appointmentData?.projectedEndTime;
    const parsedEndTime = parse(timeStringEndTime || '', "HH:mm:ss", new Date());
    const formattedEndTime = format(parsedEndTime, "hh:mm a");

    return (
        <Modal
            animationType="slide"
            presentationStyle={'pageSheet'}
            transparent={false}
            visible={visible}
            onRequestClose={onClose}

        >
            <View className='flex-1 p-5 ' >
                <View className='flex flex-row '>
                    <Pressable onPress={onClose} className='top-0' >
                        <AntDesign name="closecircleo" size={20} color="gray" />
                    </Pressable>
                    <View className='w-40 h-1.5 top-0 rounded-2xl bg-gray-300 mb-3 ml-20'></View>
                </View>
                {/*<View className='p-20 bg-[#606070] border rounded-2xl'  >*/}
                <View className='items-center'>
                    <Text className='text-3xl font-extrabold mb-5'>Close Appointment</Text>
                </View>
                <Card>
                    <CardTitle className='mb-2'>
                        <Text className='text-xl font-bold text-center'>Appointment Details</Text>
                    </CardTitle>
                    <CardContent>
                        <Text className='font-bold  text-sm'>
                            Date:
                            <Text className='font-normal'> {appointmentData?.date
                                ? format(appointmentData.date, 'cccccc, PPP')
                                : 'N/A'
                            }</Text>
                        </Text>
                        <Text className='font-bold text-sm'>
                            Patient:
                           <Text className='font-normal'> {appointmentData.patientName}</Text>
                        </Text>
                        <Text className='font-bold text-sm'>
                            Facility:
                            <Text className='font-normal'> {appointmentData.facilityName}</Text>
                        </Text>
                        <Text className='font-bold text-sm'>
                            Projected Duration:
                            <Text className='font-normal'> {appointmentData.projectedDuration}</Text>
                        </Text>
                        <Text className='font-bold text-sm'>
                            Start Time:
                            <Text className='font-normal'> {formattedStartTime}</Text>
                        </Text>
                        <Text className='font-bold text-sm'>
                            Projected End Time:
                            <Text className='font-normal'> {formattedEndTime}</Text>
                        </Text>

                        <View className='flex flex-col gap-y-3'>
                            <View className='flex flex-col'>
                                <Text className='font-bold text-lg'>End Time</Text>
                                <Controller
                                    name='endTime'
                                    control={control}
                                    render={({field: {onChange, value}}) => (
                                        // <Input
                                        //     onChangeText={onChange}
                                        //     value={value}
                                        //     selectTextOnFocus
                                        // ></Input>
                                        <TimePicker
                                            value={value}
                                            onChange={onChange}
                                        />

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
                    <CardFooter >
                        <CustomButton variant={'default'} onPress={onClose}>
                            <Text className='text-white text-2xl font-semibold'>Submit</Text>
                        </CustomButton>
                    </CardFooter>
                </Card>
            </View>
        </Modal>
    );
}
export default AppointmentCloseModal;
