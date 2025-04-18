import React from 'react';
import { FormSection } from './FormSection';
import { InputGroup } from './InputGroup';

interface AdministratorFormProps {
  formData: {
    email: string;
    password: string;
  };
  handleInputChange: (field: keyof AdministratorFormProps['formData']) => (value: string) => void;
  errors?: { [key: string]: string }; // Nueva prop para errores
}

export const AdministratorForm: React.FC<AdministratorFormProps> = ({ formData, handleInputChange, errors = {} }) => {
  return (
    <FormSection title="Información Administrador">
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
            showToggle: true, // Activar el "ojito"
            error: !!errors.password,
            helperText: errors.password,
          },
        ]}
      />
    </FormSection>
  );
};