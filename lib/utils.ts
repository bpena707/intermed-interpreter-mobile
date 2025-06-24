import { Appointment } from '@/types/apiTypes';
import { AppointmentEntry } from '@/types/apiTypes';

import { ClassValue, clsx } from 'clsx'
import { parseISO } from 'date-fns';
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
        const appointmentDate = parseISO(appointment.date);

        // Format the date in local timezone (not UTC)
        // This ensures 5:04 PM on 7/1 stays on 7/1, not 7/2
        const year = appointmentDate.getFullYear();
        const month = String(appointmentDate.getMonth() + 1).padStart(2, '0');
        const day = String(appointmentDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;

        console.log(`Appointment ${appointment.bookingId}: Raw date: ${appointment.date}, Parsed local date: ${dateKey}`);


        if (!agendaItemsMap[dateKey]) {
            agendaItemsMap[dateKey] = [];
        }

        agendaItemsMap[dateKey].push({
            id: appointment.id,
            bookingId: appointment.bookingId,
            name: appointment.patient,
            height: 110,
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
            notes: appointment.notes,
            isCertified: appointment.isCertified,
        });
    });

    // Sort each day's appointments by start time
    Object.keys(agendaItemsMap).forEach((dateKey) => {
        agendaItemsMap[dateKey].sort((a, b) => {
            // Provide a default "late" time if startTime is missing, to avoid errors
            const timeAStr = a.startTime || '99:99:99';
            const timeBStr = b.startTime || '99:99:99';

            try {
                // Create dummy Date objects for comparison
                const timeA = new Date(`1970-01-01T${timeAStr}`);
                const timeB = new Date(`1970-01-01T${timeBStr}`);

                const comparisonResult = timeA.getTime() - timeB.getTime();

                // Log the comparison to see exactly what's happening
                console.log(`Comparing A (bookingId: ${a.bookingId}, time: "${a.startTime}") vs. B (bookingId: ${b.bookingId}, time: "${b.startTime}"). Result: ${comparisonResult}`);

                return comparisonResult;
            } catch (e) {
                console.error(`Could not parse startTime for sorting. A: "${a.startTime}", B: "${b.startTime}"`);
                return 0; // If parsing fails, don't change their order
            }
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