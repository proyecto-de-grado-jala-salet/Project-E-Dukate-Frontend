export const API_ENDPOINTS = {
  specialties: 'http://localhost:8080/api/Specialties',
  users: 'http://localhost:8080/api/Users',
  administrators: 'http://localhost:8080/api/Administrators',
  specialists: 'http://localhost:8080/api/Specialists',
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
    throw new Error(`Error en ${method} a ${url}: ${response.statusText}`);
  }

  return response.status === 204 ? ({} as T) : response.json();
};