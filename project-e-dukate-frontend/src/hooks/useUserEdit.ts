/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/services/api';
import { showNotification } from '@/services/notificationService';
import { BaseUser, UserRole, SpecialistResponse, Administrator, Specialist } from '@/types/userTypes';
import { useUserEditStore } from '@/stores/userStore';

interface UseUserEditProps<T extends BaseUser> {
  role: UserRole | null;
  id: string;
}

interface UseUserEditResult<T extends BaseUser> {
  userData: T | null;
  formData: T | null;
  loading: boolean;
  isSubmitting: boolean;
  isUpdateSuccessful: boolean;
  error: string | null;
  handleSubmit: () => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<T | null>>;
}

export const useUserEdit = <T extends BaseUser>({ role, id }: UseUserEditProps<T>): UseUserEditResult<T> => {
  const router = useRouter();
  const { clearUserEditData } = useUserEditStore();
  const [userData, setUserData] = useState<T | null>(null);
  const [formData, setFormData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (role === 'Administrator') {
          const administrator = await apiRequest<T>('administrators', 'GET', undefined, id);
          setUserData(administrator);
          setFormData(administrator);
        } else if (role === 'Specialist') {
          const specialistResponse = await apiRequest<SpecialistResponse>('specialists', 'GET', undefined, id);
          const specialist: Specialist = {
            ...specialistResponse,
            typeOfSpecialty: specialistResponse.specialty,
          };
          setUserData(specialist as unknown as T);
          setFormData(specialist as unknown as T);
        } else {
          setError('Rol de usuario no válido o no proporcionado');
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Error al obtener los detalles del usuario');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    } else {
      setError('No se proporcionó un ID de usuario');
      setLoading(false);
    }
  }, [id, role]);

  const handleSubmit = async () => {
    if (!formData) return;
    try {
      setIsSubmitting(true);
      if (role === 'Administrator') {
        const { id, ...dataToSend } = formData as Administrator;
        await apiRequest('administrators', 'PUT', dataToSend, id);
      } else if (role === 'Specialist') {
        const { id, ...dataToSend } = formData as unknown as Specialist;
        await apiRequest('specialists', 'PUT', dataToSend, id);
      }
      setIsUpdateSuccessful(true);
      router.push('/dashboard/usuarios');
      setTimeout(() => {
        clearUserEditData();
      }, 100);
    } catch (err: any) {
      console.error('Error updating user:', err);
      const errorMessage = err.message || 'Error al actualizar los datos';
      try {
        const errorDetails = err.response ? await err.response.json() : {};
        console.error('Detalles del error del servidor:', errorDetails);
        showNotification(errorDetails.message || errorMessage, 'error');
      } catch (parseError) {
        showNotification(errorMessage, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { userData, formData, loading, isSubmitting, isUpdateSuccessful, error, handleSubmit, setFormData };
};