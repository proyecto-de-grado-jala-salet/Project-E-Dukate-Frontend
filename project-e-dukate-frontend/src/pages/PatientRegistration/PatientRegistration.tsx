"use client";

import React from "react";
import { Box, Typography, Paper, FormLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/es";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomTextField } from "../../components/common/TextField";
import { CustomRadioGroup } from "../../components/common/RadioGroup";
import { CustomButton } from "../../components/common/Button";
import { usePatientForm } from "../../hooks/usePatientForm";

const PatientRegistration: React.FC = () => {
  const { formData, errors, handleChange, handleGenderChange, handleDateChange, handleSubmit } = usePatientForm();

  return (
    <>
      <Box
        sx={{
            minHeight: "98vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            borderRadius: 2,
            width: "100%",
            maxWidth: 900,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: 3,
                borderBottom: "3px solid rgba(150, 150, 150, 0.1)",
                paddingBottom: 1,
              }}
          >
            Registro de Paciente
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FormLabel sx={{ width: "150px" }}>Nombre Completo</FormLabel>
              <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
                <CustomTextField
                  label="Nombre(s)"
                  value={formData.names}
                  onChange={(value) => handleChange("names", value)}
                  error={errors.names}
                  required
                />
                <CustomTextField
                  label="Apellido Paterno"
                  value={formData.lastNamePaternal}
                  onChange={(value) => handleChange("lastNamePaternal", value)}
                  error={errors.lastNamePaternal}
                  required
                />
                <CustomTextField
                  label="Apellido Materno"
                  value={formData.lastNameMaternal}
                  onChange={(value) => handleChange("lastNameMaternal", value)}
                  error={errors.lastNameMaternal}
                  required
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <FormLabel sx={{ width: "150px", paddingTop: "8px" }}>
                Género<span style={{ color: "red" }}>*</span>
              </FormLabel>
              <CustomRadioGroup
                value={formData.gender === "F" ? "Femenino" : "Masculino"}
                onChange={handleGenderChange}
                options={[
                  { value: "Femenino", label: "Femenino" },
                  { value: "Masculino", label: "Masculino" },
                ]}
                error={errors.gender}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
              <FormLabel sx={{ width: "150px" }}>
                Fecha de Nacimiento<span style={{ color: "red" }}>*</span>
              </FormLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                <DatePicker
                  value={formData.dateOfBirth}
                  onChange={handleDateChange}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      error: !!errors.dateOfBirth,
                      helperText: errors.dateOfBirth,
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FormLabel sx={{ width: "150px" }}>
                No. Celular<span style={{ color: "red" }}>*</span>
              </FormLabel>
              <CustomTextField
                label="No. Celular"
                value={formData.mobileNumber}
                onChange={(value) => handleChange("mobileNumber", value)}
                error={errors.mobileNumber}
                required
                adornment="+591"
              />
            </Box>

            <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
              Información General
            </Typography>

            <CustomTextField
              label="Domicilio"
              value={formData.address}
              onChange={(value) => handleChange("address", value)}
              error={errors.address}
              required
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <CustomTextField
                label="No. de Cédula"
                value={formData.identityCard}
                onChange={(value) => handleChange("identityCard", value)}
                error={errors.identityCard}
                required
              />
              <CustomTextField
                label="Teléfono"
                value={formData.phoneNumber}
                onChange={(value) => handleChange("phoneNumber", value)}
                error={errors.phoneNumber}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <CustomButton
                label="Guardar"
                onClick={handleSubmit}
              />
            </Box>
          </Box>
        </Paper>
      </Box>
      <ToastContainer />
    </>
  );
};

export default PatientRegistration;