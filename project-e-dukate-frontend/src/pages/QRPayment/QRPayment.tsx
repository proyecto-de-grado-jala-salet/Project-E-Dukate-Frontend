/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import { apiRequest } from '@/services/api';
import { showNotification } from '@/services/notificationService';

const QRPayment: React.FC = () => {
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const [loadingQR, setLoadingQR] = useState(true);

  useEffect(() => {
    const fetchQR = async () => {
      try {
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

    fetchQR();

    return () => {
      if (qrImageUrl) URL.revokeObjectURL(qrImageUrl);
    };
  }, []);

  const handleUploadComprobante = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          // await apiRequest('payments/comprobante', 'POST', formData); // Comenta hasta que el endpoint esté listo
          showNotification("Comprobante subido exitosamente.", "success");
        } catch (err) {
          console.error("Error uploading comprobante:", err);
          showNotification("Error al subir el comprobante.", "error");
        }
      }
    };
    input.click();
  };

  if (loadingQR)
    return (
      <CircularProgress sx={{ display: "block", m: "auto", mt: "60vh" }} />
    );

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
        <Box
          sx={{
            margin: { xs: "20px auto", md: "20px 40px" }
          }}
        >
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
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: "bold",
            textAlign: "center",
            color: "black",
            mt: 10,
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

        <Button
          variant="contained"
          sx={{
            bgcolor: "#013c28",
            color: "white",
            px: 4,
            py: 1.5,
            borderRadius: 3,
            "&:hover": { bgcolor: "#013c28" },
          }}
          onClick={handleUploadComprobante}
        >
          Enviar comprobante
        </Button>
      </Box>
    </Box>
  );
};

export default QRPayment;