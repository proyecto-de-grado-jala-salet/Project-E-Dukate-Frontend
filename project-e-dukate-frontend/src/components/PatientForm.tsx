// pages/patient-registration.tsx
"use client";

import React from "react";
import {
  Box,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Button,
  Paper,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import "dayjs/locale/es";

const PatientRegistration: React.FC = () => {
  const [gender, setGender] = React.useState<string>("");
  const [birthDate, setBirthDate] = React.useState<Dayjs | null>(null);

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Nombre(s) and Apellidos */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormLabel
              sx={{
                width: "150px",
              }}
            >
              Nombre Completo
            </FormLabel>
            <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
              <TextField
                label={
                  <span>
                    Nombre(s)<span style={{ color: "red" }}>*</span>
                  </span>
                }
                fullWidth
                variant="outlined"
              />
              <TextField
                label={
                  <span>
                    Apellidos<span style={{ color: "red" }}>*</span>
                  </span>
                }
                fullWidth
                variant="outlined"
              />
            </Box>
          </Box>

          {/* Género */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <FormLabel
              sx={{
                width: "150px",
                paddingTop: "8px",
              }}
            >
              Género<span style={{ color: "red" }}>*</span>
            </FormLabel>
            <RadioGroup
              name="gender"
              value={gender}
              onChange={handleGenderChange}
            >
              <FormControlLabel
                value="Femenino"
                control={<Radio />}
                label="Femenino"
              />
              <FormControlLabel
                value="Masculino"
                control={<Radio />}
                label="Masculino"
              />
            </RadioGroup>
          </Box>

          {/* Fecha de Nacimiento */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FormLabel
              sx={{
                width: "150px",
              }}
            >
              Fecha de Nacimiento<span style={{ color: "red" }}>*</span>
            </FormLabel>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="es"
            >
              <DatePicker
                value={birthDate}
                onChange={(newValue) => setBirthDate(newValue)}
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    InputProps: {
                      sx: {
                        "& .MuiInputBase-input::placeholder": {
                          color: "#757575",
                          opacity: 1,
                          fontSize: "0.875rem",
                        },
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>

          {/* No. Celular */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FormLabel
              sx={{
                width: "150px",
              }}
            >
              No. Celular<span style={{ color: "red" }}>*</span>
            </FormLabel>
            <TextField
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">+591</InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Información General */}
          <Typography
            variant="subtitle1"
            sx={{ marginTop: 2 }}
          >
            Información General
          </Typography>

          {/* Domicilio */}
          <TextField
            label={
              <span>
                Domicilio<span style={{ color: "red" }}>*</span>
              </span>
            }
            fullWidth
            variant="outlined"
          />

          {/* No. de Cédula and Teléfono */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label={
                <span>
                  No. de Cédula<span style={{ color: "red" }}>*</span>
                </span>
              }
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Teléfono"
              fullWidth
              variant="outlined"
            />
          </Box>

          {/* Guardar Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#42a5f5",
                textTransform: "none",
                borderRadius: 2,
                padding: "8px 24px",
              }}
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default PatientRegistration;