import { useState } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { API_ENDPOINTS } from "@/services/api";
import { apiRequest } from "@/services/api";
import { showNotification } from "@/services/notificationService";
import { GenericItem } from "@/types/table";

interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

interface UseApiOptions {
  useSearchEndpoint?: boolean;
  defaultPageSize?: number;
}

export const useApi = <T extends GenericItem>(
  endpoint: keyof typeof API_ENDPOINTS, 
  options: UseApiOptions = {}
) => {
  const { useSearchEndpoint = true, defaultPageSize = 10 } = options;
  
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(defaultPageSize);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(
    async (page: number = 1, queryParams: string = "") => {
      setLoading(true);
      try {
        const paginationParams = `PageNumber=${page}&PageSize=${pageSize}`;
        
        let fullQuery: string;
        let searchPath: string = "";
        
        if (useSearchEndpoint && queryParams) {
          searchPath = "/search";
          fullQuery = `?${paginationParams}&searchTerm=${encodeURIComponent(queryParams)}`;
        } else if (!useSearchEndpoint && queryParams) {
          fullQuery = `?${paginationParams}&${queryParams}`;
        } else {
          fullQuery = `?${paginationParams}`;
        }
          
        const result = await apiRequest<PagedResponse<T>>(
          endpoint,
          "GET",
          undefined,
          undefined,
          `${searchPath}${fullQuery}`
        );
        
        if (!result || !result.items) {
          throw new Error("No se encontraron resultados");
        }
        
        setData(result.items);
        setTotalCount(result.totalCount);
        setTotalPages(result.totalPages);
        setCurrentPage(result.pageNumber);
        setError(null);
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar los datos";
        setError(errorMessage);
        if (!queryParams) {
          showNotification(errorMessage, "error");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, pageSize, useSearchEndpoint]
  );

  useEffect(() => {
    const initialFetch = async () => {
      await fetchData(1, "");
    };
    
    initialFetch();
  }, [fetchData]);

  const addItem = useCallback(async (item: Partial<T>) => {
    try {
      await apiRequest<T>(endpoint, "POST", item);
      await fetchData(currentPage);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al añadir el elemento";
      showNotification(errorMessage, "error");
      throw new Error(errorMessage);
    }
  }, [endpoint, currentPage, fetchData]);

  const updateItem = useCallback(async (id: string, item: Partial<T>) => {
    try {
      await apiRequest<T>(endpoint, "PUT", item, id);
      await fetchData(currentPage);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar el elemento";
      showNotification(errorMessage, "error");
      throw new Error(errorMessage);
    }
  }, [endpoint, currentPage, fetchData]);

  const deleteItem = useCallback(async (id: string, role?: string) => {
    try {
      const query = role ? `?role=${role}` : "";
      await apiRequest<T>(endpoint, "DELETE", undefined, id, query);
      if (data.length === 1 && currentPage > 1) {
        await fetchData(currentPage - 1);
      } else {
        await fetchData(currentPage);
      }
      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar el elemento";
      showNotification(errorMessage, "error");
      throw err;
    }
  }, [endpoint, currentPage, data.length, fetchData]);

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