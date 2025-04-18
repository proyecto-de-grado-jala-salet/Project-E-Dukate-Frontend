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
  errors?: { [key: string]: string };
}

export const GeneralInfoForm: React.FC<GeneralInfoFormProps> = ({ formData, handleInputChange, errors = {} }) => {
  return (
    <FormSection title="Información General">
      <InputGroup
        fields={[
          {
            label: "Nro. de Cédula",
            value: formData.idNumber,
            onChange: handleInputChange("idNumber"),
            required: true,
            error: !!errors.identityCard,
            helperText: errors.identityCard,
          },
          {
            label: "Teléfono",
            value: formData.phoneNumber,
            onChange: handleInputChange("phoneNumber"),
            error: !!errors.phoneNumber,
            helperText: errors.phoneNumber,
          },
        ]}
      />
      <TextField
        label="Domicilio"
        value={formData.address}
        onChange={handleInputChange('address')}
        required
        sx={{ width: '100%' }}
        error={!!errors.address}
        helperText={errors.address}
      />
    </FormSection>
  );
};