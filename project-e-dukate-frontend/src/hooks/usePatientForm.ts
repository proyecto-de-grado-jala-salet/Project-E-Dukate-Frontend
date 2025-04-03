import { useState } from "react";
import { Dayjs } from "dayjs";
import { PatientData } from "../types/patient";
import { validatePatientData } from "../utils/validatePatientData";
import { registerPatient } from "../services/patientService";
import { showSuccessNotification, showErrorNotification } from "../services/notificationService";

export const usePatientForm = () => {
  const [formData, setFormData] = useState<PatientData>({
    names: "",
    lastNamePaternal: "",
    lastNameMaternal: "",
    gender: "F",
    dateOfBirth: null,
    mobileNumber: "",
    address: "",
    identityCard: "",
    phoneNumber: "",
    age: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: keyof PatientData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleGenderChange = (value: string) => {
    const genderValue = value === "Femenino" ? "F" : "M";
    setFormData((prev) => ({ ...prev, gender: genderValue }));
    setErrors((prev) => ({ ...prev, gender: "" }));
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: newValue }));
    if (newValue) {
      const today = new Date();
      const birth = newValue.toDate();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
      ) {
        calculatedAge--;
      }
      setFormData((prev) => ({ ...prev, age: calculatedAge }));
    }
    setErrors((prev) => ({ ...prev, dateOfBirth: "" }));
  };

  const handleSubmit = async () => {
    const validationErrors = validatePatientData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Transformar formData para el backend
    const transformedData = {
      ...formData,
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.format("YYYY-MM-DD") : null,
      identityCard: parseInt(formData.identityCard, 10), // Convertir identityCard a número
    };

    console.log("Datos enviados al backend:", transformedData); // Para depurar

    try {
      await registerPatient(transformedData);
      showSuccessNotification("Paciente registrado con éxito");
      setErrors({});
      setFormData({
        names: "",
        lastNamePaternal: "",
        lastNameMaternal: "",
        gender: "F",
        dateOfBirth: null,
        mobileNumber: "",
        address: "",
        identityCard: "",
        phoneNumber: "",
        age: null,
      });
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      showErrorNotification("No se pudo conectar con el servidor. Intenta de nuevo.");
    }
  };

  return { formData, errors, handleChange, handleGenderChange, handleDateChange, handleSubmit };
};