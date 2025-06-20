import { apiRequest } from './api';
import { showNotification } from './notificationService';
import { SpecialistDto } from '@/types/user';
import { AdministratorDto } from '@/types/user';

export const addAdministrator = async (data: AdministratorDto) => {
  try {
    await apiRequest<unknown>("administrators", "POST", data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error al añadir administrador';
    showNotification(errorMessage, 'error');
    throw new Error(errorMessage);
  }
};

export const addSpecialist = async (data: SpecialistDto) => {
  try {
    await apiRequest<unknown>("specialists", "POST", data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error al añadir especialista';
    showNotification(errorMessage, 'error');
    throw new Error(errorMessage);
  }
};