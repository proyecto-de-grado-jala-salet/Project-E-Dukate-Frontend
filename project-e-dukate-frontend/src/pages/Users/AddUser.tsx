"use client";

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Button } from '../../components/Button';
import { useRouter } from 'next/navigation';
import { useApi } from '../../hooks/useApi';
import {
  RoleSelector,
  PersonalInfoForm,
  GeneralInfoForm,
  AdministratorForm,
  SpecialistForm,
} from '../../components/FormComponents';

interface User {
  id: string;
  names: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  gender: 'Femenino' | 'Masculino';
  birthDate: string;
  mobileNumber: string;
  role: string;
  idNumber: string;
  phoneNumber: string;
  address: string;
  email: string;
  password: string;
  code?: string;
  position?: string;
  yearsOfExperience?: string;
}

interface AddUserProps {
  initialRole?: string | null;
}

export const AddUser: React.FC<AddUserProps> = ({ initialRole = null }) => {
  const router = useRouter();
  const { addItem: addUser } = useApi<User>("users");
  const [role, setRole] = useState<string | null>(initialRole);
  const [formData, setFormData] = useState({
    names: '',
    lastNamePaternal: '',
    lastNameMaternal: '',
    gender: 'Femenino' as 'Femenino' | 'Masculino',
    birthDate: '',
    mobileNumber: '',
    idNumber: '',
    phoneNumber: '',
    address: '',
    email: '',
    password: '',
    code: '',
    position: '',
    yearsOfExperience: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = [
      'names',
      'lastNamePaternal',
      'gender',
      'birthDate',
      'mobileNumber',
      'idNumber',
      'address',
      'email',
      'password',
    ];

    if (role === 'Specialist') {
      requiredFields.push('code', 'position', 'yearsOfExperience');
    }

    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!role) return;
    if (!validateForm()) return;

    try {
      const userData: Partial<User> = {
        names: formData.names,
        lastNamePaternal: formData.lastNamePaternal,
        lastNameMaternal: formData.lastNameMaternal,
        gender: formData.gender,
        birthDate: formData.birthDate,
        mobileNumber: formData.mobileNumber,
        role,
        idNumber: formData.idNumber,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        email: formData.email,
        password: formData.password,
      };

      if (role === 'Specialist') {
        userData.code = formData.code;
        userData.position = formData.position;
        userData.yearsOfExperience = formData.yearsOfExperience;
      }

      await addUser(userData);
      router.push('/dashboard/usuarios');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error adding user";
      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/usuarios');
  };

  if (!role) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
          Añadir Usuario
        </Typography>
        <RoleSelector selectedRole={role} onRoleSelect={setRole} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
        Añadir Usuario
      </Typography>
      <RoleSelector selectedRole={role} onRoleSelect={setRole} />

      <PersonalInfoForm formData={formData} handleInputChange={handleInputChange} />
      <GeneralInfoForm formData={formData} handleInputChange={handleInputChange} />
      {role === 'Administrator' ? (
        <AdministratorForm formData={formData} handleInputChange={handleInputChange} />
      ) : (
        <SpecialistForm formData={formData} handleInputChange={handleInputChange} />
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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

export default AddUser;