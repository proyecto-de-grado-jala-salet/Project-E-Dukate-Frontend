import React from 'react';
import { FormSection } from './FormSection';
import { InputGroup } from './InputGroup';
import { Dropdown } from '../Dropdown';
import { useSpecialties } from '../../hooks/useSpecialties';
import { CircularProgress, Box } from '@mui/material';

interface SpecialistFormProps {
  formData: {
    code: string;
    position: string;
    yearsOfExperience: string;
    email: string;
    password: string;
  };
  handleInputChange: (field: keyof SpecialistFormProps['formData']) => (value: string) => void;
}

export const SpecialistForm: React.FC<SpecialistFormProps> = ({ formData, handleInputChange }) => {
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

  return (
    <FormSection title="Información Especialista">
      <InputGroup
        fields={[
          { label: 'Codigo', value: formData.code, onChange: handleInputChange('code'), required: true },
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
                error={error || (loading ? 'Loading specialties...' : undefined)}
              />
            ),
          },
          {
            label: 'Año de Experiencia',
            value: formData.yearsOfExperience,
            onChange: handleInputChange('yearsOfExperience'),
            required: true,
          },
        ]}
      />
      <InputGroup
        fields={[
          { label: 'Email', value: formData.email, onChange: handleInputChange('email'), required: true },
          { label: 'Contraseña', value: formData.password, onChange: handleInputChange('password'), required: true },
        ]}
      />
    </FormSection>
  );
};