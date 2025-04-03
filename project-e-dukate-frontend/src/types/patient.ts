import { Dayjs } from "dayjs";

export interface PatientData {
  names: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  gender: string;
  dateOfBirth: Dayjs | null;
  mobileNumber: string;
  address: string;
  identityCard: string;
  phoneNumber: string;
  age: number | null;
}

export interface PatientDataForBackend {
  names: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  gender: string;
  dateOfBirth: string | null;
  mobileNumber: string;
  address: string;
  identityCard: number;
  phoneNumber: string;
  age: number | null;
}