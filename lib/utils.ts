import { Appointment } from '@/types/apiTypes';
import { AppointmentEntry } from '@/types/apiTypes';

import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

export interface AgendaItemsMap {
    [date: string]: AppointmentEntry[];
}

export const formatDataForAgenda = (appointments: Appointment[]): AgendaItemsMap => {
    const agendaItemsMap: AgendaItemsMap = {};

    appointments.forEach((appointment) => {
        const dateKey = appointment.date.split('T')[0];

        if (!agendaItemsMap[dateKey]) {
            agendaItemsMap[dateKey] = [];
        }

        agendaItemsMap[dateKey].push({
            id: appointment.id,
            name: appointment.patient,
            height: 80,
            day: dateKey,
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

    return agendaItemsMap;
};
