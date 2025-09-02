"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { Patient } from '@/types/userTypes';
import { mapGenderToRadioValue } from '@/utils/formUtils';
import { mapRadioValueToGender } from '@/utils/formUtils';
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';

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

interface PatientEditProps {
  formData: Patient | null;
  handleSubmit: () => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<Patient | null>>;
  isSubmitting?: boolean;
}

export const PatientEdit: React.FC<PatientEditProps> = ({ formData, handleSubmit, setFormData, isSubmitting }) => {
  const router = useRouter();

  const handlePersonalInfoChange = (
    field: 'names' | 'lastNamePaternal' | 'lastNameMaternal' | 'mobileNumber' | 'gender' | 'birthDate'
  ) => (value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedData: Partial<Patient> = {};
      if (field === 'birthDate') {
        updatedData.dateOfBirth = value;
        updatedData.age = value ? new Date().getFullYear() - new Date(value).getFullYear() : prev.age;
      } else if (field === 'gender') {
        updatedData.gender = mapRadioValueToGender(value as 'Femenino' | 'Masculino');
      } else {
        updatedData[field] = value;
      }
      return { ...prev, ...updatedData };
    });
  };

  const handleGeneralInfoChange = (
    field: 'idNumber' | 'phoneNumber' | 'address'
  ) => (value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedData: Partial<Patient> = {};
      if (field === 'idNumber') {
        updatedData.identityCard = parseInt(value) || 0;
      } else {
        updatedData[field] = value;
      }
      return { ...prev, ...updatedData };
    });
  };

  const handleCancel = () => {
    router.back();
  };

  if (!formData) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Actualizar Datos del Paciente
      </Typography>

      <PersonalInfoForm
        formData={{
          names: formData.names,
          lastNamePaternal: formData.lastNamePaternal,
          lastNameMaternal: formData.lastNameMaternal || '',
          gender: mapGenderToRadioValue(formData.gender),
          birthDate: formData.dateOfBirth,
          mobileNumber: formData.mobileNumber,
        }}
        handleInputChange={handlePersonalInfoChange}
      />

      <GeneralInfoForm
        formData={{
          idNumber: String(formData.identityCard),
          phoneNumber: formData.phoneNumber || '',
          address: formData.address,
        }}
        handleInputChange={handleGeneralInfoChange}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          color='error'
          sx={{ borderRadius: "10px" }}
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{ borderRadius: "10px", bgcolor: '#f5a623', color: 'black' }}
        >
          Actualizar
        </Button>
      </Box>
    </Box>
  );
};

export default PatientEdit;