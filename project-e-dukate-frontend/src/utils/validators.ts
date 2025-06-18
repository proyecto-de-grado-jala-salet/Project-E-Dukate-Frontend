import { AdministratorDto } from '../types/user';
import { PatientDto } from '../types/user';
import { SpecialistDto } from '../types/user';

interface ValidationErrors {
  [key: string]: string;
}

export const validateAdministrator = (data: AdministratorDto): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.names) errors.names = 'Los nombres son obligatorios.';
  else if (data.names.length < 2 || data.names.length > 50)
    errors.names = 'Los nombres deben tener entre 2 y 50 caracteres.';

  if (!data.lastNamePaternal) errors.lastNamePaternal = 'El apellido paterno es obligatorio.';
  else if (data.lastNamePaternal.length < 2 || data.lastNamePaternal.length > 50)
    errors.lastNamePaternal = 'El apellido paterno debe tener entre 2 y 50 caracteres.';

  if (data.lastNameMaternal && (data.lastNameMaternal.length < 2 || data.lastNameMaternal.length > 50))
    errors.lastNameMaternal = 'El apellido materno debe tener entre 2 y 50 caracteres.';

  if (!data.mobileNumber) errors.mobileNumber = 'El número de celular es obligatorio.';
  else if (!/^[67]\d{7}$/.test(data.mobileNumber))
    errors.mobileNumber = 'El número de celular debe empezar con 6 o 7 y tener 8 dígitos.';

  if (!data.identityCard) errors.identityCard = 'La cédula de identidad es obligatoria.';
  else if (data.identityCard.toString().length < 7 || data.identityCard.toString().length > 8)
    errors.identityCard = 'La cédula de identidad debe tener entre 7 y 8 dígitos.';

  if (data.phoneNumber && !/^\d{8}$/.test(data.phoneNumber))
    errors.phoneNumber = 'El número de teléfono debe tener 8 dígitos.';

  if (!data.gender) errors.gender = 'El género es obligatorio.';
  else if (data.gender !== 'M' && data.gender !== 'F')
    errors.gender = 'El género debe ser "M" o "F".';

  if (!data.dateOfBirth) errors.dateOfBirth = 'La fecha de nacimiento es obligatoria.';
  else {
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    if (birthDate > today) errors.dateOfBirth = 'La fecha de nacimiento no puede ser futura.';
    else if (data.age && data.age > 100) errors.dateOfBirth = 'La edad no puede superar los 100 años.';
  }

  if (!data.address) errors.address = 'La dirección es obligatoria.';
  else if (data.address.length > 200) errors.address = 'La dirección no debe exceder los 200 caracteres.';

  if (!data.email) errors.email = 'El correo electrónico es obligatorio.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Formato de correo electrónico inválido.';

  if (!data.password) errors.password = 'La contraseña es obligatoria.';
  else {
    if (data.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres.';
    if (!/[a-zA-Z]/.test(data.password)) errors.password = 'La contraseña debe contener al menos una letra.';
    if (!/\d/.test(data.password)) errors.password = 'La contraseña debe contener al menos un número.';
  }

  return errors;
};

export const validateSpecialist = (data: SpecialistDto): ValidationErrors => {
  const errors = validateAdministrator(data); // Reutilizar validaciones comunes

  if (!data.specialistCode) errors.specialistCode = 'El código del especialista es obligatorio.';
  else if (data.specialistCode.length < 5 || data.specialistCode.length > 6)
    errors.specialistCode = 'El código del especialista debe tener entre 5 y 6 caracteres.';
  else if (!/^[A-Z0-9]+$/.test(data.specialistCode))
    errors.specialistCode = 'El código del especialista debe contener letras mayúsculas y números.';

  if (!data.typeOfSpecialty) errors.typeOfSpecialty = 'La especialidad es obligatoria.';
  else if (data.typeOfSpecialty.length > 100)
    errors.typeOfSpecialty = 'La especialidad no debe exceder los 100 caracteres.';

  if (data.yearsOfExperience === undefined || data.yearsOfExperience === null)
    errors.yearsOfExperience = 'Los años de experiencia son obligatorios.';
  else if (data.yearsOfExperience < 0)
    errors.yearsOfExperience = 'Los años de experiencia deben ser un número positivo.';

  return errors;
};

export const validatePatient = (data: PatientDto): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.names) errors.names = 'Los nombres son obligatorios.';
  else if (data.names.length < 2 || data.names.length > 50)
    errors.names = 'Los nombres deben tener entre 2 y 50 caracteres.';

  if (!data.lastNamePaternal) errors.lastNamePaternal = 'El apellido paterno es obligatorio.';
  else if (data.lastNamePaternal.length < 2 || data.lastNamePaternal.length > 50)
    errors.lastNamePaternal = 'El apellido paterno debe tener entre 2 y 50 caracteres.';

  if (data.lastNameMaternal && (data.lastNameMaternal.length < 2 || data.lastNameMaternal.length > 50))
    errors.lastNameMaternal = 'El apellido materno debe tener entre 2 y 50 caracteres.';

  if (!data.mobileNumber) errors.mobileNumber = 'El número de celular es obligatorio.';
  else if (!/^[67]\d{7}$/.test(data.mobileNumber))
    errors.mobileNumber = 'El número de celular debe empezar con 6 o 7 y tener 8 dígitos.';

  if (!data.identityCard) errors.identityCard = 'La cédula de identidad es obligatoria.';
  else if (data.identityCard.toString().length < 7 || data.identityCard.toString().length > 8)
    errors.identityCard = 'La cédula de identidad debe tener entre 7 y 8 dígitos.';

  if (data.phoneNumber && !/^\d{8}$/.test(data.phoneNumber))
    errors.phoneNumber = 'El número de teléfono debe tener 8 dígitos.';

  if (!data.age) errors.age = 'La edad es obligatoria.';
  else if (data.age < 0 || data.age > 100) errors.age = 'La edad debe estar entre 0 y 100 años.';

  if (!data.gender) errors.gender = 'El género es obligatorio.';
  else if (data.gender !== 'M' && data.gender !== 'F')
    errors.gender = 'El género debe ser "M" o "F".';

  if (!data.dateOfBirth) errors.dateOfBirth = 'La fecha de nacimiento es obligatoria.';
  else {
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    if (birthDate > today) errors.dateOfBirth = 'La fecha de nacimiento no puede ser futura.';
  }

  if (!data.address) errors.address = 'La dirección es obligatoria.';
  else if (data.address.length > 200) errors.address = 'La dirección no debe exceder los 200 caracteres.';

  return errors;
};