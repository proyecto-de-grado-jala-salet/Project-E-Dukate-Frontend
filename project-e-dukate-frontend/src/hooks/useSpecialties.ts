import { useEffect } from "react";
import { useState } from "react";
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

export const useSpecialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSpecialties = async () => {
    setLoading(true);
    setError(null);
    try {
      let allSpecialties: Specialty[] = [];
      let page = 1;
      let totalPages = 1;
      
      while (page <= totalPages) {
        const response = await fetchSpecialties() as SpecialtyResponse;
        allSpecialties = [...allSpecialties, ...response.items];
        totalPages = response.totalPages;
        page += 1;
      }

      setSpecialties(allSpecialties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching specialties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSpecialties();
  }, []);

  return { specialties, loading, error };
};