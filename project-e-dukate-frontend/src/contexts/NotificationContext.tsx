/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from '@/services/api';
import { usePathname } from 'next/navigation';
import { createAppointment, CreateAppointmentPayload } from '@/services/appointmentService';
import { translateDayToEnglish } from '@/utils/dayTranslations';

export interface PaymentNotification {
  id: string;
  whatsAppNumber: string;
  appointmentData: any;
  comprobanteUrl: string | null;
  comprobanteFileName: string | null;
  createdAt: string;
  expiresAt: string;
  isProcessed: boolean;
  status: string;
  paymentUploadedAt: string | null;
  processedAt: string | null;
  read?: boolean;
}

interface NotificationContextType {
  notifications: PaymentNotification[];
  unreadCount: number;
  socket: null;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  updateNotificationStatus: (notificationId: string, status: 'approved' | 'rejected', rejectionReason?: string) => void;
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  lastUpdate: Date | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<PaymentNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const pathname = usePathname();

  const isInDashboard = pathname?.includes('/dashboard') || false;

  // ------------------------------------------------------------
  // Función para crear el payload de creación de cita (al aprobar)
  // ------------------------------------------------------------
  const createAppointmentPayload = (notification: PaymentNotification): CreateAppointmentPayload | null => {
    try {
      const data = typeof notification.appointmentData === 'string' ? JSON.parse(notification.appointmentData) : notification.appointmentData;
      const patient = data.patient || {};
      const specialty = data.specialty || {};
      const specialist = data.specialist || {};
      const selectedSlots = data.selectedSlots || [];
      const consultationsNumber = data.consultationsNumber || 0;
      const totalCost = data.totalCost || 0;

      if (!patient.Id && !patient.id) {
        console.error('❌ Patient ID not found in appointment data');
        return null;
      }
      if (!specialty.Id && !specialty.id) {
        console.error('❌ Specialty ID not found in appointment data');
        return null;
      }
      if (!specialist.Id && !specialist.id) {
        console.error('❌ Specialist ID not found in appointment data');
        return null;
      }

      const sessionCost = consultationsNumber > 0 ? totalCost / consultationsNumber : 65;

      const scheduledSessions = selectedSlots.map((slot: any) => {
        const dayInSpanish = slot.dayOfWeek;
        const dayInEnglish = translateDayToEnglish(dayInSpanish);
        return {
          timeSlotId: slot.timeSlotId,
          dayOfWeek: dayInEnglish,
          startTime: slot.startTime?.slice(0, 5) || 'N/A',
          endTime: slot.endTime?.slice(0, 5) || 'N/A',
          status: 'Scheduled',
        };
      });

      const payload: CreateAppointmentPayload = {
        patientId: patient.Id || patient.id,
        specialtyId: specialty.Id || specialty.id,
        specialistId: specialist.Id || specialist.id,
        sessionCount: consultationsNumber,
        sessionCost: sessionCost,
        scheduledSessions: scheduledSessions,
      };
      return payload;
    } catch (error) {
      console.error('❌ Error creating appointment payload:', error);
      return null;
    }
  };

