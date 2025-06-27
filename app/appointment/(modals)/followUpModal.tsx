import {Modal, Pressable, SafeAreaView, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Card, CardContent, CardHeader} from "@/app/components/ui/card";
import {format, parse} from "date-fns";
import DatePicker from "@/app/components/ui/date-picker";
import TimePicker from "@/app/components/ui/time-picker";
import {Input} from "@/app/components/ui/input";
import {z} from "zod";
import DropDownSelect from "@/app/components/ui/dropdown-picker";
import {Controller, useForm} from "react-hook-form";
import CustomButton from "@/app/components/ui/custom-button";
import {zodResolver} from "@hookform/resolvers/zod";
import {useGetFacilities} from "@/app/features/facilities/api/use-get-facilities";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

interface FollowUpModalProps {
    id: string;
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: FollowUpFormData) => void;
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
        isCertified?: boolean;
    }
}

const intervalRegex = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i;

const followUpSchema = z.object({
    date: z.date({ required_error: "Date is required" }),
    // Process startTime: if it's a Date, keep it; if it's a string, convert it;
    // then transform it to a formatted string "HH:mm:ss"
    startTime: z.date({ required_error: "A start time is required." }),
    projectedDuration: z.string().regex(intervalRegex, {message: 'Invalid duration format, e.g., 1h30m'}).optional(),
    appointmentType: z.string(),
    notes: z.string().optional(),
    facilityId: z.string().optional(),
    newFacilityAddress: z.string().optional(),
    isCertified: z.boolean(),
})

export type FollowUpFormData = z.infer<typeof followUpSchema>;

const FollowUpModal = ({
    id,
    appointmentId,
    appointmentData,
    onSubmit,
    visible,
    onClose,
}: FollowUpModalProps) => {
    console.log("!!! FollowUpModal: Received 'visible' prop:", visible);
    const {
        control,
        handleSubmit,
    } = useForm({
        resolver: zodResolver(followUpSchema),
        defaultValues: {
            date: appointmentData?.date ? new Date(appointmentData.date) : new Date(),
            startTime: new Date(),
            projectedDuration: '',
            appointmentType: '',
            notes: '',
            facilityId: '',
            newFacilityAddress: '',
            isCertified: appointmentData?.isCertified || false,
        }
    })

    const {data: facilities, isLoading, isError} = useGetFacilities()

    const listOfFacilities = facilities?.map((item) => ({
        label: item.name,
        value: item.id
    })) || []

    // if (isLoading) {
    //     return <ActivityIndicator />
    // }
    //
    // if(isError) {
    //     return <Text>Error fetching facilities</Text>
    // }

    const handleFormSubmit = (data: FollowUpFormData) => {
        onSubmit(data)
        onClose()
        console.log("Submitting payload:", data)
    }

    // const [selectedValue, setSelectedValue] = useState<string | null>(null);
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

    const timeStringStartTime = appointmentData.startTime;
    const parsedStartTime = parse(timeStringStartTime || '', "HH:mm:ss", new Date());
    const formattedStartTime = format(parsedStartTime, "hh:mm aaa");

    const timeStringEndTime = appointmentData?.endTime;
    const parsedEndTime = parse(timeStringEndTime || '', "HH:mm:ss", new Date());
    const formattedEndTime = format(parsedEndTime, "hh:mm a");

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
            <KeyboardAwareScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
                extraScrollHeight={20}
            >
                <View className='pb-20'>
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
                                        <Text className='font-normal'> {formattedStartTime} - {formattedEndTime}</Text>
                                    </Text>
                                </CardContent>
                            </Card>
                            <Card className={'bg-gray-200 mt-3'}>
                                <CardHeader className={'flex items-center justify-center'}>
                                    <Text className='text-lg font-bold'>Follow Up Details</Text>
                                </CardHeader>
                                <CardContent className={'flex flex-col'}>
                                    <View className={'flex flex-col gap-y-3'}>
                                        <View>
                                            <Text className='font-bold text-sm pl-1.5'>
                                                Future Date:
                                            </Text>
                                            <Controller
                                                name={'date'}
                                                control={control}
                                                render={({field: {onChange}}) => (
                                                    <DatePicker onChange={onChange} />
                                                )
                                                }
                                            />
                                        </View>
                                        <View>
                                            <Text className='font-bold text-sm pl-1.5'>
                                                Start Time:
                                            </Text>
                                            <Controller
                                                name={'startTime'}
                                                control={control}
                                                render={({field: {onChange}}) => (
                                                    <TimePicker onChange={onChange} />
                                                )}
                                            />
                                        </View>
                                        <View>
                                            <Text className='font-bold text-sm pl-1.5'>
                                                Projected Duration:
                                            </Text>
                                            <Controller
                                                name={'projectedDuration'}
                                                control={control}
                                                render={({field: {onChange, value}}) => (
                                                    <Input
                                                        value={value}
                                                        onChange={onChange}
                                                        placeholder='1h30m'
                                                        onChangeText={(text) => onChange(text)}
                                                    />
                                                )}
                                            />
                                        </View>
                                        <View>
                                            <Text className='font-bold text-sm pl-1.5'>
                                                Appointment Type:
                                            </Text>
                                            <Controller
                                                name={'appointmentType'}
                                                control={control}
                                                render={({field: {onChange, value}}) => (
                                                    <DropDownSelect
                                                        items={appointmentOptions}
                                                        value={value}
                                                        onChange={(newValue: string | null) => {
                                                            onChange(newValue ?? '')
                                                        }}
                                                    />
                                                )}
                                            />
                                        </View>
                                    </View>
                                </CardContent>
                            </Card>
                            <Card className={'bg-gray-200 mt-3'}>
                                <CardHeader className={'flex items-center justify-center'}>
                                    <Text className='text-lg font-bold'>Location</Text>
                                </CardHeader>
                                <CardContent className={'flex flex-col'}>
                                    <View className={'flex flex-col gap-y-3'}>
                                        <View>
                                            <Text className='font-bold text-sm pl-1.5'>
                                                Select Facility from List:
                                            </Text>
                                            <Controller
                                                name={'facilityId'}
                                                control={control}
                                                render={({field: {onChange, value}}) => (
                                                    <DropDownSelect
                                                        items={listOfFacilities}
                                                        value={value}
                                                        onChange={(newValue: string | null) => {
                                                            onChange(newValue ?? '')
                                                        }}
                                                    />
                                                )}
                                            />
                                        </View>
                                        <View>
                                            <Text className='font-bold text-sm pl-1.5'>
                                                If facility is not listed, please provide the full facility address and we will add it to the system:
                                            </Text>
                                            <Controller
                                                name={'newFacilityAddress'}
                                                control={control}
                                                render={({field: {onChange, value}}) => (
                                                    <Input
                                                        value={value}
                                                        onChange={onChange}
                                                        onChangeText={(text) => onChange(text)}
                                                        placeholder='123 Main St, Anytown, CA 91234'
                                                    />
                                                )}
                                            />
                                        </View>
                                    </View>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </View>
            </KeyboardAwareScrollView>
                <View className='absolute bottom-0 left-0 right-0 h-28 bg-white  items-center border-t-gray-50 w-full p-2 z-50 border-t shadow-md inset-shadow-sm '>
                    <CustomButton variant="default" onPress={handleSubmit(handleFormSubmit, (errors) => console.log("Validation Errors:", errors))}>
                        <Text className='text-white text-2xl font-semibold' >Submit</Text>
                    </CustomButton>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default FollowUpModal;
