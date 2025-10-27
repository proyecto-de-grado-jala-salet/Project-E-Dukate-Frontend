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

  const isInDashboard = pathname?.includes("/dashboard") || false;

  const createAppointmentPayload = (
    notification: PaymentNotification
  ): CreateAppointmentPayload | null => {
    try {
      const data =
        typeof notification.appointmentData === "string"
          ? JSON.parse(notification.appointmentData)
          : notification.appointmentData;

      const patient = data.patient || {};
      const specialty = data.specialty || {};
      const specialist = data.specialist || {};
      const selectedSlots = data.selectedSlots || [];
      const consultationsNumber = data.consultationsNumber || 0;
      const totalCost = data.totalCost || 0;

      if (!patient.Id && !patient.id) {
        console.error("❌ Patient ID not found in appointment data");
        return null;
      }
      if (!specialty.Id && !specialty.id) {
        console.error("❌ Specialty ID not found in appointment data");
        return null;
      }
      if (!specialist.Id && !specialist.id) {
        console.error("❌ Specialist ID not found in appointment data");
        return null;
      }

      const sessionCost =
        consultationsNumber > 0 ? totalCost / consultationsNumber : 65;

      const scheduledSessions = selectedSlots.map((slot: any) => {
        const dayInSpanish = slot.dayOfWeek;
        const dayInEnglish = translateDayToEnglish(dayInSpanish);

        return {
          timeSlotId: slot.timeSlotId,
          dayOfWeek: dayInEnglish,
          startTime: slot.startTime?.slice(0, 5) || "N/A",
          endTime: slot.endTime?.slice(0, 5) || "N/A",
          status: "Scheduled",
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
      console.error("❌ Error creating appointment payload:", error);
      console.error("❌ Raw notification data:", notification);
      return null;
    }
  };

  const fetchNotifications = async (silent: boolean = false) => {
    if (!isInDashboard && !silent) return;

    if (!silent) setLoading(true);
    setError(null);

    try {
      const pendingAppointments = await apiRequest<PaymentNotification[]>(
        "temporaryAppointments",
        "GET",
        undefined,
        "pending"
      );

      const notificationsWithComprobante = pendingAppointments.filter(
        (appointment) =>
          appointment.comprobanteUrl &&
          appointment.status === "Payment_Uploaded" &&
          !appointment.isProcessed
      );

      setNotifications(notificationsWithComprobante);
      setUnreadCount(notificationsWithComprobante.length);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error fetching notifications:", err);
      if (!silent) {
        setError("Error al cargar las notificaciones");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Agrega esta función en tu NotificationContext
  const notifyChatbotAboutApproval = async (
    notification: PaymentNotification,
    patientPhone: string
  ) => {
    try {
      // Extraer información del paciente de los datos de la cita
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
          `*Fechas programadas:*\n${patientInfo.formattedDates.map((date: any) => `• ${date.display}`).join("\n")}\n\n` +
          `💡 *Recordatorio importante:*\n` +
          `Te enviaremos un recordatorio 24 horas antes de cada sesión para que no se te olvide.\n` +
          `• Tambien puedes cancelar o reprogramar tus sesiones, solo comunicate con nosotros\n\n` +
          `¡Te esperamos! 🎉`,
        notificationId: notification.id,
        type: "appointment_approved",
      };

      // Enviar notificación al chatbot "https://tu-chatbot-url/api/notify-whatsapp"
      await fetch("http://localhost:3000/api/notify-whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });

      console.log("✅ Notificación enviada al chatbot");
    } catch (error) {
      console.error("❌ Error enviando notificación al chatbot:", error);
      // No lanzar error para no interrumpir el flujo principal
    }
  };

  const notifyChatbotAboutRejection = async (
    notification: PaymentNotification,
    patientPhone: string,
    rejectionReason: string // 🔥 Nuevo parámetro
  ) => {
    try {
      // Extraer información del paciente
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
          `⚠️ *Razón del rechazo:*\n` +
          `${rejectionReason}\n\n` + // 🔥 Usar el motivo específico
          `🔄 Por favor vuelve a intenta otra vez\n` +
          `Si necesitas ayuda, contáctanos directamente`,
        notificationId: notification.id,
        type: "appointment_rejected",
      };

      // Enviar notificación al chatbot
      await fetch("http://localhost:3000/api/notify-whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });

      console.log("✅ Notificación de rechazo enviada al chatbot");
    } catch (error) {
      console.error(
        "❌ Error enviando notificación de rechazo al chatbot:",
        error
      );
    }
  };

  // Función auxiliar para extraer información del paciente
  const getPatientInfoFromNotification = (
    notification: PaymentNotification
  ) => {
    try {
      const data =
        typeof notification.appointmentData === "string"
          ? JSON.parse(notification.appointmentData)
          : notification.appointmentData;

      const patient = data.patient || {};
      const specialty = data.specialty || {};
      const specialist = data.specialist || {};
      const selectedSlots = data.selectedSlots || [];
      const previewDates = data.previewDates || [];

      const formattedDates = previewDates.map((date: any, index: number) => {
        const slot = selectedSlots[index] || selectedSlots[0] || {};
        const dateObj = new Date(date.start);
        return {
          display: `${dateObj.toLocaleDateString("es-ES")} de ${slot.startTime?.slice(0, 5) || "N/A"} a ${slot.endTime?.slice(0, 5) || "N/A"}`,
        };
      });

      return {
        patientName: patient.Names || patient.names || "N/A",
        patientLastName:
          patient.LastNamePaternal || patient.lastNamePaternal || "",
        specialty:
          specialty.TypeOfSpecialty || specialty.typeOfSpecialty || "N/A",
        specialistName:
          `${specialist.Names || specialist.names || ""} ${specialist.LastNamePaternal || specialist.lastNamePaternal || ""}`.trim(),
        consultationsNumber: data.consultationsNumber || 0,
        formattedDates: formattedDates,
      };
    } catch (error) {
      console.error("❌ Error parsing notification data:", error);
      return {
        patientName: "N/A",
        patientLastName: "",
        specialty: "N/A",
        specialistName: "N/A",
        consultationsNumber: 0,
        formattedDates: [],
      };
    }
  };

  const updateNotificationStatus = async (
    notificationId: string,
    status: "approved" | "rejected",
    rejectionReason?: string
  ) => {
    try {
      setLoading(true);

      const notification = notifications.find((n) => n.id === notificationId);
      if (!notification) {
        throw new Error("Notificación no encontrada");
      }

      if (status === "approved") {
        const appointmentPayload = createAppointmentPayload(notification);

        if (!appointmentPayload) {
          throw new Error("No se pudo crear el payload para la cita");
        }

        await createAppointment(appointmentPayload);

        await notifyChatbotAboutApproval(
          notification,
          notification.whatsAppNumber
        );
      } else if (status === "rejected") {
        // 🔥 Pasar el motivo específico al chatbot
        await notifyChatbotAboutRejection(
          notification,
          notification.whatsAppNumber,
          rejectionReason || "Razón no especificada" // 🔥 Usar el motivo
        );
      }

      await apiRequest(
        "temporaryAppointments",
        "POST",
        { isApproved: status === "approved" },
        `${notificationId}/verify`
      );

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId
            ? {
                ...notif,
                status: status === "approved" ? "Approved" : "Rejected",
                isProcessed: true,
                processedAt: new Date().toISOString(),
              }
            : notif
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("❌ Error in updateNotificationStatus:", err);
      setError("Error al actualizar el estado de la notificación");
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
    if (pathname?.includes("/notificaciones")) {
      fetchNotifications();
    }
  }, [pathname]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

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