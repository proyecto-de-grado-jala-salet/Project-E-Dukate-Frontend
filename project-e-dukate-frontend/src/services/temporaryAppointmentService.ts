/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiRequest } from './api';

export interface CreateTemporaryAppointmentRequestDto {
  whatsAppNumber: string;
  appointmentData: any;
}

export interface TemporaryAppointmentResponseDto {
  id: string;
  whatsAppNumber: string;
  appointmentData: any;
  comprobanteUrl?: string;
  comprobanteFileName?: string;
  createdAt: string;
  expiresAt: string;
  isProcessed: boolean;
  status: string;
  paymentUploadedAt?: string;
  processedAt?: string;
}

export const temporaryAppointmentService = {
  createTemporaryAppointment: async (request: CreateTemporaryAppointmentRequestDto): Promise<string> => {
    const response = await apiRequest<{ id: string; message: string }>(
      'temporaryAppointments',
      'POST',
      request
    );
    return response.id;
  },

  getTemporaryAppointment: async (id: string): Promise<TemporaryAppointmentResponseDto> => {
    return await apiRequest<TemporaryAppointmentResponseDto>(
      'temporaryAppointments',
      'GET',
      undefined,
      id
    );
  },
  
  uploadComprobante: async (temporaryAppointmentId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('comprobante', file);
    formData.append('temporaryAppointmentId', temporaryAppointmentId);

    await apiRequest<{ message: string }>(
      'uploadComprobante',
      'POST',
      formData
    );
  },
};