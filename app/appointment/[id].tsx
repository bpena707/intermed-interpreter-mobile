import {ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useLocalSearchParams} from "expo-router";
import {useGetIndividualAppointment} from "@/app/features/appointments/api/use-get-individual-appointment";
import {useGetIndividualFacility} from "@/app/features/facilities/api/use-get-individual-facility";
import {useGetIndividualPatient} from "@/app/features/patients/use-get-individual-patient";
import Map from "@/app/components/map";
import CustomButton from "@/app/components/ui/CustomButton";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/app/components/ui/card";
import Ionicons from "@expo/vector-icons/Ionicons";
import {format, parse} from "date-fns";
import {formatPhoneNumber} from "@/lib/utils";
import {BackButton} from "@/app/components/ui/back-button";
import {useEditAppointment} from "@/app/features/appointments/api/use-edit-appointment";
import {useState} from "react";
import AppointmentCloseModal from "@/app/appointment/(modals)/appointmentCloseModal";

export default function Tab() {
    //this series of functions is used to get the appointment id from the url, and then use that id to get the appointment data,
    // then extract data from the appointment object or if it is empty its null object
    const { id } = useLocalSearchParams<{id?: string}>()
    console.log("Local Appointment ID:", id)

    // const appointmentQuery = useGetIndividualAppointment(id)
    // const appointment = appointmentQuery.data || []
    //
    // const facilityQuery = useGetIndividualFacility(appointment.facilityId)
    // const facility = facilityQuery.data || []

    const { data: appointment, isLoading: isAppointmentLoading, error: appointmentError } = useGetIndividualAppointment(id ?? '');
    const { data: facility , isLoading: isFacilityLoading, error: facilityError } = useGetIndividualFacility(appointment?.facilityId);
    const {data: patient, isLoading: isPatientLoading, error: patientError} = useGetIndividualPatient(appointment?.patientId)
    const editMutation = useEditAppointment(id ?? '')

    //controls the state of the modal visibility set to false by default
    const [modalVisible, setModalVisible] = useState(false);

    if (isAppointmentLoading || isFacilityLoading || isPatientLoading) return <ActivityIndicator size='large' />

    // const [refreshing, setRefreshing] = useState(false);
    // const onRefresh = useCallback(() => {
    //     setRefreshing(true);
    //     setTimeout(() => setRefreshing(false), 2000);
    //
    // },[])

    const timeStringStartTime = appointment?.startTime;
    const parsedStartTime = parse(timeStringStartTime || '', "HH:mm:ss", new Date());
    const formattedStartTime = format(parsedStartTime, "hh:mm aaa");

    const timeStringEndTime = appointment?.endTime;
    const parsedEndTime = parse(timeStringEndTime || '', "HH:mm:ss", new Date());
    const formattedEndTime = format(parsedEndTime, "hh:mm a");

    const appointmentStatus = () => {
        switch (appointment?.status) {
            case 'Confirmed':
                return (
                    <View className='flex-row items-center bg-[#10b981] rounded-2xl px-2.5 py-1'>
                        <Text className='font-semibold'>Confirmed</Text>
                    </View>
                )
            case 'Pending':
                return (
                    <View className='flex-row items-center bg-[#fde047] rounded-2xl px-2.5 py-1'>
                        <Text className='font-semibold'>Pending</Text>
                    </View>
                )
            case 'Closed':
                return (
                    <View className='flex-row items-center bg-[#0ea5e9] rounded-2xl px-2.5 py-1'>
                        <Text className='font-semibold'>Closed</Text>
                    </View>
                )
            case 'Cancelled':
                return (
                    <View className='flex-row items-center bg-red-500 rounded-2xl px-2.5 py-1'>
                        <Text className='font-semibold'>Cancelled</Text>
                    </View>
                )
        }
    }

    //toggles modal visibility
    const toggleModalOpen = () => {
        setModalVisible(true);
    }

   const handleUpdateStatus = (newStatus: string) => {
         editMutation.mutate({
             ...appointment,
           status: newStatus,
         });
   }

   const handleCloseSubmit = () => {
         // Handle the form submission here
         // You can access the form data from the `data` parameter
         console.log("Form submitted with data:");
   }

    const renderUpdateButton = () => {
        switch (appointment?.status) {
            case 'Pending':
                return (
                    <CustomButton variant='confirm' onPress={() => handleUpdateStatus('Confirmed')}>
                        <Text className='text-white text-2xl font-semibold'>Confirm</Text>
                    </CustomButton>
                )
            case 'Confirmed':
                return (
                    <View className='gap-y-2'>
                        <CustomButton onPress={toggleModalOpen} >
                            <Text className='text-white text-2xl font-semibold'>Close</Text>
                        </CustomButton>
                        <CustomButton variant='destructive'>
                            <Text className='text-white text-2xl font-semibold'>Return</Text>
                        </CustomButton>
                    </View>
                )
        }
    }
    console.log("Rendered appointment data:", appointment);

    return (
        <SafeAreaView className={'flex-1 mb-0'}>
            <AppointmentCloseModal
                id={id ?? ''}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleCloseSubmit}
                appointmentId={appointment?.id ?? ''}
                appointmentData={{
                    endTime: appointment?.endTime,
                    projectedEndTime: appointment?.projectedEndTime,
                    duration: appointment?.duration,
                    projectedDuration: appointment?.projectedDuration,
                    startTime: appointment?.startTime,
                    notes: appointment?.notes ?? '',
                    date: appointment?.date,
                    patientName: `${patient?.firstName} ${patient?.lastName}`,
                    facilityName: facility?.name,
                    facilityAddress: facility?.address,
                }}
            />
            <BackButton />
            <ScrollView
                //TODO: Work on the pull to refresh function
                // refreshControl={
                //     <RefreshControl
                //         refreshing={refreshing}
                //         onRefresh={onRefresh}
                //     />
                // }
            >

                <View>
                    <Card className={'rounded-t-none'}>
                        <CardHeader className='pt-0 '>
                            <CardTitle className='flex-row justify-between mb-2' >
                                <Text>Certified Medical</Text>
                            </CardTitle>
                            <CardDescription>
                                <Text>{appointmentStatus()}</Text>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='justify-center items-center'>
                            <View style={{ height: 200, width: '100%' }}>
                                {/*<Map />*/}
                            </View>
                        </CardContent>
                        <CardFooter>
                            {facility ? (
                                <View className={'flex flex-row items-center justify-start'}>
                                    <Ionicons name="location-outline" size={20} color="#f43f5e" />
                                    <Text >{facility.address} {facility.city}, {facility.state} {facility.zipCode}</Text>
                                </View>
                            ) : (
                                <Text>Facility not found</Text>
                            )}
                        </CardFooter>
                    </Card>
                </View>
                <View className='mt-2'>
                    <Card>
                        <CardHeader >
                            <CardTitle>
                                <Text>Patient</Text>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {patient ? (
                                <View>
                                    <Text className='capitalize'>Patient: {patient.firstName} {patient.lastName}</Text>
                                    <Text>Contact: {formatPhoneNumber(patient.phoneNumber)}</Text>
                                    <Text className='capitalize'>Language: {patient.preferredLanguage}</Text>
                                </View>
                            ) : (
                                <Text>Patient not found</Text>
                            )}
                        </CardContent>
                    </Card>
                </View>
                <View className='mt-2'>
                    <Card>
                        <CardHeader >
                            <CardTitle>
                                <Text>Appointment Details</Text>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>

                            {appointment && facility ? (
                                <View>
                                    <Text className='capitalize'>Facility: {facility.name} | Specialty: {facility.facilityType}</Text>
                                    <Text className='capitalize'>Facility Contact: {formatPhoneNumber(facility.phoneNumber)}</Text>
                                    <Text className='capitalize'>Appointment Type: {appointment.appointmentType}</Text>

                                    <Text>ID: {appointment.id}</Text>
                                    <Text>Duration: {formattedStartTime} - {formattedEndTime}</Text>
                                </View>
                            ) : (
                                <Text>Facility not found</Text>
                            )}
                        </CardContent>
                    </Card>
                </View>
                <View className={'mx-5 mt-1'}>
                    {renderUpdateButton()}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({

    headerText :{
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom    : 20
    },
    infoContainer: {
        alignItems: "flex-start",
        marginLeft: 20

    }

});
