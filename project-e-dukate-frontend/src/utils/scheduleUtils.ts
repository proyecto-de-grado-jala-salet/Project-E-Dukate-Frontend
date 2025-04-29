// src/utils/scheduleUtils.ts
import { TimeSlot } from "@/types/userTypes";
import { TimeSlotDto } from "@/types/schedule";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export const dayTranslation: { [key: string]: string } = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
  Sunday: "Domingo",
};

export const dayOfWeekMapping: { [key: number]: string } = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

export const daysOfWeek = [
  { value: "Monday", label: "Lunes" },
  { value: "Tuesday", label: "Martes" },
  { value: "Wednesday", label: "Miércoles" },
  { value: "Thursday", label: "Jueves" },
  { value: "Friday", label: "Viernes" },
  { value: "Saturday", label: "Sábado" },
  { value: "Sunday", label: "Domingo" },
];

export const formatTimeSlot = (timeSlots: TimeSlot[]): string => {
  if (!timeSlots || timeSlots.length === 0) return "-";
  return timeSlots
    .map((slot) => `${slot.startTime} a ${slot.endTime}`)
    .join(", ");
};

export const mapBackendSchedules = (
  backendSchedules: import("@/types/schedule").BackendSchedule[]
): import("@/types/schedule").ScheduleDto[] => {
  return backendSchedules.map((schedule) => {
    const dayString = dayOfWeekMapping[schedule.dayOfWeek];
    if (!dayString) {
      throw new Error(`Invalid dayOfWeek value: ${schedule.dayOfWeek}`);
    }
    return {
      dayOfWeek: dayString,
      timeSlots: schedule.timeSlots.map((slot) => ({
        startTime: slot.startTime.slice(0, 5),
        endTime: slot.endTime.slice(0, 5),
      })),
      attends: schedule.attends,
    };
  });
};

export const initializeSchedules = (
  fetchedSchedules: import("@/types/schedule").ScheduleDto[]
): import("@/types/schedule").ScheduleDto[] => {
  return daysOfWeek.map((day) => {
    const existingSchedule = fetchedSchedules.find(
      (sched) => sched.dayOfWeek.toLowerCase() === day.value.toLowerCase()
    );
    return existingSchedule || { dayOfWeek: day.value, timeSlots: [], attends: false };
  });
};

export const calculateNextTimeSlot = (
  existingSlots: TimeSlotDto[]
): TimeSlotDto => {
  if (existingSlots.length === 0) {
    return { startTime: "08:00", endTime: "12:00" };
  }

  const sortedSlots = [...existingSlots].sort((a, b) =>
    dayjs(a.startTime, "HH:mm").diff(dayjs(b.startTime, "HH:mm"))
  );

  const lastSlot = sortedSlots[sortedSlots.length - 1];
  const lastEndTime = dayjs(lastSlot.endTime, "HH:mm");

  const nextStartTime = lastEndTime.add(15, "minute");
  const nextEndTime = nextStartTime.add(4, "hour");

  const maxEndTime = dayjs("22:00", "HH:mm");
  if (nextStartTime.isAfter(maxEndTime) || nextEndTime.isAfter(maxEndTime)) {
    throw new Error("No se pueden agregar más slots: fuera del rango laboral.");
  }

  const hasOverlap = existingSlots.some((slot) => {
    const slotStart = dayjs(slot.startTime, "HH:mm");
    const slotEnd = dayjs(slot.endTime, "HH:mm");
    return (
      nextStartTime.isBetween(slotStart, slotEnd, null, "[]") ||
      nextEndTime.isBetween(slotStart, slotEnd, null, "[]") ||
      (nextStartTime.isBefore(slotStart) && nextEndTime.isAfter(slotEnd))
    );
  });

  if (hasOverlap) {
    throw new Error("El nuevo slot se superpone con un slot existente.");
  }

  return {
    startTime: nextStartTime.format("HH:mm"),
    endTime: nextEndTime.format("HH:mm"),
  };
};

export const canAddTimeSlot = (existingSlots: TimeSlotDto[]): boolean => {
  if (existingSlots.length === 0) {
    return true;
  }

  const sortedSlots = [...existingSlots].sort((a, b) =>
    dayjs(a.startTime, "HH:mm").diff(dayjs(b.startTime, "HH:mm"))
  );

  const lastSlot = sortedSlots[sortedSlots.length - 1];
  const lastEndTime = dayjs(lastSlot.endTime, "HH:mm");

  const nextStartTime = lastEndTime.add(15, "minute");
  const nextEndTime = nextStartTime.add(4, "hour");

  const maxEndTime = dayjs("22:00", "HH:mm");
  return !(
    nextStartTime.isAfter(maxEndTime) || nextEndTime.isAfter(maxEndTime)
  );
};