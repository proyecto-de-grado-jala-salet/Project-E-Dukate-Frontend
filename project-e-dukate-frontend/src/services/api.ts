/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';

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
  paymentsFilter: 'http://localhost:5275/api/payments/filter',
  payments: 'http://localhost:5275/api/payments',
  medicalHistoryMetrics: 'http://localhost:5275/api/metrics/medical-histories',
  demographicMetrics: 'http://localhost:5275/api/metrics/demographics/',
  paymentMetrics: 'http://localhost:5275/api/metrics/payments',
  appointments: 'http://localhost:5275/api/Appointments',
  specialistsBySpecialty: 'http://localhost:5275/api/Schedules/specialists-by-specialty',
  appointmentPreview: 'http://localhost:5275/api/Appointments/preview',
  appointmentArchive: 'http://localhost:5275/api/Appointments/sessions',
  cancelSession: 'http://localhost:5275/api/Appointments/appointment',
  rescheduleSession: 'http://localhost:5275/api/Appointments/reschedule-session',
};

export const setAuthToken = (token: string) => {
  Cookies.set('authToken', token, { expires: 1, secure: true, sameSite: 'strict' });
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get('authToken');
};

export const clearAuthToken = () => {
  Cookies.remove('authToken');
};

const requestCache = new Map();

export const apiRequest = async <T>(
  endpoint: keyof typeof API_ENDPOINTS,
  method: string,
  body?: unknown,
  id?: string,
  query?: string
): Promise<T> => {
  const url = id ? `${API_ENDPOINTS[endpoint]}/${id}${query || ''}` : `${API_ENDPOINTS[endpoint]}${query || ''}`;
  const cacheKey = `${method}:${url}`;
  if (method === 'GET' && requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey);
  }
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
    cache: 'default',
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
      window.location.href = '/login';
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    const contentType = response.headers.get('content-type');
    let errorData: any;
    try {
      errorData = contentType && contentType.includes('application/json')
        ? await response.json()
        : await response.text();
    } catch (e) {
      errorData = 'No se pudo leer la respuesta del servidor';
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

export const clearApiCache = (endpoint?: keyof typeof API_ENDPOINTS) => {
  if (endpoint) {
    // Eliminar todas las entradas de caché para este endpoint
    for (const key of requestCache.keys()) {
      if (key.includes(endpoint)) {
        requestCache.delete(key);
      }
    }
  } else {
    // Limpiar todo el caché
    requestCache.clear();
  }
};