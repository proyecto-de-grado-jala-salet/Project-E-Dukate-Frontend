export enum MedicalHistoryStatus {
  ContinuaEnTratamiento = 'ContinuaEnTratamiento',
  AltaDefinitiva = 'AltaDefinitiva',
  AltaTemporal = 'AltaTemporal',
  AltaAbandono = 'AltaAbandono',
}

export interface MedicalConsultationDto {
  id: string;
  specialistId: string;
  reason: string;
  consultationDate: string;
  notes: string;
}

export interface MedicalHistoryPermissionDto {
  id: string;
  specialistId: string;
  canEdit: boolean;
  status: MedicalHistoryStatus;
  consultations: MedicalConsultationDto[];
}

export interface MedicalHistoryDto {
  id: string;
  patientId: string;
  permissions: MedicalHistoryPermissionDto[];
}

export interface PermissionRequestDto {
  medicalHistoryId: string;
  specialistId: string;
  canEdit: boolean;
}

export interface UpdateMedicalHistoryStatusDto {
  Status: MedicalHistoryStatus;
}

export interface UpdateMedicalConsultationDto {
  reason: string;
  consultationDate: string;
  notes: string;
}