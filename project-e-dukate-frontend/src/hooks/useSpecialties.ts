import { useQuery } from '@tanstack/react-query';
import { fetchSpecialties } from '@/services/specialtyService';

interface Specialty {
  id: string;
  typeOfSpecialty: string;
}

interface SpecialtyResponse {
  items: Specialty[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const useSpecialties = (page: number = 1, search: string = '') => {
  const { data, isLoading: loading, error } = useQuery<SpecialtyResponse, Error>({
    queryKey: ['specialties', page, search],
    queryFn: () => fetchSpecialties(page, search),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    enabled: page >= 1 && !!search !== undefined,
  });

  return {
    specialties: data?.items ?? [],
    totalCount: data?.totalCount ?? 0,
    totalPages: data?.totalPages ?? 0,
    pageNumber: data?.pageNumber ?? 1,
    pageSize: data?.pageSize ?? 10,
    loading,
    error: error ? (error instanceof Error ? error.message : 'Error fetching specialties') : null,
  };
};