  // ------------------------------------------------------------
  // Notificaciones al chatbot (aprobación)
  // ------------------------------------------------------------
  const notifyChatbotAboutApproval = async (notification: PaymentNotification, patientPhone: string) => {
    try {
      const patientInfo = getPatientInfoFromNotification(notification);
      const notificationData = {
        phone: patientPhone,
        message:
          `🎉 *¡BUENAS NOTICIAS Tu cita ha sido aprobada!*\n\n` +
          `📋 *Detalles de tu terapia:*\n` +
          `*Paciente:* ${patientInfo.patientName} ${patientInfo.patientLastName}\n` +
          `*Especialidad:* ${patientInfo.specialty}\n` +
          `*Especialista:* ${patientInfo.specialistName}\n` +
          `*N° de sesiones:* ${patientInfo.consultationsNumber}\n` +
          `*Fechas programadas:*\n${patientInfo.formattedDates.map((date: any) => `• ${date.display}`).join('\n')}\n\n` +
          `💡 *Recordatorio importante:*\n` +
          `Te enviaremos un recordatorio 24 horas antes de cada sesión para que no se te olvide.\n` +
          `También puedes cancelar o reprogramar tus sesiones, solo comunícate con nosotros.\n\n` +
          `¡Te esperamos! 🎉`,
        notificationId: notification.id,
        type: 'appointment_approved',
      };
      await fetch('http://localhost:3003/api/notify-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData),
      });
      console.log('✅ Notificación de aprobación enviada al chatbot');
    } catch (error) {
      console.error('❌ Error enviando notificación al chatbot:', error);
    }
  };

  // ------------------------------------------------------------
  // Notificaciones al chatbot (rechazo con motivo)
  // ------------------------------------------------------------
  const notifyChatbotAboutRejection = async (
    notification: PaymentNotification,
    patientPhone: string,
    rejectionReason: string
  ) => {
    try {
      const patientInfo = getPatientInfoFromNotification(notification);
      const notificationData = {
        phone: patientPhone,
        message:
          `❌ *LO SENTIMOS - Tu solicitud de cita ha sido rechazada*\n\n` +
          `📋 *Detalles de la solicitud rechazada:*\n` +
          `*Paciente:* ${patientInfo.patientName} ${patientInfo.patientLastName}\n` +
          `*Especialidad:* ${patientInfo.specialty}\n` +
          `*Especialista:* ${patientInfo.specialistName}\n` +
          `*N° de sesiones:* ${patientInfo.consultationsNumber}\n\n` +
          `⚠️ *Razón del rechazo:*\n${rejectionReason}\n\n` +
          `🔄 Por favor, vuelve a intentarlo.\n` +
          `Si necesitas ayuda, contáctanos directamente.`,
        notificationId: notification.id,
        type: 'appointment_rejected',
      };
      await fetch('http://localhost:3003/api/notify-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData),
      });
      console.log('✅ Notificación de rechazo enviada al chatbot');
    } catch (error) {
      console.error('❌ Error enviando notificación de rechazo:', error);
    }
  };

  // ------------------------------------------------------------
  // Helper para extraer información del paciente desde appointmentData
  // ------------------------------------------------------------
  const getPatientInfoFromNotification = (notification: PaymentNotification) => {
    try {
      const data = typeof notification.appointmentData === 'string' ? JSON.parse(notification.appointmentData) : notification.appointmentData;
      const patient = data.patient || {};
      const specialty = data.specialty || {};
      const specialist = data.specialist || {};
      const selectedSlots = data.selectedSlots || [];
      const previewDates = data.previewDates || [];

      const formattedDates = previewDates.map((date: any, index: number) => {
        const slot = selectedSlots[index] || selectedSlots[0] || {};
        const dateObj = new Date(date.start);
        return {
          display: `${dateObj.toLocaleDateString('es-ES')} de ${slot.startTime?.slice(0, 5) || 'N/A'} a ${slot.endTime?.slice(0, 5) || 'N/A'}`,
        };
      });

      return {
        patientName: patient.Names || patient.names || 'N/A',
        patientLastName: patient.LastNamePaternal || patient.lastNamePaternal || '',
        specialty: specialty.TypeOfSpecialty || specialty.typeOfSpecialty || 'N/A',
        specialistName: `${specialist.Names || specialist.names || ''} ${specialist.LastNamePaternal || specialist.lastNamePaternal || ''}`.trim(),
        consultationsNumber: data.consultationsNumber || 0,
        formattedDates,
      };
    } catch (error) {
      console.error('❌ Error parsing notification data:', error);
      return {
        patientName: 'N/A',
        patientLastName: '',
        specialty: 'N/A',
        specialistName: 'N/A',
        consultationsNumber: 0,
        formattedDates: [],
      };
    }
  };

  // ------------------------------------------------------------
  // Obtener TODAS las notificaciones (sin filtrar por estado)
  // ------------------------------------------------------------
  const fetchNotifications = async (silent: boolean = false) => {
    if (!isInDashboard && !silent) return;
    if (!silent) setLoading(true);
    setError(null);

    try {
      // Llamadas paralelas a los tres endpoints
      const [pending, approved, rejected] = await Promise.all([
        apiRequest<PaymentNotification[]>('temporaryAppointmentsPending', 'GET'),
        apiRequest<PaymentNotification[]>('temporaryAppointmentsApproved', 'GET'),
        apiRequest<PaymentNotification[]>('temporaryAppointmentsRejected', 'GET'),
      ]);

      // Combinar todas en una sola lista (opcional)
      const all = [...pending, ...approved, ...rejected];
      setNotifications(all);
      
      // El contador de no leídas solo considera pendientes
      const unreadPending = pending.filter(n => !n.read).length;
      setUnreadCount(unreadPending);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (!silent) setError('Error al cargar las notificaciones');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Actualizar estado (aprobar / rechazar)
  // ------------------------------------------------------------
  const updateNotificationStatus = async (
    notificationId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string
  ) => {
    try {
      setLoading(true);
      const notification = notifications.find((n) => n.id === notificationId);
      if (!notification) throw new Error('Notificación no encontrada');

      if (status === 'approved') {
        const appointmentPayload = createAppointmentPayload(notification);
        if (!appointmentPayload) throw new Error('No se pudo crear el payload para la cita');
        await createAppointment(appointmentPayload);
        await notifyChatbotAboutApproval(notification, notification.whatsAppNumber);
      } else {
        await notifyChatbotAboutRejection(
          notification,
          notification.whatsAppNumber,
          rejectionReason || 'Razón no especificada'
        );
      }

      // Llamada al backend para marcar como verificada (aprobada/rechazada)
      await apiRequest('temporaryAppointments', 'POST', { isApproved: status === 'approved' }, `${notificationId}/verify`);

      // Actualizamos el estado local
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? {
                ...notif,
                status: status === 'approved' ? 'Approved' : 'Rejected',
                isProcessed: true,
                processedAt: new Date().toISOString(),
                read: true,
              }
            : notif
        )
      );

      // Recalcular contador de no leídas (solo pendientes)
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('❌ Error in updateNotificationStatus:', err);
      setError('Error al actualizar el estado de la notificación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Marcar como leída (solo para pendientes)
  // ------------------------------------------------------------
  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId && notif.status === 'Payment_Uploaded' && !notif.isProcessed
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.status === 'Payment_Uploaded' && !notif.isProcessed ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(0);
  };

  // ------------------------------------------------------------
  // Efectos para cargar datos y refrescar periódicamente
  // ------------------------------------------------------------
  useEffect(() => {
    if (isInDashboard) {
      fetchNotifications();
    }
  }, [isInDashboard]);

  useEffect(() => {
    if (!isInDashboard) return;
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [isInDashboard]);

  useEffect(() => {
    if (pathname?.includes('/notificaciones')) {
      fetchNotifications();
    }
  }, [pathname]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        socket: null,
        markAsRead,
        markAllAsRead,
        updateNotificationStatus,
        loading,
        error,
        refreshNotifications: fetchNotifications,
        lastUpdate,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};