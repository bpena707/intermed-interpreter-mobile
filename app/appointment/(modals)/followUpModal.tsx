import {Modal, Pressable, SafeAreaView, ScrollView, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/components/ui/card";
import {format} from "date-fns";
import DatePicker from "@/app/components/ui/date-picker";
import TimePicker from "@/app/components/ui/time-picker";
import {Input} from "@/app/components/ui/input";
import {z} from "zod";
import DropDownPicker from "react-native-dropdown-picker";
import DropDownSelect from "@/app/components/ui/dropdown-picker";
import {useState} from "react";
import {Controller} from "react-hook-form";
import {CustomSwitch} from "@/app/components/ui/switch";
import CustomButton from "@/app/components/ui/custom-button";

interface FollowUpModalProps {
    id: string;
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    appointmentId: string;
    appointmentData: {
        projectedEndTime?: string;
        projectedDuration?: string;
        notes?: string | null;
        date?: string;
        patientName?: string;
        facilityName?: string;
        facilityAddress?: string;
        startTime?: string;
        endTime?: string;
    }
}

const intervalRegex = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i;

const followUpSchema = z.object({
    date: z.coerce.date(),
    // Process startTime: if it's a Date, keep it; if it's a string, convert it;
    // then transform it to a formatted string "HH:mm:ss"
    startTime: z.preprocess((arg) => {
        if (arg instanceof Date) return arg;
        if (typeof arg === "string") return new Date(arg);
        return arg;
    }, z.date().transform((date: Date) => {
        const hh = String(date.getHours()).padStart(2, "0");
        const mm = String(date.getMinutes()).padStart(2, "0");
        const ss = String(date.getSeconds()).padStart(2, "0");
        return `${hh}:${mm}:${ss}`;
    })),
    projectedDuration: z.string().regex(intervalRegex, {message: 'Invalid duration format, e.g., 1h30m'}),
    appointmentType: z.string(),
    availability: z.boolean(),
})

const FollowUpModal = ({
    id,
    appointmentId,
    appointmentData,
    onSubmit,
    visible,
    onClose,
}: FollowUpModalProps) => {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const appointmentOptions = [
        {label: "Follow Up", value: "Follow-Up"},
        {label: "Initial", value: "Initial"},
        {label: "IME/AME", value: "IME/AME"},
        {label: "Second Opinion", value: "Second-Opinion"},
        {label: "QME", value: "QME"},
        {label: "IEP", value: "IEP"},
        {label: "Conference", value: "Conference"},
        {label: "Other", value: "Other"},
    ];

    return(
        <Modal
            animationType="slide"
            presentationStyle={'pageSheet'}
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaView className={'flex-1'}>
            <View className='flex flex-row bg-gray-200 w-full h-12'>
                <View className='flex-1 items-center justify-center'>
                    <Text className='text-black text-lg font-semibold text-center justify-center'>Follow Up</Text>
                </View>
                <Pressable onPress={onClose} className='justify-center items-center right-2'>
                    <Ionicons name="close-circle" size={26} color="white" />
                </Pressable>
            </View>
            <ScrollView nestedScrollEnabled={true} className='flex-1 mb-20'>
                <Card>
                    <CardHeader className={'flex items-center justify-center'}>
                        <Text className='text-xl font-bold'>Appointment Information</Text>
                    </CardHeader>
                    <CardContent>
                        <Card className={'bg-gray-200 '}>
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
                                    Address:
                                    <Text className='font-normal'> {appointmentData.facilityAddress}</Text>
                                </Text>
                                <Text className='font-bold text-sm'>
                                    Duration:
                                    <Text className='font-normal'> {appointmentData.startTime} - {appointmentData.endTime}</Text>
                                </Text>
                            </CardContent>
                        </Card>
                        <Card className={'bg-gray-200 mt-3 z-50'}>
                            <CardHeader className={'flex items-center justify-center'}>
                                <Text className='text-lg font-bold'>Follow Up Details</Text>
                            </CardHeader>
                            <CardContent className={'flex flex-col'}>
                                <View className={'flex flex-col gap-y-3'}>
                                    <View className={''}>
                                        <Text className='font-bold text-sm pl-1.5'>
                                            Future Date:
                                        </Text>
                                        <View>
                                            <DatePicker onChange={() => console.log('date')}/>
                                        </View>
                                    </View>
                                    <View>
                                        <Text className='font-bold text-sm pl-1.5'>
                                            Start Time:
                                        </Text>
                                        <View>
                                            <TimePicker onChange={() => console.log('time')}/>
                                        </View>
                                    </View>
                                    <View>
                                        <Text className='font-bold text-sm pl-1.5'>
                                            Projected Duration:
                                        </Text>
                                        <View>
                                            <Input placeholder='1h30m'></Input>
                                        </View>
                                    </View>
                                    <View>
                                        <Text className='font-bold text-sm pl-1.5'>
                                            Appointment Type:
                                        </Text>
                                        <View>
                                            <DropDownSelect
                                                items={appointmentOptions}
                                                onChange={setSelectedValue}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </CardContent>
                        </Card>
                        <Card className={'bg-gray-200 mt-3'}>
                            <CardHeader className={'flex items-center justify-center'}>
                                <Text className='text-lg font-bold'>Location</Text>
                            </CardHeader>
                            <CardContent className={'flex flex-col'}>
                                <Card className='border border-gray-300 w-full p-2'>
                                    <CardTitle>
                                        <Text className='text-lg font-semibold'>Different location</Text>

                                    </CardTitle>
                                    <CardContent className='flex items-end'>

                                    </CardContent>
                                </Card>

                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </ScrollView>
                <View className='absolute bottom-0 left-0 right-0 h-28 bg-white  items-center border-t-gray-50 w-full p-2 z-50 border-t shadow-md inset-shadow-sm '>
                    <CustomButton variant="default" onPress={onSubmit}>
                        <Text className='text-white text-2xl font-semibold' >Submit</Text>
                    </CustomButton>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default FollowUpModal;
