/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const API_ENDPOINTS = {
  specialties: 'http://localhost:5275/api/Specialties',
  users: 'http://localhost:5275/api/Users',
  administrators: 'http://localhost:5275/api/Administrators',
  specialists: 'http://localhost:5275/api/Specialists',
  patients: 'http://localhost:5275/api/Patients',
  schedules: 'http://localhost:5275/api/Schedules',
  login: 'http://localhost:5275/api/auth/login',
  medicalhistories: 'http://localhost:5275/api/MedicalHistories',
  medicalconsultations: 'http://localhost:5275/api/MedicalConsultations',
};

export const setAuthToken = (token: string) => {
  sessionStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return sessionStorage.getItem('authToken');
};

export const clearAuthToken = () => {
  sessionStorage.removeItem('authToken');
};

export const apiRequest = async <T>(
  endpoint: keyof typeof API_ENDPOINTS,
  method: string,
  body?: unknown,
  id?: string,
  query?: string
): Promise<T> => {
  const url = id ? `${API_ENDPOINTS[endpoint]}/${id}${query || ''}` : `${API_ENDPOINTS[endpoint]}${query || ''}`;
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
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

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.status === 204 ? ({} as T) : await response.json();
  } else {
    return (await response.text()) as unknown as T;
  }
};