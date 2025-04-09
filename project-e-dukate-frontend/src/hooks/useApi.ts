/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, apiRequest } from "../services/api";
import { showNotification } from "../services/notificationService";
import { GenericItem } from "../types/table";

export const useApi = <T extends GenericItem>(endpoint: keyof typeof API_ENDPOINTS) => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const result = await apiRequest<T[]>(endpoint, "GET");
      setData(result);
    } catch (err) {
      const errorMessage = "Error al cargar los datos";
      setError(errorMessage);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addItem = async (item: Partial<T>) => {
    try {
      await apiRequest<T>(endpoint, "POST", item);
      await fetchData();
    } catch (err) {
      const errorMessage = "Error al añadir el elemento";
      showNotification(errorMessage, "error");
    }
  };

  const updateItem = async (id: string, item: Partial<T>) => {
    try {
      await apiRequest<T>(endpoint, "PUT", item, id);
      await fetchData();
    } catch (err) {
      const errorMessage = "Error al actualizar el elemento";
      showNotification(errorMessage, "error");
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiRequest<T>(endpoint, "DELETE", undefined, id);
      await fetchData();
    } catch (err) {
      const errorMessage = "Error al eliminar el elemento";
      showNotification(errorMessage, "error");
    }
  };

  return { data, error, addItem, updateItem, deleteItem, refresh: fetchData };
};