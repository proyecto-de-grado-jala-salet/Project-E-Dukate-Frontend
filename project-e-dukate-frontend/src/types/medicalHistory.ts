export enum MedicalHistoryStatus {
  ContinuaEnTratamiento = 'ContinuaEnTratamiento',
  AltaDefinitiva = 'AltaDefinitiva',
  AltaTemporal = 'AltaTemporal',
  AltaAbandono = 'AltaAbandono',
}

export interface MedicalDocumentDto {
  id: string;
  fileName: string;
  uploadDate: string;
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
  documents: MedicalDocumentDto[];
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

export interface MedicalHistoryFilterDto {
  Year?: number;
  Month?: number;
  Day?: number;
  Statuses?: string[];
}

export interface MedicalHistoryStatusMetricDto {
  status: string;
  count: number;
}

export interface MedicalHistoryMetricsDto {
  metrics: MedicalHistoryStatusMetricDto[];
  total: number;
}