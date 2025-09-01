import { apiRequest } from './api';
import { SpecialtyResponse } from '@/types/table';

export const fetchSpecialties = (page: number = 1, search: string = '') => {
  const query = `?PageNumber=${page}&PageSize=10${search ? `&Search=${encodeURIComponent(search)}` : ''}`;
  return apiRequest<SpecialtyResponse>("specialties", "GET", undefined, undefined, query);
};

export const addSpecialty = (data: { typeOfSpecialty: string }) => apiRequest<unknown>("specialties", "POST", data);
export const updateSpecialty = (id: string, data: { typeOfSpecialty: string }) => apiRequest<unknown>("specialties", "PUT", { ...data, id });
export const deleteSpecialty = (id: string) => apiRequest<unknown>("specialties", "DELETE", { id });