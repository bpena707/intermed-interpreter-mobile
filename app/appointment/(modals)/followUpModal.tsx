import {Modal, Pressable, Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Card, CardContent, CardHeader} from "@/app/components/ui/card";
import {format} from "date-fns";

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

const FollowUpModal = ({
    id,
    appointmentId,
    appointmentData,
    onSubmit,
    visible,
    onClose,
}: FollowUpModalProps) => {
    return(
        <Modal
            animationType="slide"
            presentationStyle={'pageSheet'}
            transparent={false}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className='flex-1'>
                <View className='flex flex-row bg-gray-200 w-full h-12'>
                    <View className='flex-1 items-center justify-center'>
                        <Text className='text-black text-lg font-semibold text-center justify-center'>Follow Up</Text>
                    </View>
                    <Pressable onPress={onClose} className='justify-center items-center right-2'>
                        <Ionicons name="close-circle" size={26} color="white" />
                    </Pressable>
                </View>
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
                        <Card className={'bg-gray-200 mt-3'}>
                            <CardHeader className={'flex items-center justify-center'}>
                                <Text className='text-lg font-bold'>Follow Up Details</Text>
                            </CardHeader>
                            <CardContent>
                                <Text className='font-bold text-sm'>
                                    Projected Duration:
                                    <Text className='font-normal'> {appointmentData.projectedDuration}</Text>
                                </Text>
                                <Text className='font-bold text-sm'>
                                    Projected End Time:
                                    <Text className='font-normal'> {appointmentData.projectedEndTime}</Text>
                                </Text>
                                <Text className='font-bold text-sm'>
                                    Notes:
                                    <Text className='font-normal'> {appointmentData.notes}</Text>
                                </Text>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>
            </View>
        </Modal>
    )
}

export default FollowUpModal;
