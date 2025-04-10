import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS, apiRequest } from "../services/api";
import { showNotification } from "../services/notificationService";
import { GenericItem } from "../types/table";

interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const useApi = <T extends GenericItem>(endpoint: keyof typeof API_ENDPOINTS) => {
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        "pagination.PageNumber": page.toString(),
        "pagination.PageSize": pageSize.toString(),
      });
      const result = await apiRequest<PagedResponse<T>>(endpoint, "GET", undefined, undefined, `?${queryParams}`);
      console.log("Respuesta del backend:", result);
      if (!result || !result.items) {
        throw new Error("Formato de respuesta inválido: items no encontrado");
      }
      setData(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
      setCurrentPage(result.pageNumber);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar los datos";
      console.error("Error en fetchData:", errorMessage);
      setError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [endpoint, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addItem = async (item: Partial<T>) => {
    try {
      await apiRequest<T>(endpoint, "POST", item);
      await fetchData(currentPage);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al añadir el elemento";
      showNotification(errorMessage, "error");
    }
  };

  const updateItem = async (id: string, item: Partial<T>) => {
    try {
      await apiRequest<T>(endpoint, "PUT", item, id);
      await fetchData(currentPage);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar el elemento";
      showNotification(errorMessage, "error");
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await apiRequest<T>(endpoint, "DELETE", undefined, id);
      await fetchData(currentPage);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar el elemento";
      showNotification(errorMessage, "error");
    }
  };

  return {
    data,
    error,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
    loading,
    fetchData,
    addItem,
    updateItem,
    deleteItem,
    refresh: fetchData,
  };
};