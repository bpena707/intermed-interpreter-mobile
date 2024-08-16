import {Appointment} from '@/types/appointmentTypes';
import {AppointmentEntry} from '@/types/appointmentTypes';

//AgendaItemsMap maps through the Appointment Entry that is coming in from the API and formats it in a way that the agenda component can read it
//date is the key and the value is an array of appointment entries required for the agenda component
export interface AgendaItemsMap {
    [date: string]: AppointmentEntry[];
}

//this function is used to format the data for the agenda component which is rendered in the index
export const formatDataForAgenda = (appointments: Appointment[]): AgendaItemsMap => {
    const formattedData: AgendaItemsMap = {};

    appointments.forEach((appointment) => {
        // Split the date and time from the date string as passed in the api as dateTtime
        const dateKey = appointment.date.split('T')[0];

        if (!formattedData[dateKey]) {
            formattedData[dateKey] = [];
        }

        formattedData[dateKey].push({
            id: appointment.id,
            name: appointment.patient, // Use the patient's name as the name
            height: 100, // Set a fixed height for each item (customize as needed)
            day: dateKey, // Use the formatted date as the day
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            appointmentType: appointment.appointmentType,
            facility: appointment.facility,
            facilityId: appointment.facilityId,
            patient: appointment.patient,
            patientId: appointment.patientId,
            notes: appointment.notes,
        });
    });

    return formattedData;
};