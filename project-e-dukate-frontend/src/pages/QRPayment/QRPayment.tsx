/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import { apiRequest } from '@/services/api';
import { showNotification } from '@/services/notificationService';
import { temporaryAppointmentService, TemporaryAppointmentResponseDto } from '@/services/temporaryAppointmentService';

interface QRPaymentProps {
  appointmentId?: string;
}

const QRPayment: React.FC<QRPaymentProps> = ({ appointmentId: propAppointmentId }) => {
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [appointmentData, setAppointmentData] = useState<TemporaryAppointmentResponseDto | null>(null);

  const searchParams = useSearchParams();
  const queryAppointmentId = searchParams ? searchParams.get('appointmentId') : null;
  const appointmentId = propAppointmentId || queryAppointmentId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (appointmentId) {
          try {
            const appointment = await temporaryAppointmentService.getTemporaryAppointment(appointmentId);
            setAppointmentData(appointment);
          } catch (error) {
            console.error('Error cargando datos de la cita:', error);
            showNotification('Error al cargar los datos de la cita', 'error');
          }
        }
        
        const response = await apiRequest<Blob>("paymentQRs", "GET");
        const url = URL.createObjectURL(response);
        setQrImageUrl(url);
      } catch (err) {
        console.error("Error fetching QR:", err);
        showNotification("Error al obtener el QR.", "error");
      } finally {
        setLoadingQR(false);
      }
    };

    fetchData();

    return () => {
      if (qrImageUrl) URL.revokeObjectURL(qrImageUrl);
    };
  }, [appointmentId]);

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        showNotification("Archivo seleccionado. Haz clic en 'Enviar comprobante' para subirlo.", "info");
      }
    };
    input.click();
  };

  const handleUploadComprobante = async () => {
    if (!selectedFile) {
      showNotification("Por favor selecciona un archivo primero.", "warning");
      return;
    }

    if (!appointmentId) {
      showNotification("Error: No se encontró la información de la cita.", "error");
      return;
    }

    setUploading(true);
    try {
      await temporaryAppointmentService.uploadComprobante(appointmentId, selectedFile);
      
      showNotification("✅ Comprobante subido exitosamente. Tu pago está en verificación.", "success");
      
      setSelectedFile(null);
      setAppointmentData(null);

    } catch (err: any) {
      console.error("Error uploading comprobante:", err);
      
      let errorMessage = "Error al subir el comprobante. Intenta nuevamente.";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      showNotification(`❌ ${errorMessage}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    showNotification("Archivo removido", "info");
  };

  const renderAppointmentInfo = () => {
    if (!appointmentData) return null;

    const data = appointmentData.appointmentData;
    const totalCost = data?.consultationsNumber * 65 || 0;
    const paymentRequired = totalCost * 0.5;

    return (
      <Box sx={{ 
        mb: 3, 
        p: 3, 
        bgcolor: '#f8f9fa', 
        borderRadius: 2,
        border: '1px solid #e9ecef',
        width: '100%',
        maxWidth: '600px'
      }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#013c28', fontWeight: 'bold' }}>
          Resumen de tu cita
        </Typography>
        
        <Box sx={{ display: 'grid', gap: 1 }}>
          <Typography>
            <strong>Especialista:</strong> {data?.specialist?.Names} {data?.specialist?.LastNamePaternal}
          </Typography>
          <Typography>
            <strong>Especialidad:</strong> {data?.specialty?.TypeOfSpecialty}
          </Typography>
          <Typography>
            <strong>Sesiones:</strong> {data?.consultationsNumber}
          </Typography>
          <Typography>
            <strong>Costo total:</strong> Bs. {totalCost}
          </Typography>
          <Typography sx={{ fontWeight: 'bold', color: '#013c28' }}>
            <strong>Pago requerido (50%):</strong> Bs. {paymentRequired}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderFileInfo = () => {
    if (!selectedFile) return null;

    return (
      <Box sx={{ 
        mb: 3, 
        p: 2, 
        bgcolor: '#e8f5e8', 
        borderRadius: 2,
        border: '1px solid #4caf50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '400px'
      }}>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Archivo seleccionado:
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </Typography>
        </Box>
        <Button 
          size="small" 
          color="error" 
          onClick={handleRemoveFile}
          sx={{ minWidth: 'auto' }}
        >
          ✕
        </Button>
      </Box>
    );
  };

  if (loadingQR) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "white",
        p: { xs: 0, sm: 0, md: 0 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          bgcolor: "#013c28",
          p: 0,
          margin: 0,
          display: "flex",
          justifyContent: { xs: "center", md: "flex-start" },
          alignItems: "center",
        }}
      >
        <Box sx={{ margin: { xs: "20px auto", md: "20px 40px" } }}>
          <Image
            src="/E-Dukate_Logo_Auth.webp"
            alt="E-Dukate Logo"
            width={180}
            height={60}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          px: { xs: 2, md: 0 },
          py: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: "bold",
            textAlign: "center",
            color: "black",
          }}
        >
          Escanea y Paga
        </Typography>

        <Typography
          sx={{
            mb: { xs: 4, md: 6 },
            textAlign: "center",
            maxWidth: "600px",
            color: "#000",
            fontSize: "17px",
          }}
        >
          Al terminar de hacer el pago por favor sube el comprobante para
          agendarte tus sesiones
        </Typography>
        
        {renderAppointmentInfo()}

        {qrImageUrl ? (
          <Box
            component="img"
            src={qrImageUrl}
            alt="Código QR para pago"
            sx={{
              width: { xs: "95%", sm: "60%", md: "40%" },
              maxWidth: "400px",
              mb: { xs: 4, md: 6 },
            }}
          />
        ) : (
          <Typography variant="body1" color="error">
            No se pudo cargar el QR.
          </Typography>
        )}

        {renderFileInfo()}

        {/* Botones */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            sx={{
              borderColor: "#013c28",
              color: "#013c28",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              "&:hover": { 
                bgcolor: "#013c28",
                color: "white"
              },
            }}
            onClick={handleFileSelect}
            disabled={uploading}
          >
            {selectedFile ? "Cambiar archivo" : "Seleccionar comprobante"}
          </Button>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#013c28",
              color: "white",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              "&:hover": { bgcolor: "#013c28" },
              "&:disabled": { bgcolor: "#cccccc" }
            }}
            onClick={handleUploadComprobante}
            disabled={!selectedFile || uploading || !appointmentId}
          >
            {uploading ? (
              <>
                <CircularProgress size={20} sx={{ color: 'white', mr: 1 }} />
                Subiendo...
              </>
            ) : (
              "Enviar comprobante"
            )}
          </Button>
        </Box>

        {!appointmentId && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            Error: No se pudo cargar la información de la cita. 
            Por favor, regresa al chatbot y genera un nuevo enlace de pago.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default QRPayment;