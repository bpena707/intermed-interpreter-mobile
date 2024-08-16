import { AgendaEntry } from "react-native-calendars";

// the AppointmentEntry extends the AgendaEntry interface from react-native-calendars and help to add the custom
// properties that are needed for the appointment entry in addition to the properties that are already in the AgendaEntry interface.
export interface AppointmentEntry extends AgendaEntry {
    id: string;
    startTime: string;
    endTime: string;
    patient: string;
    patientId: string;
    facility: string;
    facilityId: string;
    appointmentType: string;
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
    facility: string;
    facilityId: string;
    patient: string;
    patientId: string;
}