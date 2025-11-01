/* eslint-disable @typescript-eslint/no-explicit-any */
import { Specialist } from "@/types/userTypes";
import { apiRequest } from "./api";
import { showNotification } from "./notificationService";
import { Appointment } from "@/types/appointment";

interface FetchAppointmentsParams {
  patientId?: string;
  specialistId?: string;
  specialtyId?: string;
  date?: string;
  status?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateAppointmentPayload {
  patientId: string;
  specialtyId: string;
  specialistId: string;
  sessionCount: number;
  sessionCost: number;
  scheduledSessions: {
    timeSlotId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    status: string;
  }[];
}

export interface ReschedulePreviewRequest {
  sessionId: string;
  targetDayOfWeek?: string;
  specificDate?: string;
  lookAheadWeeks?: number;
}

export interface AvailableTimeSlot {
  timeSlotId: string;
  startDateTime: string;
  endDateTime: string;
  dayOfWeek: string;
  formattedDate: string;
  formattedTime: string;
  isSameDay: boolean;
  isNextWeek: boolean;
}

export interface RescheduleSessionPayload {
  sessionId: string;
  newTimeSlotId: string;
  newStartDateTime: string;
  newEndDateTime: string;
}

export const fetchAppointments = async ({
  patientId,
  specialistId,
  specialtyId,
  date,
  status,
  pageNumber = 1,
  pageSize = 10,
}: FetchAppointmentsParams): Promise<{
  items: Appointment[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}> => {
  try {
    const queryParams = new URLSearchParams();
    if (patientId) queryParams.append("patientId", patientId);
    if (specialistId) queryParams.append("specialistId", specialistId);
    if (specialtyId) queryParams.append("specialtyId", specialtyId);
    if (date) queryParams.append("date", date);
    if (status) queryParams.append("status", status);
    queryParams.append("PageNumber", pageNumber.toString());
    queryParams.append("PageSize", pageSize.toString());

    const result = await apiRequest<{
      Items: Appointment[];
      TotalCount: number;
      PageNumber: number;
      PageSize: number;
      TotalPages: number;
    }>("appointments", "GET", undefined, undefined, `?${queryParams.toString()}`);

    return {
      items: result.Items,
      totalCount: result.TotalCount,
      pageNumber: result.PageNumber,
      pageSize: result.PageSize,
      totalPages: result.TotalPages,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error al cargar las citas";
    showNotification(errorMessage, "error");
    throw new Error(errorMessage);
  }
};

export const fetchSpecialistsBySpecialty = async (specialtyId: string): Promise<Specialist[]> => {
  try {
    const response = await apiRequest<Specialist[]>("specialistsBySpecialty", "GET", undefined, specialtyId);
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error al cargar los especialistas";
    showNotification(errorMessage, "error");
    throw new Error(errorMessage);
  }
};

export const fetchAppointmentPreview = async (appointment: Partial<Appointment>): Promise<{ start: string; end: string }[]> => {
  try {
    const payload = {
      PatientId: appointment.patientId,
      SpecialtyId: appointment.specialtyId,
      SpecialistId: appointment.specialistId,
      SessionCount: appointment.sessionCount,
      SessionCost: parseFloat(appointment.sessionCost?.toString() || "65"),
      ScheduledSessions: appointment.scheduledSessions?.map(s => ({
        TimeSlotId: s.timeSlotId,
        DayOfWeek: s.dayOfWeek,
        StartTime: s.startTime.split(':').slice(0, 2).join(':'),
        EndTime: s.endTime.split(':').slice(0, 2).join(':'),
        Status: s.status
      }))
    };

    return await apiRequest("appointmentPreview", "POST", payload);
  } catch (error: any) {
    const serverError = error.response?.data;
    if (serverError) {
      console.error("Backend error details:", serverError);
      const errorMessage = Array.isArray(serverError.errors) 
        ? serverError.errors.join(", ")
        : serverError.error || serverError.message;
      showNotification(errorMessage || "Error desconocido", "error");
      throw new Error(errorMessage);
    } else {
      const errorMessage = error.message || "Error al obtener la vista previa";
      showNotification(errorMessage, "error");
      throw new Error(errorMessage);
    }
  }
};

export const cancelSession = async (appointmentId: string, sessionId: string): Promise<void> => {
  try {
    await apiRequest(
      "cancelSession", 
      "PUT", 
      null, 
      `${appointmentId}/cancel-session/${sessionId}`
    );
    showNotification("Sesión cancelada exitosamente", "success");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error al cancelar la sesión";
    showNotification(errorMessage, "error");
    throw new Error(errorMessage);
  }
};

export const rescheduleSession = async (
  appointmentId: string,
  payload: RescheduleSessionPayload
): Promise<void> => {
  try {
    await apiRequest(
      "appointments",
      "PUT",
      payload,
      `reschedule-session/${appointmentId}`
    );
    
    showNotification("Sesión reprogramada exitosamente", "success");
  } catch (error: any) {
    const serverError = error.response?.data;
    const errorMessage = Array.isArray(serverError?.errors)
      ? serverError.errors.join(", ")
      : serverError?.error || serverError?.message || "Error al reprogramar la sesión";
    
    showNotification(errorMessage, "error");
    throw new Error(errorMessage);
  }
};

export const confirmSession = async (appointmentId: string, sessionId: string): Promise<void> => {
  try {
    await apiRequest(
      "appointments",
      "POST",
      null,
      `${appointmentId}/sessions/${sessionId}/confirm`
    );
  } catch (error: any) {
    const serverError = error.response?.data;
    if (serverError) {
      const errorMessage = Array.isArray(serverError.errors)
        ? serverError.errors.join(", ")
        : serverError.error || serverError.message || "Error desconocido al confirmar la sesión";
      if (!errorMessage.includes("El monto pagado debe ser al menos la mitad del monto total")) {
        showNotification(errorMessage, "error");
      }
      throw new Error(errorMessage);
    } else {
      const errorMessage = error.message || "Error al confirmar la sesión";
      showNotification(errorMessage, "error");
      throw new Error(errorMessage);
    }
  }
};

export const createAppointment = async (payload: CreateAppointmentPayload): Promise<void> => {
  try {
    
    await apiRequest("appointments", "POST", payload);
  } catch (error: any) {
    console.error('❌ Error creating appointment:', error);
    
    const serverError = error.response?.data;
    if (serverError) {
      const errorMessage = Array.isArray(serverError.errors)
        ? serverError.errors.join(", ")
        : serverError.error || serverError.message || "Error desconocido al crear la cita";
      showNotification(errorMessage, "error");
      throw new Error(errorMessage);
    } else {
      const errorMessage = error.message || "Error al crear la cita";
      showNotification(errorMessage, "error");
      throw new Error(errorMessage);
    }
  }
};

export const fetchReschedulePreview = async (
  appointmentId: string,
  request: ReschedulePreviewRequest
): Promise<AvailableTimeSlot[]> => {
  try {
    const response = await apiRequest<{ availableSlots: AvailableTimeSlot[] }>(
      "appointments",
      "POST",
      request,
      `${appointmentId}/reschedule-preview`
    );
    
    return response.availableSlots || [];
  } catch (error: any) {
    const serverError = error.response?.data;
    const errorMessage = Array.isArray(serverError?.errors)
      ? serverError.errors.join(", ")
      : serverError?.error || serverError?.message || "Error al obtener horarios disponibles";
    
    showNotification(errorMessage, "error");
    throw new Error(errorMessage);
  }
};