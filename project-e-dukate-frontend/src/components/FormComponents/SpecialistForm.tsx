import React from 'react';
import { FormSection } from './FormSection';
import { InputGroup } from './InputGroup';
import { Dropdown } from '../Dropdown';
import { useSpecialties } from '../../hooks/useSpecialties';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

interface SpecialistFormProps {
  formData: {
    code: string;
    position: string;
    yearsOfExperience: string;
    email: string;
    password: string;
  };
  handleInputChange: (field: keyof SpecialistFormProps['formData']) => (value: string) => void;
  errors?: { [key: string]: string };
}

export const SpecialistForm: React.FC<SpecialistFormProps> = ({ formData, handleInputChange, errors = {} }) => {
  const { specialties, loading, error } = useSpecialties();

  const specialtyOptions = specialties.map((specialty) => ({
    value: specialty.typeOfSpecialty,
    label: specialty.typeOfSpecialty,
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 2 }}>
        <Typography color="error">Error al cargar especialidades: {error}</Typography>
      </Box>
    );
  }

  return (
    <FormSection title="Información Especialista">
      <InputGroup
        fields={[
          {
            label: 'Código',
            value: formData.code,
            onChange: handleInputChange('code'),
            required: true,
            error: !!errors.specialistCode,
            helperText: errors.specialistCode,
          },
          {
            label: 'Cargo',
            value: formData.position,
            onChange: handleInputChange('position'),
            required: true,
            render: () => (
              <Dropdown
                label="Cargo"
                value={formData.position}
                onChange={handleInputChange('position')}
                options={specialtyOptions}
                required
                error={!!errors.typeOfSpecialty}
                helperText={errors.typeOfSpecialty || (specialtyOptions.length === 0 ? 'No hay especialidades disponibles' : '')}
                sx={{ flex: 1 }}
              />
            ),
          },
          {
            label: 'Años de Experiencia',
            value: formData.yearsOfExperience,
            onChange: handleInputChange('yearsOfExperience'),
            required: true,
            type: 'number',
            error: !!errors.yearsOfExperience,
            helperText: errors.yearsOfExperience,
          },
        ]}
      />
      <InputGroup
        fields={[
          {
            label: 'Email',
            value: formData.email,
            onChange: handleInputChange('email'),
            required: true,
            error: !!errors.email,
            helperText: errors.email,
          },
          {
            label: 'Contraseña',
            value: formData.password,
            onChange: handleInputChange('password'),
            required: true,
            type: 'password',
            showToggle: true,
            error: !!errors.password,
            helperText: errors.password,
          },
        ]}
      />
    </FormSection>
  );
};