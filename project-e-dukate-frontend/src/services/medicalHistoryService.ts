/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from './api';
import { showNotification } from './notificationService';
import { MedicalHistoryDto, PermissionRequestDto, UpdateMedicalHistoryStatusDto } from '@/types/medicalHistory';

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