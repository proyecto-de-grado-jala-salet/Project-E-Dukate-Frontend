import { SpecialistData } from "../types/specialist";

export const validateSpecialistData = (data: SpecialistData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  // Validaciones comunes con el paciente
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
    errors.mobileNumber = "Número de Celular debe tener 8 dígitos y empezar con 6 o 7.";

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
      errors.dateOfBirth = "La fecha de nacimiento no debe superar los 100 años de edad.";
  }

  if (!data.address) errors.address = "La Dirección es obligatoria.";
  else if (data.address.length > 200)
    errors.address = "La dirección no debe exceder los 200 caracteres.";

  // Validaciones específicas del especialista
  if (!data.email) errors.email = "Se requiere correo electrónico.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Formato de correo electrónico no válido.";

  if (!data.password) errors.password = "Se requiere contraseña.";
  else {
    if (data.password.length < 8)
      errors.password = "La contraseña debe tener al menos 8 caracteres.";
    if (!/[a-zA-Z]/.test(data.password))
      errors.password = "La contraseña debe contener al menos una letra.";
    if (!/\d/.test(data.password))
      errors.password = "La contraseña debe contener al menos un número.";
  }

  if (!data.accessCode) errors.accessCode = "Código de acceso no válido para el especialista.";
  else if (data.accessCode !== "456")
    errors.accessCode = "Código de acceso no válido para el especialista.";

  if (!data.specialistCode) errors.specialistCode = "El código del Especialista es requerido.";
  else {
    if (data.specialistCode.length < 5 || data.specialistCode.length > 6)
      errors.specialistCode = "Debe de tener entre 5 a 6 caracteres.";
    if (!/^[A-Z0-9]+$/.test(data.specialistCode))
      errors.specialistCode = "Debe de tener letras mayúsculas y números.";
  }

  if (!data.specialty) errors.specialty = "La especialidad es obligatoria.";
  else if (data.specialty.length > 100)
    errors.specialty = "La especialidad no debe exceder los 100 caracteres.";

  if (!data.yearsOfExperience) errors.yearsOfExperience = "Los años de experiencia son obligatorios.";
  else if (!/^\d+$/.test(data.yearsOfExperience) || parseInt(data.yearsOfExperience) < 0)
    errors.yearsOfExperience = "Los años de experiencia deben ser un número positivo.";

  return errors;
};