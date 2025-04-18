import React from 'react';
import { FormSection } from './FormSection';
import { InputGroup } from './InputGroup';

interface AdministratorFormProps {
  formData: {
    email: string;
    password: string;
  };
  handleInputChange: (field: keyof AdministratorFormProps['formData']) => (value: string) => void;
}

export const AdministratorForm: React.FC<AdministratorFormProps> = ({ formData, handleInputChange }) => {
  return (
    <FormSection title="Información Administrador">
      <InputGroup
        fields={[
          { label: 'Email', value: formData.email, onChange: handleInputChange('email'), required: true },
          {
            label: 'Contraseña',
            value: formData.password,
            onChange: handleInputChange('password'),
            required: true,
          },
        ]}
      />
    </FormSection>
  );
};