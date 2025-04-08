import { Dayjs } from "dayjs";

export interface SpecialistData {
  names: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  gender: string;
  dateOfBirth: Dayjs | null;
  mobileNumber: string;
  specialty: string;
  yearsOfExperience: string;
  email: string;
  password: string;
  accessCode: string;
  specialistCode: string; // Nuevo campo para el código del especialista
  address: string;
  identityCard: string;
  phoneNumber: string;
  age: number | null;
}

export interface SpecialistDataForBackend {
  names: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  gender: string;
  dateOfBirth: string | null;
  mobileNumber: string;
  specialty: string;
  yearsOfExperience: number;
  email: string;
  password: string;
  accessCode: string;
  specialistCode: string; // Nuevo campo para el código del especialista
  address: string;
  identityCard: number;
  phoneNumber: string;
  age: number | null;
}