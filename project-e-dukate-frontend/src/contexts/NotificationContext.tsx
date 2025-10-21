/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// contexts/NotificationContext.tsx - Versión mejorada
'use client';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiRequest } from '@/services/api';
import { usePathname } from 'next/navigation';

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

  // Polling silencioso cada 30 segundos cuando estamos en dashboard
  useEffect(() => {
    if (!isInDashboard) return;

    // Cargar inmediatamente
    fetchNotifications(true);

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [isInDashboard]);

  // También cargar cuando específicamente entramos a notificaciones
  useEffect(() => {
    if (pathname?.includes('/notificaciones')) {
      fetchNotifications();
    }
  }, [pathname]);

  const updateNotificationStatus = async (notificationId: string, status: 'approved' | 'rejected') => {
    try {
      setLoading(true);
      
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
      console.error('Error updating notification status:', err);
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

  const refreshNotifications = async () => {
    await fetchNotifications();
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
      refreshNotifications,
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