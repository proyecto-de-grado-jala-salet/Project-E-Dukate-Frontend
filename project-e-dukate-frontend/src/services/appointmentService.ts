import { apiRequest } from "./api";
import { showNotification } from "./notificationService";
import { Appointment } from "@/types/appointment";

export const fetchAppointments = async (
  patientId?: string,
  specialistId?: string,
  date?: string,
  status?: string,
  patientSearch?: string,
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<{
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