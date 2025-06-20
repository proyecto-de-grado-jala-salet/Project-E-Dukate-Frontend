/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/services/api';
import { showNotification } from '@/services/notificationService';
import { Patient } from '@/types/userTypes';
import { useEditStore } from '@/stores/editStore';

interface UsePatientEditProps {
  id: string;
}

interface UsePatientEditResult<T> {
  formData: T | null;
  loading: boolean;
  isSubmitting: boolean;
  isUpdateSuccessful: boolean;
  error: string | null;
  handleSubmit: () => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<T | null>>;
}

export const usePatientEdit = <T extends Patient>({ id }: UsePatientEditProps): UsePatientEditResult<T> => {
  const router = useRouter();
  const { clearEditData } = useEditStore();
  const [formData, setFormData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const patient = await apiRequest<T>('patients', 'GET', undefined, id);
        setFormData(patient);
      } catch (err) {
        console.error('Error fetching patient details:', err);
        setError('Error al obtener los detalles del paciente');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPatientData();
    } else {
      setError('No se proporcionó un ID de paciente');
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!formData) return;
    try {
      setIsSubmitting(true);
      const { id, ...dataToSend } = formData;
      await apiRequest('patients', 'PUT', dataToSend, id);
      setIsUpdateSuccessful(true);
      router.push('/dashboard/pacientes');
      setTimeout(() => {
        clearEditData();
      }, 100);
    } catch (err: any) {
      console.error('Error updating patient:', err);
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

  return { formData, loading, isSubmitting, isUpdateSuccessful, error, handleSubmit, setFormData };
};