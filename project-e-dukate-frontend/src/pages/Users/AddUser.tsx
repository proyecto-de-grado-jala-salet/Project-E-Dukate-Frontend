"use client";

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Button } from '../../components/Button';
import { useRouter } from 'next/navigation';
import { addAdministrator, addSpecialist } from '../../services/userService';
import {
  RoleSelector,
  PersonalInfoForm,
  GeneralInfoForm,
  AdministratorForm,
  SpecialistForm,
} from '../../components/FormComponents';
import { validateAdministrator, validateSpecialist } from '../../utils/validators';
import { AdministratorDto, SpecialistDto } from '../../types/user';

interface AddUserProps {
  initialRole?: string | null;
}

export const AddUser: React.FC<AddUserProps> = ({ initialRole = null }) => {
  const router = useRouter();
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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [backendError, setBackendError] = useState<string | null>(null);

  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async () => {
    if (!role) return;

    setBackendError(null);
    setFormErrors({});

    const baseUserData = {
      names: formData.names,
      lastNamePaternal: formData.lastNamePaternal,
      lastNameMaternal: formData.lastNameMaternal || undefined,
      mobileNumber: formData.mobileNumber,
      identityCard: parseInt(formData.idNumber, 10) || 0,
      phoneNumber: formData.phoneNumber || undefined,
      age: calculateAge(formData.birthDate),
      gender: formData.gender === 'Femenino' ? 'F' : 'M',
      dateOfBirth: formData.birthDate,
      address: formData.address,
    };

    let errors: { [key: string]: string } = {};

    if (role === 'Administrator') {
      const adminData: AdministratorDto = {
        ...baseUserData,
        email: formData.email,
        password: formData.password,
      };
      errors = validateAdministrator(adminData);
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      try {
        await addAdministrator(adminData);
        router.push('/dashboard/usuarios');
      } catch (err) {
        setBackendError(err instanceof Error ? err.message : 'Error al añadir administrador');
      }
    } else if (role === 'Specialist') {
      const specialistData: SpecialistDto = {
        ...baseUserData,
        email: formData.email,
        password: formData.password,
        typeOfSpecialty: formData.position,
        yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || 0,
        specialistCode: formData.code,
      };
      errors = validateSpecialist(specialistData);
      if (Object.keys(errors).length > 0) {
        // Mapear errores a los nombres de los campos del formulario
        const mappedErrors = {
          ...errors,
          code: errors.specialistCode,
          position: errors.typeOfSpecialty,
          yearsOfExperience: errors.yearsOfExperience,
        };
        setFormErrors(mappedErrors);
        return;
      }
      try {
        await addSpecialist(specialistData);
        router.push('/dashboard/usuarios');
      } catch (err) {
        setBackendError(err instanceof Error ? err.message : 'Error al añadir especialista');
      }
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

      <PersonalInfoForm formData={formData} handleInputChange={handleInputChange} errors={formErrors} />
      <GeneralInfoForm formData={formData} handleInputChange={handleInputChange} errors={formErrors} />
      {role === 'Administrator' ? (
        <AdministratorForm formData={formData} handleInputChange={handleInputChange} errors={formErrors} />
      ) : (
        <SpecialistForm formData={formData} handleInputChange={handleInputChange} errors={formErrors} />
      )}

      {backendError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {backendError}
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