import { AgendaEntry } from "react-native-calendars";

// the AppointmentEntry extends the AgendaEntry interface from react-native-calendars and help to add the custom
// properties that are needed for the appointment entry in addition to the properties that are already in the AgendaEntry interface.
export interface AppointmentEntry extends AgendaEntry {
    id: string;
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
    status: string;
    notes: string | null;
}

//this is the raw data that comes in from the API.
export interface Appointment {
    id: string;
    date: string;
    notes: string | null;
    startTime: string;
    endTime: string;
    appointmentType: string;
    status: string;
    facility: string;
    facilityAddress: string;
    facilityCity: string;
    facilityState: string;
    facilityId: string;
    patient: string;
    patientFirstName: string;
    patientLastName: string;
    patientId: string;
}

export interface Facility {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    county: string;
    zipCode: string;
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