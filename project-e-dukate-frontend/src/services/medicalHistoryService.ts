/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from './api';
import { showNotification } from './notificationService';
import { MedicalHistoryDto, PermissionRequestDto, UpdateMedicalHistoryStatusDto } from '@/types/medicalHistory';

interface Consultation {
  id: string;
  reason: string;
  consultationDate: string;
  notes: string;
  specialistId: string;
}

interface PaginatedConsultations {
  Items: Consultation[];
  TotalCount: number;
  PageNumber: number;
  PageSize: number;
  TotalPages: number;
}

interface BackendPaginatedResponse {
  items: Consultation[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const getMedicalHistoryByPatientId = async (patientId: string): Promise<MedicalHistoryDto | null> => {
  try {
    const response = await apiRequest<MedicalHistoryDto>('medicalhistories', 'GET', undefined, `patient/${patientId}`);
    return response;
  } catch (error) {
    showNotification(error instanceof Error ? error.message : 'Error al obtener el historial médico', 'error');
    return null;
  }
};

export const updatePermission = async (request: PermissionRequestDto): Promise<boolean> => {
  try {
    await apiRequest('medicalhistories', 'POST', request, 'permissions');
    return true;
  } catch (error) {
    showNotification(error instanceof Error ? error.message : 'Error al actualizar el permiso', 'error');
    return false;
  }
};

export const deletePermission = async (permissionId: string): Promise<boolean> => {
  try {
    await apiRequest('medicalhistories', 'DELETE', undefined, `permissions/${permissionId}`);
    return true;
  } catch (error) {
    showNotification(error instanceof Error ? error.message : 'Error al eliminar el permiso', 'error');
    return false;
  }
};

export const updateMedicalHistoryStatus = async (
  medicalHistoryId: string,
  specialistId: string,
  status: string
): Promise<boolean> => {
  const request: UpdateMedicalHistoryStatusDto = { Status: status as any };
  try {
    await apiRequest('medicalhistories', 'PUT', request, `histories/${medicalHistoryId}/specialists/${specialistId}/status`);
    return true;
  } catch (error) {
    showNotification(error instanceof Error ? error.message : 'Error al actualizar el estado', 'error');
    return false;
  }
};

export const getSpecialistConsultations = async (
  medicalHistoryId: string,
  specialistId: string,
  permissionId: string,
  pageNumber: number,
  pageSize: number
): Promise<PaginatedConsultations | null> => {
  try {
    const response = await apiRequest<BackendPaginatedResponse>(
      'medicalconsultations',
      'GET',
      undefined,
      `histories/${medicalHistoryId}/specialists/${specialistId}/permissions/${permissionId}/consultations?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    if (response && Object.keys(response).length > 0) {
      const validConsultations = response.items.filter(item => item.specialistId === specialistId);
      return {
        Items: validConsultations.map(item => ({
          id: item.id,
          reason: item.reason,
          consultationDate: item.consultationDate,
          notes: item.notes,
          specialistId: item.specialistId,
        })),
        TotalCount: response.totalCount || 0,
        PageNumber: response.pageNumber || 1,
        PageSize: response.pageSize || pageSize,
        TotalPages: response.totalPages || 1,
      };
    }
    showNotification('No se encontraron consultas', 'error');
    return null;
  } catch (error) {
    console.error('Error in getSpecialistConsultations:', error);
    showNotification(error instanceof Error ? error.message : 'Error al obtener las consultas', 'error');
    return null;
  }
};