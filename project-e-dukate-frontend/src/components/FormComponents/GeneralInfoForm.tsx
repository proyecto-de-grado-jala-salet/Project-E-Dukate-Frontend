import React from 'react';
import { FormSection } from './FormSection';
import { InputGroup } from './InputGroup';
import { TextField } from '../TextField';

interface GeneralInfoFormProps {
  formData: {
    idNumber: string;
    phoneNumber: string;
    address: string;
  };
  handleInputChange: (field: keyof GeneralInfoFormProps['formData']) => (value: string) => void;
}

export const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({ formData, handleInputChange }) => {
  return (
    <FormSection title="Información General">
      <InputGroup
        fields={[
          { label: 'Nro. de Cedula', value: formData.idNumber, onChange: handleInputChange('idNumber'), required: true },
          { label: 'Telefono', value: formData.phoneNumber, onChange: handleInputChange('phoneNumber') },
        ]}
      />
      <TextField
        label="Domicilio"
        value={formData.address}
        onChange={handleInputChange('address')}
        required
        sx={{ width: '100%' }}
      />
    </FormSection>
  );
};