/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from "./api";
import { showNotification } from "./notificationService";
import { BackendSchedule, ScheduleDto } from "@/types/schedule";

export const fetchSchedules = async (specialistId: string): Promise<BackendSchedule[]> => {
  try {
    return await apiRequest<BackendSchedule[]>(
      "schedules",
      "GET",
      undefined,
      `specialist/${specialistId}`
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al cargar los horarios";
    showNotification(errorMessage, "error");
    throw new Error(errorMessage);
  }
};

export const updateSchedules = async (
  specialistId: string,
  schedules: ScheduleDto[]
): Promise<void> => {
  try {
    const payload = schedules.map((sched) => ({
      dayOfWeek: sched.dayOfWeek,
      timeSlots: sched.attends
        ? sched.timeSlots.map((slot) => ({
            id: slot.id,
            startTime: `${slot.startTime}:00`,
            endTime: `${slot.endTime}:00`,
          }))
        : [],
      attends: sched.attends,
    }));
    await apiRequest("schedules", "PUT", payload, `specialist/${specialistId}`);
  } catch (error: any) {
    let errorMessage = "Error al actualizar los horarios. Por favor, intenta de nuevo.";
    if (error.response?.data) {
      if (error.response.data.errors) {
        errorMessage = error.response.data.errors.join(", ");
      } else if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else {
        errorMessage = JSON.stringify(error.response.data) || error.message;
      }
    } else if (error.message) {
      errorMessage = error.message.includes("Collection was modified")
        ? "Error en el servidor: No se pudo actualizar los horarios debido a un conflicto interno."
        : error.message;
    }
    showNotification(errorMessage, "error");
    throw new Error(errorMessage);
  }
};

export const fetchSpecialistName = async (specialistId: string): Promise<string> => {
  try {
    const specialistResponse = await apiRequest<any>(
      "specialists",
      "GET",
      undefined,
      specialistId
    );
    return `${specialistResponse.names} ${specialistResponse.lastNamePaternal} ${
      specialistResponse.lastNameMaternal || ""
    }`;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al cargar el especialista";
    showNotification(errorMessage, "error");
    throw new Error(errorMessage);
  }
};