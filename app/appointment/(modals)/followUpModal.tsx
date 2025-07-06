import {Modal, Pressable, SafeAreaView, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/app/components/ui/card";
import {format} from "date-fns";
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
import Toast from "react-native-toast-message";

// the interface for the props that the FollowUpModal component will receive from its parent component
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
        isCertified?: boolean;
        formattedStartTime?: string;
        formattedEndTime?: string;
    }
}

// Regular expression to validate the duration input format
const intervalRegex = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i;

// schema for validating the follow-up form data that the user will fill out in the modal
//data refinement ensures that either a facility is selected or a new address is provided
const followUpSchema = z.object({
    date: z.date({ required_error: "Date is required" }),
    // Process startTime: if it's a Date, keep it; if it's a string, convert it;
    // then transform it to a formatted string "HH:mm:ss"
    startTime: z.date({ required_error: "Start time is required." }),
    projectedDuration: z.string().min(2, { message: "Duration is required. ie 1h30m or 1h or 30m" }).regex(intervalRegex, {message: 'Invalid duration format, e.g., 1h30m or 2h or 45m'}),
    appointmentType: z.string().min(1, { message: "Appointment Type is required." }),
    notes: z.string().optional(),
    facilityId: z.string().optional(),
    newFacilityAddress: z.string().optional(),
    isCertified: z.boolean(),
}).superRefine((data, ctx) => {
    // Check if neither facility field is filled
    if (!data.facilityId && !data.newFacilityAddress) {
        // Add error to both fields
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a facility or provide a new address",
            path: ['facilityId'],
        });
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a facility or provide a new address",
            path: ['newFacilityAddress'],
        });
    }
});


export type FollowUpFormData = z.infer<typeof followUpSchema>;

// types were added to ensure that the data passed to the onSubmit function matches the expected structure
//especially for the date and startTime fields, which are Date objects and undefined if not set making the selection mandatory
type FollowUpFormInput = {
    date: Date | undefined;
    startTime: Date | undefined;
    projectedDuration: string;
    appointmentType: string;
    notes?: string;
    facilityId?: string;
    newFacilityAddress?: string;
    isCertified: boolean;
}

const FollowUpModal = ({
    appointmentData,
    onSubmit,
    visible,
    onClose,
}: FollowUpModalProps) => {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FollowUpFormInput>({
        resolver: zodResolver(followUpSchema),
        defaultValues: {
            date: undefined,
            startTime: undefined,
            projectedDuration: '',
            appointmentType: '',
            notes: '',
            facilityId: '',
            newFacilityAddress: '',
            isCertified: appointmentData?.isCertified || false,
        }
    })

    // Fetch facilities using the custom hook.
    const {data: facilities, isLoading, isError} = useGetFacilities()

    const listOfFacilities = [
        { label: isLoading ? "Loading facilities..." : "No Facility Selected" , value: "" },
        ...(facilities?.map((item) => {
            const parts = item.address.split(',').map(s => s.trim());
            const streetAddress = `${parts[0]} ${parts[1]}`;
            return {
                label: `${item.name} - ${streetAddress}`,
                value: item.id
            };
        }) || [])
    ];

    const handleFormSubmit = (data: FollowUpFormInput) => {
        onSubmit(data as FollowUpFormData);
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
                                        <Text className='font-normal'> {appointmentData.formattedStartTime} - {appointmentData.formattedEndTime}</Text>
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
                                                render={({field: {onChange, value}}) => (
                                                    <>
                                                        <DatePicker
                                                            onChange={onChange}
                                                            value={value}
                                                            error={!!errors.date}
                                                        />
                                                        {errors.date && (
                                                            <Text className='text-red-500 text-xs mt-1'>
                                                                {errors.date.message}
                                                            </Text>
                                                        )}
                                                    </>
                                                )}
                                            />
                                        </View>
                                        <View>
                                            <Text className='font-bold text-sm pl-1.5'>
                                                Start Time:
                                            </Text>
                                            <Controller
                                                name={'startTime'}
                                                control={control}
                                                render={({field: {onChange, value}}) => (
                                                    <>
                                                        <TimePicker
                                                            onChange={onChange}
                                                            value={value}
                                                            error={!!errors.startTime}
                                                        />
                                                        {errors.startTime && (
                                                            <Text className='text-red-500 text-xs mt-1'>
                                                                {errors.startTime.message}
                                                            </Text>
                                                        )}
                                                    </>

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
                                                    <>
                                                        <Input
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder='1h30m'
                                                            onChangeText={(text) => onChange(text)}
                                                            className={errors.projectedDuration ? 'border-red-500' : ''}
                                                        />
                                                        {errors.projectedDuration && (
                                                            <Text className='text-red-500 text-xs'>
                                                                {errors.projectedDuration.message}
                                                            </Text>
                                                        )}
                                                    </>
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
                                                    <>
                                                        <DropDownSelect
                                                            items={appointmentOptions}
                                                            value={value}
                                                            onChange={(newValue: string | null) => {
                                                                onChange(newValue ?? '')
                                                            }}
                                                            error={!!errors.appointmentType}
                                                            placeholder='Select appointment type...'
                                                        />
                                                        {errors.appointmentType && (
                                                            <Text className='text-red-500 text-xs mt-1'>
                                                                {errors.appointmentType.message}
                                                            </Text>
                                                        )}
                                                    </>

                                                )}
                                            />
                                        </View>
                                    </View>
                                </CardContent>
                            </Card>
                            <Card className={'bg-gray-200 mt-3'}>
                                <CardHeader className={'flex items-center justify-center mb-1'}>
                                    <CardTitle className='text-lg font-bold'>Location</CardTitle>
                                    <CardDescription>Select a facility OR provide a new address if not listed</CardDescription>
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
                                                    <>
                                                        <DropDownSelect
                                                            items={listOfFacilities}
                                                            value={value}
                                                            onChange={(newValue: string | null) => {
                                                                onChange(newValue ?? '')
                                                            }}
                                                            placeholder={isError ? "Error loading facilities" : "Select a facility..."}
                                                            error={!!errors.facilityId && !watch('newFacilityAddress')}
                                                        />
                                                        {errors.facilityId && !watch('newFacilityAddress') && (
                                                            <Text className='text-red-500 text-xs mt-1'>
                                                                {errors.facilityId.message}
                                                            </Text>
                                                        )}
                                                    </>

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
                                                    <>
                                                        <Input
                                                            value={value}
                                                            onChange={onChange}
                                                            onChangeText={(text) => onChange(text)}
                                                            placeholder='123 Main St, Anytown, CA 91234'
                                                            className={errors.facilityId && !watch('facilityId') ? 'border-red-500' : ''}
                                                        />
                                                        {errors.facilityId && !watch('facilityId') && (
                                                            <Text className='text-red-500 text-xs mt-1'>
                                                                Please provide a facility address or select from the list
                                                            </Text>
                                                        )}
                                                    </>
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
                    <CustomButton
                        variant="default"
                        onPress={handleSubmit(handleFormSubmit, (errors) => {
                            console.log("Validation errors:", errors);
                            Toast.show({
                                type: 'error',
                                text1: 'Missing Required Fields',
                                text2: 'Please fill in all required fields'
                            });
                        })}
                    >
                        <Text className='text-white text-2xl font-semibold' >Submit</Text>
                    </CustomButton>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

export default FollowUpModal;
