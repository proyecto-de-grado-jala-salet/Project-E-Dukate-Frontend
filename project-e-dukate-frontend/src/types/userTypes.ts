export interface BaseUser {
  id: string;
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
  email: string;
  password: string;
}

export type Administrator = BaseUser;

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Schedule {
  dayOfWeek: string;
  timeSlots: TimeSlot[];
  attends: boolean;
}

export interface Specialist extends BaseUser {
  typeOfSpecialty: string;
  yearsOfExperience: number;
  specialistCode: string;
  schedules: Schedule[];
}

export interface Patient {
  id: string;
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

export type UserRole = 'Administrator' | 'Specialist';

export type User = Administrator | Specialist;

export type FormData<T extends BaseUser> = T;

export interface SpecialistResponse extends Omit<Specialist, 'typeOfSpecialty'> {
  specialty: string;
}