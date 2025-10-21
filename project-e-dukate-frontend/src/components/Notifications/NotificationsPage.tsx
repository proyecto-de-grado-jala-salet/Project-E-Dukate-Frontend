/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/notifications/NotificationsPage.tsx
'use client';
import React, { useState, useEffect } from 'react'; // Agregar useEffect
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  Divider,
  Button,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNotifications, PaymentNotification } from '@/contexts/NotificationContext';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Image from 'next/image';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSafeNavigation } from '@/hooks/useSafeNavigation'; // Agregar este import

const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    updateNotificationStatus, 
    markAllAsRead, 
    loading, 
    error,
    refreshNotifications 
  } = useNotifications();
  
  const { setIsNavigating } = useSafeNavigation(); // Agregar esto
  const [selectedNotification, setSelectedNotification] = useState<PaymentNotification | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // 🔥 AGREGAR ESTE useEffect PARA MANEJAR LA CARGA
  useEffect(() => {
    // Cuando el componente se monta y los datos terminan de cargar, detener el loading
    if (!loading) {
      setIsNavigating(false);
    }
  }, [loading, setIsNavigating]);

  // También detener el loading si hay un error
  useEffect(() => {
    if (error) {
      setIsNavigating(false);
    }
  }, [error, setIsNavigating]);

  const handleViewProof = (notification: PaymentNotification) => {
    setSelectedNotification(notification);
    setOpenDialog(true);
  };

  const handleApprove = async (notificationId: string) => {
    try {
      await updateNotificationStatus(notificationId, 'approved');
    } catch (error) {
      console.error('Error approving notification:', error);
    }
  };

  const handleReject = async (notificationId: string) => {
    try {
      await updateNotificationStatus(notificationId, 'rejected');
    } catch (error) {
      console.error('Error rejecting notification:', error);
    }
  };

  const handleRefresh = async () => {
    setIsNavigating(true); // Iniciar loading al refrescar
    try {
      await refreshNotifications();
    } finally {
      setIsNavigating(false); // Detener loading cuando termine
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'error';
      case 'Payment_Uploaded': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Approved': return 'Aprobado';
      case 'Rejected': return 'Rechazado';
      case 'Payment_Uploaded': return 'Pendiente de revisión';
      case 'Pending': return 'Pendiente de pago';
      default: return status;
    }
  };

  // Función para extraer datos del paciente desde appointmentData
  const getPatientInfo = (appointmentData: any) => {
    try {
      return {
        patientName: appointmentData.patientName || 'N/A',
        patientLastName: appointmentData.patientLastName || '',
        specialty: appointmentData.specialtyName || 'N/A',
        appointmentDate: appointmentData.appointmentDate || 'N/A',
        appointmentTime: appointmentData.appointmentTime || 'N/A',
        amount: appointmentData.amount || 0,
      };
    } catch (error) {
      return {
        patientName: 'N/A',
        patientLastName: '',
        specialty: 'N/A',
        appointmentDate: 'N/A',
        appointmentTime: 'N/A',
        amount: 0,
      };
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header con título */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        mb: 3 
      }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "black" }}>
          Notificaciones
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            startIcon={<RefreshIcon />}
            onClick={handleRefresh} // Cambiar a handleRefresh
            disabled={loading}
          >
            Actualizar
          </Button>
          
          {notifications.length > 0 && (
            <Button variant="outlined" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Contenido de notificaciones */}
      {notifications.length === 0 ? (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            bgcolor: '#fafafa',
            borderRadius: 2,
            boxShadow: 'none',
            border: '1px solid #e0e0e0'
          }}
        >
          <Typography 
            variant="h5" 
            color="textSecondary" 
            gutterBottom
            sx={{ fontWeight: 'medium' }}
          >
            No se encontraron notificaciones
          </Typography>
          <Typography 
            variant="body1" 
            color="textSecondary"
          >
            No hay comprobantes de pago pendientes por revisar.
          </Typography>
        </Paper>
      ) : (
        <List>
          {notifications.map((notification, index) => {
            const patientInfo = getPatientInfo(notification.appointmentData);
            
            return (
              <React.Fragment key={notification.id}>
                <ListItem sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  py: 2,
                  bgcolor: notification.status === 'Payment_Uploaded' ? '#fffde7' : 'transparent',
                  border: notification.status === 'Payment_Uploaded' ? '1px solid #ffd54f' : 'none',
                  borderRadius: 2,
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {patientInfo.patientName} {patientInfo.patientLastName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {patientInfo.specialty} - {patientInfo.appointmentDate} {patientInfo.appointmentTime}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        WhatsApp: {notification.whatsAppNumber}
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        Monto: S/ {patientInfo.amount}
                      </Typography>
                      <Chip 
                        label={getStatusText(notification.status)}
                        color={getStatusColor(notification.status)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 120 }}>
                      {notification.comprobanteUrl && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewProof(notification)}
                        >
                          Ver Comprobante
                        </Button>
                      )}
                      
                      {notification.status === 'Payment_Uploaded' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleApprove(notification.id)}
                            sx={{ border: '1px solid', borderColor: 'success.main' }}
                          >
                            <CheckCircleOutlineIcon />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleReject(notification.id)}
                            sx={{ border: '1px solid', borderColor: 'error.main' }}
                          >
                            <CancelOutlinedIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            );
          })}
        </List>
      )}

      {/* Dialog para ver comprobante */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ position: 'relative', p: 0 }}>
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, bgcolor: 'rgba(255,255,255,0.8)' }}
            onClick={() => setOpenDialog(false)}
          >
            <CloseIcon />
          </IconButton>
          
          {selectedNotification && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Comprobante de Pago
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Paciente:</strong> {getPatientInfo(selectedNotification.appointmentData).patientName} {getPatientInfo(selectedNotification.appointmentData).patientLastName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>WhatsApp:</strong> {selectedNotification.whatsAppNumber}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Cita:</strong> {getPatientInfo(selectedNotification.appointmentData).specialty} - {getPatientInfo(selectedNotification.appointmentData).appointmentDate} {getPatientInfo(selectedNotification.appointmentData).appointmentTime}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Monto:</strong> S/ {getPatientInfo(selectedNotification.appointmentData).amount}
              </Typography>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                {selectedNotification.comprobanteUrl ? (
                  <Image
                    src={`https://project-e-dukate-backend-production.up.railway.app/${selectedNotification.comprobanteUrl}`}
                    alt="Comprobante de pago"
                    width={600}
                    height={400}
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      border: '1px solid #ddd',
                      borderRadius: 8 
                    }}
                  />
                ) : (
                  <Typography variant="body1" color="textSecondary">
                    No hay comprobante disponible
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NotificationsPage;