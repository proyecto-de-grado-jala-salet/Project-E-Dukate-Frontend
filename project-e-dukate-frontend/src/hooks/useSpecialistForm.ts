/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Dayjs } from "dayjs";
import { SpecialistData } from "../types/specialist";
import { validateSpecialistData } from "../utils/validateSpecialistData";
import { registerSpecialist } from "../services/specialistService";
import { showSuccessNotification, showErrorNotification } from "../services/notificationService";

export const useSpecialistForm = () => {
  const [formData, setFormData] = useState<SpecialistData>({
    names: "",
    lastNamePaternal: "",
    lastNameMaternal: "",
    gender: "F",
    dateOfBirth: null,
    mobileNumber: "",
    specialty: "",
    yearsOfExperience: "",
    email: "",
    password: "",
    accessCode: "",
    specialistCode: "", // Nuevo campo para el código del especialista
    address: "",
    identityCard: "",
    phoneNumber: "",
    age: null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: keyof SpecialistData, value: string) => {
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
    const validationErrors = validateSpecialistData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const transformedData = {
      names: formData.names,
      lastNamePaternal: formData.lastNamePaternal,
      lastNameMaternal: formData.lastNameMaternal,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.format("YYYY-MM-DD") : null,
      mobileNumber: formData.mobileNumber,
      specialty: formData.specialty,
      yearsOfExperience: parseInt(formData.yearsOfExperience, 10),
      email: formData.email,
      password: formData.password,
      specialistCode: formData.specialistCode, // Usamos el valor ingresado por el usuario
      accessCode: formData.accessCode, // Mantenemos el accessCode como está
      address: formData.address,
      identityCard: parseInt(formData.identityCard, 10),
      phoneNumber: formData.phoneNumber,
      age: formData.age,
    };

    try {
      await registerSpecialist(transformedData);
      showSuccessNotification("Especialista registrado con éxito");
      setErrors({});
      setFormData({
        names: "",
        lastNamePaternal: "",
        lastNameMaternal: "",
        gender: "F",
        dateOfBirth: null,
        mobileNumber: "",
        specialty: "",
        yearsOfExperience: "",
        email: "",
        password: "",
        accessCode: "",
        specialistCode: "", // Reiniciamos el nuevo campo
        address: "",
        identityCard: "",
        phoneNumber: "",
        age: null,
      });
    } catch (error) { // eslint-disable-next-line @typescript-eslint/no-unused-vars
      showErrorNotification("No se pudo conectar con el servidor. Intenta de nuevo.");
    }
  };

  return { formData, errors, handleChange, handleGenderChange, handleDateChange, handleSubmit };
};