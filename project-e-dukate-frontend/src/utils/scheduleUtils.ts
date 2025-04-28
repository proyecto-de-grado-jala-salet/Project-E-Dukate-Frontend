import { TimeSlot } from "@/types/userTypes";

export const dayTranslation: { [key: string]: string } = {
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
};

export const formatTimeSlot = (timeSlots: TimeSlot[]): string => {
  if (!timeSlots || timeSlots.length === 0) return "-";
  return timeSlots
    .map((slot) => `${slot.startTime} a ${slot.endTime}`)
    .join(", ");
};
