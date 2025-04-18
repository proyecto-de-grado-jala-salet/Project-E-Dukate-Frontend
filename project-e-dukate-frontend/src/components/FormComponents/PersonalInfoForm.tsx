import React from 'react';
import { Box, Typography } from '@mui/material';
import { FormSection } from './FormSection';
import { InputGroup } from './InputGroup';
import { RadioButtonGroup } from '../RadioButtonGroup';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

interface PersonalInfoFormProps {
  formData: {
    names: string;
    lastNamePaternal: string;
    lastNameMaternal: string;
    gender: 'Femenino' | 'Masculino';
    birthDate: string;
    mobileNumber: string;
  };
  handleInputChange: (field: keyof PersonalInfoFormProps['formData']) => (value: string) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, handleInputChange }) => {

  const birthDateValue = formData.birthDate ? dayjs(formData.birthDate, 'YYYY-MM-DD') : null;

  const handleDateChange = (newValue: dayjs.Dayjs | null) => {
    const formattedDate = newValue ? newValue.format('YYYY-MM-DD') : '';
    handleInputChange('birthDate')(formattedDate);
  };

  return (
    <FormSection title="Personal Information">
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box sx={{ width: "150px" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Nombre Completo
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <InputGroup
            fields={[
              {
                label: "Nombre(s)",
                value: formData.names,
                onChange: handleInputChange("names"),
                required: true,
              },
              {
                label: "Apellido Paterno",
                value: formData.lastNamePaternal,
                onChange: handleInputChange("lastNamePaternal"),
                required: true,
              },
              {
                label: "Apellido Materno",
                value: formData.lastNameMaternal,
                onChange: handleInputChange("lastNameMaternal"),
              },
            ]}
          />
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
        <Box sx={{ width: "150px" }}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Género
            <span style={{ color: "red" }}> *</span>
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <RadioButtonGroup
            label=""
            value={formData.gender}
            onChange={handleInputChange("gender")}
            options={[
              { value: "Femenino", label: "Femenino" },
              { value: "Masculino", label: "Masculino" },
            ]}
            orientation="vertical"
          />
        </Box>
      </Box>
      <InputGroup
        fields={[
          {
            label: "",
            value: formData.birthDate,
            onChange: handleInputChange("birthDate"),

            render: () => (
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="es"
              >
                <DatePicker
                  value={birthDateValue}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      label: (
                        <Typography variant="body1">
                          Fecha de Nacimiento
                          <span style={{ color: "red" }}> *</span>
                        </Typography>
                      ),
                    },
                  }}
                />
              </LocalizationProvider>
            ),
            required: true,
          },
          {
            label: "Nro. Celular",
            value: formData.mobileNumber,
            onChange: handleInputChange("mobileNumber"),
            required: true,
          },
        ]}
      />
    </FormSection>
  );
};