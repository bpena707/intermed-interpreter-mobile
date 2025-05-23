import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    SafeAreaView, ScrollView,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/components/ui/card";
import CustomButton from "@/app/components/ui/custom-button";
import {date, z} from "zod";
import {Controller, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/app/components/ui/input";
import {TextArea} from "@/app/components/ui/text-area";
import {CustomSwitch} from "@/app/components/ui/switch";
import {format, parse} from "date-fns";
import TimePicker from "@/app/components/ui/time-picker";
import {AntDesign, MaterialCommunityIcons} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";


type Props = {
    id: string;
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: CloseAppointmentFormData) => void;
    appointmentId: string;
    appointmentData: {
        endTime?: string;
        projectedEndTime?: string;
        projectedDuration?: string;
        notes?: string;
        date?: string;
        patientName?: string;
        facilityName?: string;
        facilityAddress?: string;
        startTime?: string;
        isCertified?: boolean;
    }
}

//zod schema for only for editable fields
const closeAppointmentSchema = z.object({
    endTime: z.preprocess((arg) => {
        if (arg instanceof Date) return arg;
        if (typeof arg === "string") return new Date(arg);
        return arg;
    }, z.date()).transform((date: Date) => {
        const hh = String(date.getHours()).padStart(2, "0");
        const mm = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    }),
    notes: z.string().optional(),
    followUp: z.boolean(),
    status: z.literal('Closed'), //literal is fixed value closed to change appointment status to close
    isCertified: z.boolean().optional(),
})

export type CloseAppointmentFormData = z.input<typeof closeAppointmentSchema>

const AppointmentCloseModal = ({
    visible,
    onClose,
    onSubmit,
    appointmentData,

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

    // const timeStringEndTime = appointmentData?.projectedEndTime;
    // const parsedEndTime = parse(timeStringEndTime || '', "HH:mm:ss", new Date());
    // const formattedEndTime = format(parsedEndTime, "hh:mm a");

    return (
        <Modal
            animationType="slide"
            presentationStyle={'pageSheet'}
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
            <SafeAreaView className='flex-1 '>
                <View className='flex flex-row bg-gray-200 w-full h-12'>
                    <View className={'flex-1 items-center justify-center'}>
                        <Text className='text-black text-lg font-semibold text-center justify-center'>Close Appointment</Text>
                    </View>
                    <Pressable onPress={onClose} className='justify-center items-center right-2' >
                        <Ionicons name="close-circle" size={26} color="white" />
                    </Pressable>
                </View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView
                        style={{ flex: 1 }} // Allows ScrollView to take available space
                        contentContainerStyle={{ paddingHorizontal: 2, paddingVertical: 5, paddingBottom: 100, flexGrow: 1 }} // Added padding and paddingBottom for space above button
                        keyboardShouldPersistTaps="handled"
                    >
                <Card>
                    <CardHeader className={'flex items-center justify-center'}>
                        <CardTitle>
                            <Text className='text-xl font-bold'>Appointment Information</Text>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Card className={'bg-gray-200'}>
                            <CardHeader className='flex items-center justify-center'>
                                <Text className='text-lg font-bold'>Today's Appointment Details</Text>
                            </CardHeader>
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
                                    <Text className='font-normal'> {appointmentData.projectedEndTime}</Text>
                                </Text>
                            </CardContent>
                        </Card>
                        <Card className='bg-gray-200 mt-3'>
                            <CardHeader className={'items-center justify-center'}>
                                <CardTitle >
                                    <Text className='text-lg font-bold '>Closing Details</Text>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                            <View className='flex flex-col gap-y-3'>
                                <View className='flex flex-col'>
                                    <Text className='font-bold text-lg'>End Time</Text>
                                    <Controller
                                        name='endTime'
                                        control={control}
                                        render={({field: {onChange}}) => (
                                            <TimePicker
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
                                    <Card className='border border-gray-300 w-full p-2 h-28'>
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
                    </CardContent>
                </Card>
                    </ScrollView>
                </TouchableWithoutFeedback>


                <View className='absolute bottom-0 left-0 right-0 h-24 bg-white  items-center border-t-gray-50 w-full p-2 z-50 border-t shadow-md inset-shadow-sm '>
                    <CustomButton variant={'default'} onPress={handleSubmit(handleFormSubmit)}>
                        <Text className='text-white text-2xl font-semibold'>Submit</Text>
                    </CustomButton>
                </View>
            </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    );
}
export default AppointmentCloseModal;
