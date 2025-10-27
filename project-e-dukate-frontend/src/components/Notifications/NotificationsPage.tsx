/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';
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
  DialogActions,
  DialogTitle,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
} from '@mui/material';
import { useNotifications, PaymentNotification } from '@/contexts/NotificationContext';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Image from 'next/image';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSafeNavigation } from '@/hooks/useSafeNavigation';

const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    updateNotificationStatus, 
    markAllAsRead, 
    loading, 
    error,
    refreshNotifications 
  } = useNotifications();
  
  const { setIsNavigating } = useSafeNavigation();
  const [selectedNotification, setSelectedNotification] = useState<PaymentNotification | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notificationToReject, setNotificationToReject] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      setIsNavigating(false);
    }
  }, [loading, setIsNavigating]);

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


  const handleRejectClick = (notificationId: string) => {
    setNotificationToReject(notificationId);
    setRejectionReason('');
    setRejectionDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!notificationToReject) return;

    try {
      // Si no se ingresó motivo, usar uno por defecto
      const reason = rejectionReason.trim() || 'Comprobante de pago no válido o información incorrecta';
      
      await updateNotificationStatus(notificationToReject, 'rejected', reason);
      
      // Cerrar el diálogo y limpiar estados
      setRejectionDialogOpen(false);
      setNotificationToReject(null);
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting notification:', error);
    }
  };

  const handleCancelReject = () => {
    setRejectionDialogOpen(false);
    setNotificationToReject(null);
    setRejectionReason('');
  };

  const handleRefresh = async () => {
    setIsNavigating(true);
    try {
      await refreshNotifications();
    } finally {
      setIsNavigating(false);
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

  const getPatientInfo = (appointmentData: any) => {
    try {
      const data =
        typeof appointmentData === "string"
          ? JSON.parse(appointmentData)
          : appointmentData;

      const patient = data.patient || {};
      const specialty = data.specialty || {};
      const specialist = data.specialist || {};
      const selectedSlots = data.selectedSlots || [];
      const previewDates = data.previewDates || [];

      const timeRange =
        selectedSlots.length > 0
          ? `${selectedSlots[0].startTime.slice(0, 5)} a ${selectedSlots[0].endTime.slice(0, 5)}`
          : "N/A";
      
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
        timeRange: timeRange,
        formattedDates: formattedDates,
        selectedSlots: selectedSlots,
      };
    } catch (error) {
      console.error("❌ Error parsing appointmentData:", error);

      return {
        patientName: "N/A",
        patientLastName: "",
        specialty: "N/A",
        specialistName: "N/A",
        consultationsNumber: 0,
        timeRange: "N/A",
        formattedDates: [],
        selectedSlots: [],
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "black" }}>
          Notificaciones
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
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

      {notifications.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "#fafafa",
            borderRadius: 2,
            boxShadow: "none",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="h5"
            color="textSecondary"
            gutterBottom
            sx={{ fontWeight: "medium" }}
          >
            No se encontraron notificaciones
          </Typography>
          <Typography variant="body1" color="textSecondary">
            No hay comprobantes de pago pendientes por revisar.
          </Typography>
        </Paper>
      ) : (
        <List>
          {notifications.map((notification, index) => {
            const patientInfo = getPatientInfo(notification.appointmentData);

            return (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    py: 2,
                    bgcolor:
                      notification.status === "Payment_Uploaded"
                        ? "#fffde7"
                        : "transparent",
                    border:
                      notification.status === "Payment_Uploaded"
                        ? "1px solid #ffd54f"
                        : "none",
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {patientInfo.patientName} {patientInfo.patientLastName}
                      </Typography>

                      <Typography variant="body2" color="textSecondary">
                        <strong>Especialidad:</strong> {patientInfo.specialty}
                      </Typography>

                      <Typography variant="body2" color="textSecondary">
                        <strong>Especialista:</strong>{" "}
                        {patientInfo.specialistName}
                      </Typography>

                      <Typography variant="body2" color="textSecondary">
                        <strong>N° de consultas:</strong>{" "}
                        {patientInfo.consultationsNumber}
                      </Typography>

                      <Typography variant="body2" color="textSecondary">
                        <strong>WhatsApp:</strong> {notification.whatsAppNumber}
                      </Typography>

                      <Chip
                        label={getStatusText(notification.status)}
                        color={getStatusColor(notification.status)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        minWidth: 120,
                      }}
                    >
                      {notification.comprobanteUrl && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleViewProof(notification)}
                        >
                          Ver Comprobante
                        </Button>
                      )}

                      {notification.status === "Payment_Uploaded" && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleApprove(notification.id)}
                            sx={{
                              border: "1px solid",
                              borderColor: "success.main",
                            }}
                          >
                            <CheckCircleOutlineIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRejectClick(notification.id)}
                            sx={{
                              border: "1px solid",
                              borderColor: "error.main",
                            }}
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

      <Dialog
        open={rejectionDialogOpen}
        onClose={handleCancelReject}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Especificar motivo de rechazo
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Por favor, ingresa el motivo por el cual se rechaza esta solicitud de cita. 
            Este mensaje será enviado al paciente.
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Ejemplo: Comprobante de pago ilegible, monto incorrecto, fecha ya ocupada, etc."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReject}>
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmReject} 
            variant="contained" 
            color="error"
            disabled={!rejectionReason.trim()}
          >
            Confirmar Rechazo
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent sx={{ position: "relative", p: 0 }}>
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              bgcolor: "rgba(255,255,255,0.8)",
            }}
            onClick={() => setOpenDialog(false)}
          >
            <CloseIcon />
          </IconButton>

          {selectedNotification && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Comprobante de Pago - Detalles de la Cita
              </Typography>

              {(() => {
                const patientInfo = getPatientInfo(
                  selectedNotification.appointmentData
                );
                return (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Información de la Cita
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Paciente:</strong> {patientInfo.patientName}{" "}
                        {patientInfo.patientLastName}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Especialidad:</strong> {patientInfo.specialty}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Especialista:</strong>{" "}
                        {patientInfo.specialistName}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>N° de consultas:</strong>{" "}
                        {patientInfo.consultationsNumber}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>WhatsApp:</strong>{" "}
                        {selectedNotification.whatsAppNumber}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Todas las fechas programadas
                      </Typography>
                      {patientInfo.formattedDates.map(
                        (date: any, index: number) => (
                          <Typography key={index} variant="body2" gutterBottom>
                            • {date.display}
                          </Typography>
                        )
                      )}
                    </Box>
                  </>
                );
              })()}

              <Box sx={{ mt: 3, textAlign: "center" }}>
                {selectedNotification.comprobanteUrl ? (
                  <Image
                    src={selectedNotification.comprobanteUrl}
                    alt="Comprobante de pago"
                    width={600}
                    height={400}
                    unoptimized={true}
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      border: "1px solid #ddd",
                      borderRadius: 8,
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