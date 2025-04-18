/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface BaseUserDto {
  names: string;
  lastNamePaternal: string;
  lastNameMaternal?: string;
  mobileNumber: string;
  identityCard: number;
  phoneNumber?: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  address: string;
}

export interface AdministratorDto extends BaseUserDto {
  email: string;
  password: string;
}

export interface SpecialistDto extends BaseUserDto {
  email: string;
  password: string;
  typeOfSpecialty: string;
  yearsOfExperience: number;
  specialistCode: string;
}

export interface PatientDto extends BaseUserDto {}