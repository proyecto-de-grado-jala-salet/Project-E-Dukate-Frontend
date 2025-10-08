"use client";

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/Button';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { validatePatient } from '@/utils/validators';
import { showNotification } from '@/services/notificationService';
import dayjs from 'dayjs';
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';

const PersonalInfoForm = dynamic(() => 
  import('@/components/FormComponents/PersonalInfoForm').then(mod => mod.PersonalInfoForm), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

const GeneralInfoForm = dynamic(() => 
  import('@/components/FormComponents/GeneralInfoForm').then(mod => mod.GeneralInfoForm), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

interface PatientFormData {
  names: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  gender: 'Femenino' | 'Masculino';
  birthDate: string;
  mobileNumber: string;
  idNumber: string;
  phoneNumber: string;
  address: string;
}

export const AddPatient: React.FC = () => {
  const router = useRouter();
  const { addItem } = useApi('patients');
  const [formData, setFormData] = useState<PatientFormData>({
    names: '',
    lastNamePaternal: '',
    lastNameMaternal: '',
    gender: 'Femenino',
    birthDate: '',
    mobileNumber: '',
    idNumber: '',
    phoneNumber: '',
    address: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { setIsNavigating } = useSafeNavigation();
  
  useEffect(() => {
    setIsNavigating(false);
  }, [setIsNavigating]);

  const handleInputChange = (field: keyof PatientFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async () => {
    const birthDate = formData.birthDate ? dayjs(formData.birthDate).format('YYYY-MM-DD') : '';
    const age = formData.birthDate
      ? dayjs().diff(dayjs(formData.birthDate), 'year')
      : 0;
  
    const patientDto = {
      names: formData.names,
      lastNamePaternal: formData.lastNamePaternal,
      lastNameMaternal: formData.lastNameMaternal || undefined,
      mobileNumber: formData.mobileNumber,
      identityCard: parseInt(formData.idNumber) || 0,
      phoneNumber: formData.phoneNumber || undefined,
      age,
      gender: formData.gender === 'Femenino' ? 'F' : 'M',
      dateOfBirth: birthDate,
      address: formData.address,
    };
  
    const validationErrors = validatePatient(patientDto);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      await addItem(patientDto);
      setIsNavigating(true);
      router.push('/dashboard/pacientes');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al añadir paciente';
      showNotification(errorMessage, 'error');
    }
  };

  const handleCancel = () => {
    setIsNavigating(true);
    router.push('/dashboard/pacientes');
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
        Registro de Paciente
      </Typography>
      <PersonalInfoForm
        formData={{
          names: formData.names,
          lastNamePaternal: formData.lastNamePaternal,
          lastNameMaternal: formData.lastNameMaternal,
          gender: formData.gender,
          birthDate: formData.birthDate,
          mobileNumber: formData.mobileNumber,
        }}
        handleInputChange={handleInputChange}
        errors={errors}
      />
      <GeneralInfoForm
        formData={{
          idNumber: formData.idNumber,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
        }}
        handleInputChange={handleInputChange}
        errors={errors}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button label="Cancelar" color='error' variant="outlined" onClick={handleCancel} />
        <Button
          label="Guardar"
          variant="contained"
          sx={{ bgcolor: '#f5a623', color: 'black' }}
          onClick={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default AddPatient;