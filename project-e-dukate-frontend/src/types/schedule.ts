export interface ScheduleDto {
  dayOfWeek: string;
  timeSlots: TimeSlotDto[];
  attends: boolean;
}

export interface TimeSlotDto {
  id?: string;
  startTime: string;
  endTime: string;
}

export interface BackendSchedule {
  id: string;
  specialistId: string;
  specialist: null;
  dayOfWeek: number;
  timeSlots: {
    id: string; startTime: string; endTime: string 
}[];
  attends: boolean;
}