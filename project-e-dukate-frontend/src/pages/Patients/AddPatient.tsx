"use client";

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { PersonalInfoForm } from '../../components/FormComponents/PersonalInfoForm';
import { GeneralInfoForm } from '../../components/FormComponents/GeneralInfoForm';
import { Button } from '../../components/Button';
import { useApi } from '../../hooks/useApi';
import { useRouter } from 'next/navigation';
import { validatePatient } from '../../utils/validators';
import { showNotification } from '../../services/notificationService';
import dayjs from 'dayjs';

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
      router.push('/dashboard/pacientes');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al añadir paciente';
      showNotification(errorMessage, 'error');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/pacientes');
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', p: 3, minHeight: '100vh' }}>
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
        <Button label="Cancelar" variant="outlined" onClick={handleCancel} />
        <Button
          label="Guardar"
          variant="contained"
          sx={{ bgcolor: '#f5c71a', color: 'black' }}
          onClick={handleSubmit}
        />
      </Box>
    </Box>
  );
};

export default AddPatient;