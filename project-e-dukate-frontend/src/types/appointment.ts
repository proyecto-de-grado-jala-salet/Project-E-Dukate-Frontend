import { GenericItem } from "./table";

export interface Appointment extends GenericItem {
  id: string;
  startTime: string;
  endTime: string;
  patientId?: string;
  patientName: string;
  specialistId?: string;
  specialistName: string;
  status: string;
}

export interface AppointmentFilter {
  patientId?: string;
  specialistId?: string;
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