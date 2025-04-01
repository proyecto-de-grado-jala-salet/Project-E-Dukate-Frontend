export interface PatientFormData {
    firstName: string;
    lastName: string;
    gender: 'Femenino' | 'Masculino' | '';
    birthDate: Date | null;
    phone: string;
    address: string;
    idNumber: string;
    phoneSecondary?: string;
  }