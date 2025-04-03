import { PatientData } from "../types/patient";

export const validatePatientData = (data: PatientData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!data.names) errors.names = "Nombres obligatorios.";
  else if (data.names.length < 2 || data.names.length > 50)
    errors.names = "Los nombres deben tener entre 2 y 50 caracteres.";

  if (!data.lastNamePaternal) errors.lastNamePaternal = "Apellido Paterno es obligatorio.";
  else if (data.lastNamePaternal.length < 2 || data.lastNamePaternal.length > 50)
    errors.lastNamePaternal = "Apellido Paterno debe tener entre 2 y 50 caracteres.";

  if (!data.lastNameMaternal) errors.lastNameMaternal = "Apellido Materno es obligatorio.";
  else if (data.lastNameMaternal.length < 2 || data.lastNameMaternal.length > 50)
    errors.lastNameMaternal = "Apellido Materno debe tener entre 2 y 50 caracteres.";

  if (!data.mobileNumber) errors.mobileNumber = "Número de Celular es obligatorio.";
  else if (!/^[6-7]\d{7}$/.test(data.mobileNumber))
    errors.mobileNumber =
      "Número de Celular debe tener 8 dígitos y empezar con 6 o 7.";

  if (!data.identityCard) errors.identityCard = "La Cédula de Identidad es obligatoria.";
  else if (!/^\d+$/.test(data.identityCard))
    errors.identityCard = "La Cédula de Identidad debe ser un número positivo.";
  else if (data.identityCard.length < 7 || data.identityCard.length > 8)
    errors.identityCard = "La Cédula de Identidad debe tener entre 7 y 8 dígitos.";

  if (data.phoneNumber && !/^\d{8}$/.test(data.phoneNumber))
    errors.phoneNumber = "Número de Teléfono debe tener 8 dígitos.";

  if (!data.gender) errors.gender = "El género es obligatorio.";
  else if (data.gender !== "M" && data.gender !== "F")
    errors.gender = "El género debe ser 'Masculino' o 'Femenino'.";

  if (!data.dateOfBirth) errors.dateOfBirth = "La Fecha de Nacimiento es obligatoria.";
  else {
    const today = new Date();
    const birthDate = data.dateOfBirth.toDate();
    if (birthDate > today)
      errors.dateOfBirth = "La Fecha de Nacimiento no debe pasarse de la fecha actual.";
    else if (data.age && data.age > 100)
      errors.dateOfBirth =
        "La fecha de nacimiento no debe superar los 100 años de edad a partir de la fecha actual.";
  }

  if (!data.address) errors.address = "La Dirección es obligatoria.";
  else if (data.address.length > 200)
    errors.address = "La dirección no debe exceder los 200 caracteres.";

  return errors;
};