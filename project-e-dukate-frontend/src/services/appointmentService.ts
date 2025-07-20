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
  patientSearch?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const fetchAppointments = async ({
  patientId,
  specialistId,
  specialtyId,
  date,
  status,
  patientSearch,
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
    if (patientSearch) queryParams.append("patientSearch", patientSearch);
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