"use client";

import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/Button';
import { useRouter } from 'next/navigation';
import { addSpecialist } from '@/services/userService';
import { addAdministrator } from '@/services/userService';
import { validateAdministrator } from '@/utils/validators';
import { validateSpecialist } from '@/utils/validators';
import { SpecialistDto } from '@/types/user';
import { AdministratorDto } from '@/types/user';
import dynamic from 'next/dynamic';
import CircularProgress from '@mui/material/CircularProgress';
import ECGLoader from '@/components/Loader/ECGLoader';

const RoleSelector = dynamic(() => 
  import('@/components/FormComponents/RoleSelector').then(mod => mod.RoleSelector), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

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

const AdministratorForm = dynamic(() => 
  import('@/components/FormComponents/AdministratorForm').then(mod => mod.AdministratorForm), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

const SpecialistForm = dynamic(() => 
  import('@/components/FormComponents/SpecialistForm').then(mod => mod.SpecialistForm), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleInputChange = useCallback((field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  }, []);

  const calculateAge = useCallback((birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!role) return;

    setBackendError(null);
    setFormErrors({});
    setIsSubmitting(true);

    try {
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
        await addAdministrator(adminData);
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
          const mappedErrors = {
            ...errors,
            code: errors.specialistCode,
            position: errors.typeOfSpecialty,
            yearsOfExperience: errors.yearsOfExperience,
          };
          setFormErrors(mappedErrors);
          return;
        }
        await addSpecialist(specialistData);
      }
      
      setIsNavigating(true);
      router.push('/dashboard/usuarios');
    } catch (err) {
      setBackendError(err instanceof Error ? err.message : 'Error al añadir usuario');
    } finally {
      setIsSubmitting(false);
    }
  }, [role, formData, calculateAge, router]);

  const handleCancel = useCallback(() => {
    setIsNavigating(true);
    router.push('/dashboard/usuarios');
  }, [router]);

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
    <>
      {isNavigating && <ECGLoader message="Volviendo a usuarios" />}
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
          <Button 
            label="Cancelar" 
            variant="outlined" 
            onClick={handleCancel} 
            color="error"
            disabled={isSubmitting}
          />
          <Button
            label={isSubmitting ? "Guardando..." : "Guardar"}
            variant="contained"
            sx={{ bgcolor: '#f5a623', color: 'black' }}
            onClick={handleSubmit}
            disabled={isSubmitting}
          />
        </Box>
      </Box>
    </>
  );
};

export default AddUser;