export const API_ENDPOINTS = {
  specialties: "http://localhost:8080/api/Specialties",
  // patients: "http://localhost:8080/api/Patients",
} as const;

type ApiEndpoint = keyof typeof API_ENDPOINTS;

export const apiRequest = async <T>(
  endpoint: ApiEndpoint,
  method: "GET" | "POST" | "PUT" | "DELETE",
  data?: unknown,
  id?: string
): Promise<T> => {
  const baseUrl = API_ENDPOINTS[endpoint];
  const url = id && (method === "DELETE" || method === "PUT") ? `${baseUrl}/${id}` : baseUrl;
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    body: data && method !== "DELETE" ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error en ${method} a ${url}`);
  }

  if (response.status === 204) return true as T;
  return response.json();
};