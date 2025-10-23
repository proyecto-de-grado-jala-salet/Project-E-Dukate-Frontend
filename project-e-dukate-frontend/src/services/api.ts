/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from 'js-cookie';

const getApiBaseUrl = (): string => {
  const defaultUrl = 'https://project-e-dukate-backend-production.up.railway.app/api';

  if (typeof window === 'undefined') {
    return defaultUrl;
  }

  const hostname = window.location.hostname.toLowerCase();

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5275/api';
  }
  
  if (hostname.includes('test')) {
    return 'https://project-e-dukate-backend-test.up.railway.app/api';
  }
  
  return defaultUrl;
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  specialties: `${API_BASE_URL}/Specialties`,
  users: `${API_BASE_URL}/Users`,
  administrators: `${API_BASE_URL}/Administrators`,
  specialists: `${API_BASE_URL}/Specialists`,
  patients: `${API_BASE_URL}/Patients`,
  schedules: `${API_BASE_URL}/Schedules`,
  login: `${API_BASE_URL}/Auth/login`,
  medicalhistories: `${API_BASE_URL}/MedicalHistories`,
  medicalconsultations: `${API_BASE_URL}/MedicalConsultations`,
  paymentsFilter: `${API_BASE_URL}/payments/filter`,
  payments: `${API_BASE_URL}/payments`,
  medicalHistoryMetrics: `${API_BASE_URL}/metrics/medical-histories`,
  demographicMetrics: `${API_BASE_URL}/metrics/demographics/`,
  paymentMetrics: `${API_BASE_URL}/metrics/payments`,
  appointments: `${API_BASE_URL}/Appointments`,
  specialistsBySpecialty: `${API_BASE_URL}/Schedules/specialists-by-specialty`,
  appointmentPreview: `${API_BASE_URL}/Appointments/preview`,
  appointmentArchive: `${API_BASE_URL}/Appointments/sessions`,
  cancelSession: `${API_BASE_URL}/Appointments/appointment`,
  rescheduleSession: `${API_BASE_URL}/Appointments/reschedule-session`,
  paymentQRs: `${API_BASE_URL}/PaymentQRs`,
  temporaryAppointments: `${API_BASE_URL}/TemporaryAppointments`,
  uploadComprobante: `${API_BASE_URL}/TemporaryAppointments/upload-comprobante`,
  // reschedulePreview: `${API_BASE_URL}/Appointments/reschedule-preview`,
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
  const skipCache = endpoint === 'specialties';
  const url = id ? `${API_ENDPOINTS[endpoint]}/${id}${query || ''}` : `${API_ENDPOINTS[endpoint]}${query || ''}`;
  const cacheKey = `${method}:${url}`;
  if (method === 'GET' && requestCache.has(cacheKey) && !skipCache) {
    return requestCache.get(cacheKey);
  }
  const token = getAuthToken();

  const headers: HeadersInit = {};
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    cache: 'default' as RequestCache,
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
  } else if (contentType && contentType.includes('image')) {
    return response.blob() as unknown as T;
  } else {
    return (await response.text()) as unknown as T;
  }
};

export const clearApiCache = (endpoint?: keyof typeof API_ENDPOINTS) => {
  if (endpoint) {
    for (const key of requestCache.keys()) {
      if (key.includes(endpoint)) {
        requestCache.delete(key);
      }
    }
  } else {
    requestCache.clear();
  }
};