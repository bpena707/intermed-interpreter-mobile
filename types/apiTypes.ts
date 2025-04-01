import { AgendaEntry } from "react-native-calendars";

// the AppointmentEntry extends the AgendaEntry interface from react-native-calendars and help to add the custom
// properties that are needed for the appointment entry in addition to the properties that are already in the AgendaEntry interface.
export interface AppointmentEntry extends AgendaEntry {
    id: string;
    bookingId: string;
    startTime: string;
    endTime: string;
    patient: string;
    patientFirstName: string;
    patientLastName: string;
    patientId: string;
    facility: string;
    facilityAddress: string;
    facilityCity: string;
    facilityState: string;
    facilityId: string;
    appointmentType: string;
    isCertified: boolean;
    status: string;
    notes: string | null;
}

//this is the raw data that comes in from the API.
export interface Appointment {
    id: string;
    bookingId: string;
    date: string;
    notes: string | null;
    startTime: string;
    endTime: string;
    projectedEndTime: string;
    projectedDuration: string;
    appointmentType: string;
    status: string;
    isCertified: boolean;
    facility: string;
    facilityAddress: string;
    facilityCity: string;
    facilityState: string;
    facilityId: string;
    patient: string;
    patientFirstName: string;
    patientLastName: string;
    patientId: string;
    interpreterId: string;
}

export interface Facility {
    id: string;
    name: string;
    address: string;
    longitude: number;
    latitude: number;
    email: string;
    phoneNumber: string;
    facilityType: string;
    operatingHours: string;
    averageWaitTime: string;

}

export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    insuranceCarrier: string;
    preferredLanguage: string;
}