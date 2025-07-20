import { GenericItem } from "./table";

export interface Appointment extends GenericItem {
  id: string;
  startTime: string;
  endTime: string;
  patientId?: string;
  patientName: string;
  specialistId?: string;
  specialistName: string;
  specialtyId?: string;
  specialtyName?: string;
  sessionCount: number;
  status: string;
  scheduledSessions: {
    timeSlotId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    status: string;
  }[];
}

export interface AppointmentFilter {
  patientId?: string;
  specialistId?: string;
  specialtyId?: string;
  date?: Date | null;
  status?: string;
  patientSearch?: string;
}

export type FilterType = 'dropdown' | 'date' | 'week-range' | 'multi-select' | 'year' | 'month';

export interface Filter {
  label: string;
  value: unknown;
  onChange: (value: unknown) => void;
  options?: { value: string; label: string }[];
  type: FilterType;
  minDate?: string;
}