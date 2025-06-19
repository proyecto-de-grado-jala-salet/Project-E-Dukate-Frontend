import { apiRequest } from './api';
import { showNotification } from './notificationService';
import { MedicalHistoryFilterDto, MedicalHistoryMetricsDto } from '@/types/medicalHistory';

export const fetchMedicalHistoryMetrics = async (
  filter: MedicalHistoryFilterDto
): Promise<MedicalHistoryMetricsDto | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (filter.Year) queryParams.append('Year', filter.Year.toString());
    if (filter.Month) queryParams.append('Month', filter.Month.toString());
    if (filter.Day) queryParams.append('Day', filter.Day.toString());
    if (filter.Statuses && filter.Statuses.length > 0) {
      filter.Statuses.forEach(status => queryParams.append('Statuses', status));
    }

    const response = await apiRequest<MedicalHistoryMetricsDto>(
      'medicalHistoryMetrics',
      'GET',
      undefined,
      `filter?${queryParams.toString()}`
    );

    console.log('Metrics response:', response);
    if (!response || !response.metrics) {
      console.warn('Invalid metrics response:', response);
      return null;
    }

    return response;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    showNotification(
      error instanceof Error ? error.message : 'Error al obtener métricas',
      'error'
    );
    return null;
  }
};