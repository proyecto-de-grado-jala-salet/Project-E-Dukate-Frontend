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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PatientRegistration: React.FC = () => {
  // Estados para los valores de los campos
  const [names, setNames] = React.useState<string>(""); // Cambiado de firstName a Names
  const [lastNamePaternal, setLastNamePaternal] = React.useState<string>(""); // Separado en LastNamePaternal
  const [lastNameMaternal, setLastNameMaternal] = React.useState<string>(""); // Nuevo campo para LastNameMaternal
  const [gender, setGender] = React.useState<string>("F");
  const [dateOfBirth, setDateOfBirth] = React.useState<Dayjs | null>(null); // Cambiado de birthDate a DateOfBirth
  const [mobileNumber, setMobileNumber] = React.useState<string>(""); // Cambiado de phoneNumber a MobileNumber
  const [address, setAddress] = React.useState<string>("");
  const [identityCard, setIdentityCard] = React.useState<string>(""); // Cambiado de idNumber a IdentityCard
  const [phoneNumber, setPhoneNumber] = React.useState<string>(""); // Cambiado de secondaryPhone a PhoneNumber
  const [age, setAge] = React.useState<number | null>(null); // Nuevo campo para Age

  // Estado para los errores
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender(event.target.value === "Femenino" ? "F" : "M"); // Mapear a "M" o "F"
    if (event.target.value) {
      setErrors((prev) => ({ ...prev, gender: "" }));
    }
  };

  // Calcular edad automáticamente basada en DateOfBirth
  React.useEffect(() => {
    if (dateOfBirth) {
      const today = new Date();
      const birth = dateOfBirth.toDate();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
      ) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    }
  }, [dateOfBirth]);

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    const patientData = {
      Names: names,
      LastNamePaternal: lastNamePaternal,
      LastNameMaternal: lastNameMaternal,
      MobileNumber: mobileNumber,
      IdentityCard: identityCard,
      PhoneNumber: phoneNumber || null, // Opcional
      Age: age,
      Gender: gender,
      DateOfBirth: dateOfBirth?.toISOString().split("T")[0], // Formato YYYY-MM-DD
      Address: address,
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/Patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });
  
      if (response.ok) {
        // Mostrar notificación de éxito con React-Toastify
        toast.success("Paciente registrado con éxito", {
          position: "bottom-right", // Posición en la parte inferior
          autoClose: 3000, // Cerrar después de 3 segundos
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        setErrors({});
      } else {
        const errorData = await response.json();
  
        const newErrors: { [key: string]: string } = {};
  
        // Caso 1: Errores de validación como array directo en "errors"
        if (errorData.errors && Array.isArray(errorData.errors)) {
          errorData.errors.forEach((error: string) => {
            if (error.includes("Names")) newErrors.names = error;
            else if (error.includes("LastNamePaternal")) newErrors.lastNamePaternal = error;
            else if (error.includes("LastNameMaternal")) newErrors.lastNameMaternal = error;
            else if (error.includes("MobileNumber")) newErrors.mobileNumber = error;
            else if (error.includes("IdentityCard")) newErrors.identityCard = error;
            else if (error.includes("PhoneNumber")) newErrors.phoneNumber = error;
            else if (error.includes("Age")) newErrors.dateOfBirth = error; // Vincular a DateOfBirth
            else if (error.includes("Gender")) newErrors.gender = error;
            else if (error.includes("DateOfBirth")) newErrors.dateOfBirth = error;
            else if (error.includes("Address")) newErrors.address = error;
          });
        }
        // Caso 2: Errores de conversión como objeto en "errors"
        else if (errorData.errors && typeof errorData.errors === "object") {
          Object.keys(errorData.errors).forEach((key) => {
            const customMessage = "Ingresa el dato correcto por favor";
            if (key.includes("IdentityCard")) newErrors.identityCard = customMessage;
            else if (key.includes("Age")) newErrors.dateOfBirth = customMessage; // Vincular a DateOfBirth
            else if (key.includes("dto")) newErrors.general = customMessage;
          });
        }
  
        setErrors(newErrors);
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      // Mostrar notificación de error
      toast.error("No se pudo conectar con el servidor. Intenta de nuevo.", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <>
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
          {/* Nombre(s) y Apellidos */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormLabel sx={{ width: "150px" }}>Nombre Completo</FormLabel>
            <Box sx={{ display: "flex", gap: 2, flex: 1 }}>
              <TextField
                label={<span>Nombre(s)<span style={{ color: "red" }}>*</span></span>}
                fullWidth
                variant="outlined"
                value={names}
                onChange={(e) => setNames(e.target.value)}
                error={!!errors.names}
                helperText={errors.names}
              />
              <TextField
                label={<span>Apellido Paterno<span style={{ color: "red" }}>*</span></span>}
                fullWidth
                variant="outlined"
                value={lastNamePaternal}
                onChange={(e) => setLastNamePaternal(e.target.value)}
                error={!!errors.lastNamePaternal}
                helperText={errors.lastNamePaternal}
              />
              <TextField
                label={<span>Apellido Materno<span style={{ color: "red" }}>*</span></span>}
                fullWidth
                variant="outlined"
                value={lastNameMaternal}
                onChange={(e) => setLastNameMaternal(e.target.value)}
                error={!!errors.lastNameMaternal}
                helperText={errors.lastNameMaternal}
              />
            </Box>
          </Box>

          {/* Género */}
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <FormLabel sx={{ width: "150px", paddingTop: "8px" }}>
              Género<span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <RadioGroup name="gender" value={gender === "F" ? "Femenino" : "Masculino"} onChange={handleGenderChange}>
                <FormControlLabel value="Femenino" control={<Radio />} label="Femenino" />
                <FormControlLabel value="Masculino" control={<Radio />} label="Masculino" />
              </RadioGroup>
              {errors.gender && (
                <Typography color="error" variant="caption">
                  {errors.gender}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Fecha de Nacimiento */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FormLabel sx={{ width: "150px" }}>
              Fecha de Nacimiento<span style={{ color: "red" }}>*</span>
            </FormLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                value={dateOfBirth}
                onChange={(newValue) => setDateOfBirth(newValue)}
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

          {/* No. Celular */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FormLabel sx={{ width: "150px" }}>
              No. Celular<span style={{ color: "red" }}>*</span>
            </FormLabel>
            <TextField
              variant="outlined"
              fullWidth
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber}
              InputProps={{
                startAdornment: <InputAdornment position="start">+591</InputAdornment>,
              }}
            />
          </Box>

          {/* Información General */}
          <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
            Información General
          </Typography>

          {/* Domicilio */}
          <TextField
            label={<span>Domicilio<span style={{ color: "red" }}>*</span></span>}
            fullWidth
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
          />

          {/* No. de Cédula y Teléfono */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label={<span>No. de Cédula<span style={{ color: "red" }}>*</span></span>}
              fullWidth
              variant="outlined"
              value={identityCard}
              onChange={(e) => setIdentityCard(e.target.value)}
              error={!!errors.identityCard}
              helperText={errors.identityCard}
            />
            <TextField
              label="Teléfono"
              fullWidth
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
            />
          </Box>

          {/* Guardar Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
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
    {/* ToastContainer fuera del Box para que no se vea afectado por su posicionamiento */}
    <ToastContainer/>
</>
);
};

export default PatientRegistration;