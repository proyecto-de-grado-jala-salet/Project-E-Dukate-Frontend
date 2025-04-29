export interface ScheduleDto {
  dayOfWeek: string;
  timeSlots: TimeSlotDto[];
  attends: boolean;
}

export interface TimeSlotDto {
  startTime: string;
  endTime: string;
}

export interface BackendSchedule {
  specialistId: string;
  specialist: null;
  dayOfWeek: number;
  timeSlots: { startTime: string; endTime: string }[];
  attends: boolean;
  id: string;
}
