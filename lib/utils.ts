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

export interface AgendaItem {
    id: string;
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
    [date: string]: AgendaItem[];
}

//this function is used to format the data for the agenda component which is rendered in the index
export const formatDataForAgenda = (data: Appointment[]): AgendaItemsMap => {
    const formattedData: AgendaItemsMap = {};

    data.forEach((appointment) => {
        const dateKey = appointment.date.split('T')[0];

        if (!formattedData[dateKey]) {
            formattedData[dateKey] = [];
        }

        formattedData[dateKey].push({
            id: appointment.id,
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