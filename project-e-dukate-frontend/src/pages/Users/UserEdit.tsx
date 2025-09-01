"use client";
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { PersonalInfoForm } from '@/components/FormComponents/PersonalInfoForm';
import { GeneralInfoForm } from '@/components/FormComponents/GeneralInfoForm';
import { AdministratorForm } from '@/components/FormComponents/AdministratorForm';
import { SpecialistForm } from '@/components/FormComponents/SpecialistForm';
import { BaseUser } from '@/types/userTypes';
import { UserRole } from '@/types/userTypes';
import { Specialist } from '@/types/userTypes';
import { mapRadioValueToGender } from '@/utils/formUtils';
import { mapGenderToRadioValue } from '@/utils/formUtils';

interface UserEditProps<T extends BaseUser> {
  formData: T | null;
  role: UserRole | null;
  handleSubmit: () => Promise<void>;
  setFormData: React.Dispatch<React.SetStateAction<T | null>>;
  isSubmitting?: boolean;
}

export const UserEdit = <T extends BaseUser>({ formData, role, handleSubmit, setFormData, isSubmitting }: UserEditProps<T>) => {
  const router = useRouter();

  const handlePersonalInfoChange = (
    field: 'names' | 'lastNamePaternal' | 'lastNameMaternal' | 'mobileNumber' | 'gender' | 'birthDate'
  ) => (value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedData: Partial<BaseUser> = {};
      if (field === 'birthDate') {
        updatedData.dateOfBirth = value;
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
      const updatedData: Partial<BaseUser> = {};
      if (field === 'idNumber') {
        updatedData.identityCard = parseInt(value) || 0;
      } else {
        updatedData[field] = value;
      }
      return { ...prev, ...updatedData };
    });
  };

  const handleSpecialistChange = (
    field: 'code' | 'position' | 'yearsOfExperience' | 'email' | 'password'
  ) => (value: string) => {
    setFormData((prev) => {
      if (!prev || role !== 'Specialist') return null;
      const updatedData: Partial<Specialist> = {};
      if (field === 'code') {
        updatedData.specialistCode = value;
      } else if (field === 'position') {
        updatedData.typeOfSpecialty = value;
      } else if (field === 'yearsOfExperience') {
        updatedData.yearsOfExperience = parseInt(value) || 0;
      } else {
        updatedData[field] = value;
      }
      return { ...prev, ...updatedData } as T;
    });
  };

  const handleAdministratorChange = (
    field: 'email' | 'password'
  ) => (value: string) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updatedData: Partial<BaseUser> = {};
      updatedData[field] = value;
      return { ...prev, ...updatedData } as T;
    });
  };

  const handleCancel = () => {
    router.back();
  };

  if (!formData) return null;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Actualizar Datos del Usuario
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

      {role === 'Specialist' && (
        <SpecialistForm
          formData={{
            code: (formData as unknown as Specialist).specialistCode,
            position: (formData as unknown as Specialist).typeOfSpecialty,
            yearsOfExperience: String((formData as unknown as Specialist).yearsOfExperience),
            email: formData.email,
            password: formData.password,
          }}
          handleInputChange={handleSpecialistChange}
        />
      )}

      {role === 'Administrator' && (
        <AdministratorForm
          formData={{
            email: formData.email,
            password: formData.password,
          }}
          handleInputChange={handleAdministratorChange}
        />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isSubmitting}
          color="error"
          sx={{ borderRadius: 3 }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{ bgcolor: '#f5a623', color: 'black', borderRadius: 3 }}
        >
          Actualizar
        </Button>
      </Box>
    </Box>
  );
};

export default UserEdit;