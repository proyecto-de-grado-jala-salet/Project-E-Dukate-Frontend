/* eslint-disable @typescript-eslint/no-unused-vars */
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

  const fetchData = useCallback(
    async (page: number = 1, searchTerm: string = "") => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          "pagination.PageNumber": page.toString(),
          "pagination.PageSize": pageSize.toString(),
        });
        if (searchTerm) {
          queryParams.append("searchTerm", searchTerm);
        }
        const searchPath = searchTerm ? "/search" : "";
        const result = await apiRequest<PagedResponse<T>>(
          endpoint,
          "GET",
          undefined,
          undefined,
          `${searchPath}?${queryParams}`
        );
        if (!result || !result.items) {
          throw new Error("No se encontraron resultados");
        }
        const normalizedData = result.items.map(item => ({
        ...item,
        schedules: Array.isArray(item.schedules) ? item.schedules : [],
      }));
        setData(result.items);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setCurrentPage(result.pageNumber);
        setError(null);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar los datos";
        setError(errorMessage);
        if (!searchTerm) {
          showNotification(errorMessage, "error");
        }
      } finally {
        setLoading(false);
      }
    },
    [endpoint, pageSize]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addItem = async (item: Partial<T>) => {
    try {
      await apiRequest<T>(endpoint, "POST", item);
      await fetchData(currentPage);
    } catch (err: unknown) {
      const response = await fetch(API_ENDPOINTS[endpoint], { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(item) 
      }).catch(() => null);
      let errorMessage = "Error al añadir el elemento";
      if (response && !response.ok) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      }
      throw new Error(errorMessage);
    }
  };

  const updateItem = async (id: string, item: Partial<T>) => {
    try {
      await apiRequest<T>(endpoint, "PUT", item, id);
      await fetchData(currentPage);
    } catch (err: unknown) {
      const response = await fetch(`${API_ENDPOINTS[endpoint]}/${id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(item) 
      }).catch(() => null);
      let errorMessage = "Error al actualizar el elemento";
      if (response && !response.ok) {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      }
      throw new Error(errorMessage);
    }
  };

  const deleteItem = async (id: string, role?: string) => {
    try {
      const query = role ? `?role=${role}` : "";
      await apiRequest<T>(endpoint, "DELETE", undefined, id, query);
      const queryParams = new URLSearchParams({
        "pagination.PageNumber": currentPage.toString(),
        "pagination.PageSize": pageSize.toString(),
      });
      const result = await apiRequest<PagedResponse<T>>(endpoint, "GET", undefined, undefined, `?${queryParams}`);
      
      setData(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);

      if (result.items.length === 0 && currentPage > 1) {
        const previousPage = currentPage - 1;
        await fetchData(previousPage);
        return { success: true, movedToPrevious: true, newPage: previousPage };
      }

      return { success: true, movedToPrevious: false };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar el elemento";
      showNotification(errorMessage, "error");
      throw err;
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