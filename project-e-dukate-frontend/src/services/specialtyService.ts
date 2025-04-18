import { apiRequest } from './api';

export const fetchSpecialties = () => apiRequest<unknown>("specialties", "GET");
export const addSpecialty = (data: { typeOfSpecialty: string }) => apiRequest<unknown>("specialties", "POST", data);
export const updateSpecialty = (id: string, data: { typeOfSpecialty: string }) => apiRequest<unknown>("specialties", "PUT", { ...data, id });
export const deleteSpecialty = (id: string) => apiRequest<unknown>("specialties", "DELETE", { id });