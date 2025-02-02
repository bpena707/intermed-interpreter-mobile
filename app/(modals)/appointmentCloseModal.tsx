import {View, Text, StyleSheet, SafeAreaView, Platform} from 'react-native';
import {Link, router, useLocalSearchParams} from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Card, CardContent, CardTitle} from "@/app/components/ui/card";
import {useGetIndividualAppointment} from "@/app/features/appointments/api/use-get-individual-appointment";
import {useGetIndividualFacility} from "@/app/features/facilities/api/use-get-individual-facility";
import {useGetIndividualPatient} from "@/app/features/patients/use-get-individual-patient";
import {useEditAppointment} from "@/app/features/appointments/api/use-edit-appointment";



const AppointmentCloseModal = () => {
    const isPresented = router.canGoBack();
    const { id } = useLocalSearchParams<{id?: string}>()
    console.log("Local Appointment ID:", id)

    const { data: appointment, isLoading: isAppointmentLoading, error: appointmentError } = useGetIndividualAppointment(id ?? '');
    const { data: facility , isLoading: isFacilityLoading, error: facilityError } = useGetIndividualFacility(appointment?.facilityId);
    const {data: patient, isLoading: isPatientLoading, error: patientError} = useGetIndividualPatient(appointment?.patientId)
    const editMutation = useEditAppointment(id ?? '')

    return (
        <SafeAreaView className='flex-1 items-center' >
            <View className='items-center p-2'>
                <Text className='font-semibold text-2xl'>Close Appointment</Text>
                {/*<Text>Enter appointment details below after appointment end. If no show or late cancel please call</Text>*/}
            </View>
            <Card className='m-4'>
                <View className='flex flex-row items-center'>
                    <CardTitle className='ml-3'>Appointment Details</CardTitle>
                </View>

                <View className='p-4'>
                    <Text>Appointment Date: 12th June 2021</Text>
                    <Text>Appointment Start Time: 12:00 PM</Text>
                    <Text>Appointment End Time: 1:00 PM</Text>
                    <Text>Appointment: {appointment?.id}</Text>
                </View>
            </Card>
            <Card>
                <View className='flex flex-row items-center'>
                    <CardTitle className='ml-3'>
                        <Text>
                            Follow up
                        </Text>
                    </CardTitle>
                </View>

                <View className='p-4'>
                    <Text>Appointment Status: Pending</Text>
                </View>
            </Card>

            {isPresented && <Link href="../">Dismiss modal</Link>}
            <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </SafeAreaView>
    );
}
export default AppointmentCloseModal;
