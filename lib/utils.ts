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
            height: 100,
            status: appointment.status,
            day: dateKey,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            appointmentType: appointment.appointmentType,
            facility: appointment.facility,
            facilityAddress: appointment.facilityAddress,
            facilityCity: appointment.facilityCity,
            facilityState: appointment.facilityState,
            facilityId: appointment.facilityId,
            patient: appointment.patient,
            patientFirstName: appointment.patientFirstName,
            patientLastName: appointment.patientLastName,
            patientId: appointment.patientId,
            notes: appointment.notes
        });
    });

    return agendaItemsMap;
};

export function formatPhoneNumber(phoneNumberString: string) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
}

export function trimAddress(fullAddress: string): string {
    const parts = fullAddress.split(',').map(s => s.trim());
    // Combine house number and street name with a space.
    const streetAddress = [parts[0], parts[1]].filter(Boolean).join(' ');
    const city = parts[2] || "";
    const state = parts[4] || "";
    const zip = parts[5] || "";
    return [streetAddress, city, state, zip].filter(Boolean).join(', ');
}