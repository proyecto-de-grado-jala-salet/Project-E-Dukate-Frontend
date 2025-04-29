/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const API_ENDPOINTS = {
  specialties: 'http://localhost:5275/api/Specialties',
  users: 'http://localhost:5275/api/Users',
  administrators: 'http://localhost:5275/api/Administrators',
  specialists: 'http://localhost:5275/api/Specialists',
  patients: 'http://localhost:5275/api/Patients',
  schedules: 'http://localhost:5275/api/Schedules',
};

export const apiRequest = async <T>(
  endpoint: keyof typeof API_ENDPOINTS,
  method: string,
  body?: unknown,
  id?: string,
  query?: string
): Promise<T> => {
  const url = id ? `${API_ENDPOINTS[endpoint]}/${id}${query || ''}` : `${API_ENDPOINTS[endpoint]}${query || ''}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = await response.text();
    }
    const error = new Error(
      `Error en ${method} a ${url}: ${response.statusText}`
    );
    (error as any).response = { data: errorData, status: response.status };
    throw error;
  }

  return response.status === 204 ? ({} as T) : response.json();
};