/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from '@/services/api';
import { usePathname } from 'next/navigation';
import { createAppointment, CreateAppointmentPayload } from '@/services/appointmentService';

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
  updateNotificationStatus: (notificationId: string, status: 'approved' | 'rejected') => void;
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

  const createAppointmentPayload = (notification: PaymentNotification): CreateAppointmentPayload | null => {
    try {
      const data = typeof notification.appointmentData === 'string' 
        ? JSON.parse(notification.appointmentData) 
        : notification.appointmentData;

      const patient = data.patient || {};
      const specialty = data.specialty || {};
      const specialist = data.specialist || {};
      const selectedSlots = data.selectedSlots || [];
      const consultationsNumber = data.consultationsNumber || 0;
      const totalCost = data.totalCost || 0;

      const sessionCost = consultationsNumber > 0 ? totalCost / consultationsNumber : 65;

      const scheduledSessions = selectedSlots.map((slot: any) => ({
        timeSlotId: slot.timeSlotId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime?.slice(0, 5) || 'N/A',
        endTime: slot.endTime?.slice(0, 5) || 'N/A',
        status: 'Scheduled'
      }));

      return {
        patientId: patient.Id || patient.id,
        specialtyId: specialty.Id || specialty.id,
        specialistId: specialist.Id || specialist.id,
        sessionCount: consultationsNumber,
        sessionCost: sessionCost,
        scheduledSessions: scheduledSessions
      };
    } catch (error) {
      console.error('❌ Error creating appointment payload:', error);
      return null;
    }
  };

  const fetchNotifications = async (silent: boolean = false) => {
    if (!isInDashboard && !silent) return;
    
    if (!silent) setLoading(true);
    setError(null);
    
    try {
      const pendingAppointments = await apiRequest<PaymentNotification[]>(
        'temporaryAppointments', 
        'GET', 
        undefined, 
        'pending'
      );

      const notificationsWithComprobante = pendingAppointments.filter(
        appointment => 
          appointment.comprobanteUrl && 
          appointment.status === 'Payment_Uploaded' &&
          !appointment.isProcessed
      );

      setNotifications(notificationsWithComprobante);
      setUnreadCount(notificationsWithComprobante.length);
      setLastUpdate(new Date());
      
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (!silent) {
        setError('Error al cargar las notificaciones');
      }
    } finally {
      if (!silent) setLoading(false);
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
    if (pathname?.includes('/notificaciones')) {
      fetchNotifications();
    }
  }, [pathname]);

  const updateNotificationStatus = async (notificationId: string, status: 'approved' | 'rejected') => {
    try {
      setLoading(true);
      
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification) {
        throw new Error('Notificación no encontrada');
      }

      if (status === 'approved') {
        const appointmentPayload = createAppointmentPayload(notification);
        
        if (!appointmentPayload) {
          throw new Error('No se pudo crear el payload para la cita');
        }

        await createAppointment(appointmentPayload);
      }

      await apiRequest(
        'temporaryAppointments', 
        'POST', 
        { isApproved: status === 'approved' }, 
        `${notificationId}/verify`
      );

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId 
            ? { 
                ...notif, 
                status: status === 'approved' ? 'Approved' : 'Rejected',
                isProcessed: true,
                processedAt: new Date().toISOString()
              } 
            : notif
        )
      );

      setUnreadCount(prev => Math.max(0, prev - 1));

    } catch (err) {
      console.error('❌ Error in updateNotificationStatus:', err);
      setError('Error al actualizar el estado de la notificación');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{
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
    }}>
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