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

export interface AgendaEntry {
    id: string;
    name: string;
    height: number;
    day: string;
    startTime: string;
    endTime: string;
    appointmentType: string;
    facility: string;
    facilityId: string;
    patient: string;
    patientId: string;
    notes: string | null;
}

export interface AgendaItemsMap {
    [date: string]: AgendaEntry[];
}

//this function is used to format the data for the agenda component which is rendered in the index
export const formatDataForAgenda = (appointments: Appointment[]): AgendaItemsMap => {
    const formattedData: AgendaItemsMap = {};

    appointments.forEach((appointment) => {
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