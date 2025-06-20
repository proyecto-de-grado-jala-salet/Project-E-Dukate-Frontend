import { apiRequest } from './api';
import { showNotification } from './notificationService';
import { DemographicFilterDto, DemographicMetricsDto } from '@/types/metricas';

export const fetchDemographicMetrics = async (
  filter: DemographicFilterDto
): Promise<DemographicMetricsDto | null> => {
  try {
    const queryParams = new URLSearchParams();
    if (filter.genders && filter.genders.length > 0) {
      filter.genders.forEach(gender => queryParams.append('Genders', gender));
    }
    if (filter.minAge) queryParams.append('MinAge', filter.minAge.toString());
    if (filter.maxAge) queryParams.append('MaxAge', filter.maxAge.toString());

    const response = await apiRequest<DemographicMetricsDto>(
      'demographicMetrics',
      'GET',
      undefined,
      undefined,
      `filter?${queryParams.toString()}`
    );

    console.log('Demographic metrics response:', response);
    if (!response || !response.genderMetrics || !response.ageMetrics) {
      console.warn('Invalid demographic metrics response:', response);
      return null;
    }

    return response;
  } catch (error) {
    console.error('Error fetching demographic metrics:', error);
    showNotification(
      error instanceof Error ? error.message : 'Error al obtener métricas demográficas',
      'error'
    );
    return null;
  }
};