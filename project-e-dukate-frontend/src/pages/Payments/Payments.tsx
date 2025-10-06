/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Pagination } from '@/components/Pagination';
import { usePayments } from '@/hooks/usePayments';
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';
import { useNavigation } from '@/contexts/NavigationContext';
import { getAuthToken } from '@/services/api';
import { showNotification } from '@/services/notificationService';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
dayjs.locale('es');

const PaymentTable = dynamic(() => 
  import('@/components/Payments/PaymentTable').then(mod => mod.PaymentTable), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

const GenericFilterContainer = dynamic(() => 
  import('@/components/GenericFilters').then(mod => mod.GenericFilterContainer), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

const formatDate = (date: string | null): string => {
  if (!date) return '-';
  const parsedDate = new Date(date);
  return parsedDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const Payments: React.FC = () => {
  const {
    specialistId,
    setSpecialistId,
    year,
    setYear,
    month,
    setMonth,
    day,
    setDay,
    status,
    setStatus,
    payments,
    totalPages,
    currentPage,
    loading,
    error,
    specialists,
    patients,
    statuses,
    fetchDataWithCurrentFilters,
    handleValueChange,
    handleResetFilter,
    editedValues,
    qrExists,
    uploadQR,
    updateQR,
    isAdmin,
  } = usePayments();

  const { setIsNavigating } = useNavigation();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  const { userRole } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      setIsNavigating(false);
    }
  }, [loading, setIsNavigating]);

  const filterConfig = [
    ...(isAdmin ? [{
      type: 'dropdown' as const,
      label: 'Especialista',
      value: specialistId,
      onChange: setSpecialistId,
      options: specialists,
    }] : []),
    {
      type: 'year' as const,
      label: 'Años',
      value: year,
      onChange: setYear,
    },
    {
      type: 'month' as const,
      label: 'Meses',
      value: month,
      onChange: setMonth,
    },
    {
      type: 'dropdown' as const,
      label: 'Día',
      value: day,
      onChange: setDay,
      options: [
        { value: '', label: 'Días' },
        ...Array.from({ length: 31 }, (_, i) => ({
          value: (i + 1).toString().padStart(2, '0'),
          label: (i + 1).toString().padStart(2, '0'),
        })),
      ],
    },
    {
      type: 'dropdown' as const,
      label: 'Estado',
      value: status,
      onChange: setStatus,
      options: statuses,
    },
  ];

  const handleUploadQR = useCallback(() => {
    if (!isAdmin) {
      showNotification('No tiene permisos para realizar esta acción', 'error');
      return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
          showNotification('Por favor, seleccione solo archivos de imagen (JPEG, PNG o WebP).', 'error');
          return;
        }
        try {
          await uploadQR(file);
        } catch (err) {
          console.error(err);
        }
      }
    };
    input.click();
  }, [uploadQR, isAdmin]);

  const handleEditQR = useCallback(() => {
    if (!isAdmin) {
      showNotification('No tiene permisos para realizar esta acción', 'error');
      return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validImageTypes.includes(file.type)) {
          showNotification('Por favor, seleccione solo archivos de imagen (JPEG, PNG o WebP).', 'error');
          return;
        }
        try {
          await updateQR(file);
        } catch (err) {
          console.error(err);
        }
      }
    };
    input.click();
  }, [updateQR, isAdmin]);

  const handleViewQR = useCallback(async () => {
    if (!isAdmin) {
      showNotification('No tiene permisos para realizar esta acción', 'error');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5275/api/PaymentQRs', {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener el QR');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setQrImageUrl(url);
      setQrDialogOpen(true);
    } catch (err) {
      showNotification("Error al obtener el QR", "error");
    }
  }, [isAdmin]);

  const handleCloseDialog = () => {
    if (qrImageUrl) {
      URL.revokeObjectURL(qrImageUrl);
      setQrImageUrl(null);
    }
    setQrDialogOpen(false);
  };

  if (loading) return <Typography variant="h6">Cargando...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3, bgcolor: '#EDEDED', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
          Pagos
        </Typography>
        {isAdmin && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!qrExists ? (
              <Tooltip title="Subir QR">
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleUploadQR}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <Image src="/upload-qr.svg" alt="Subir QR" width={34} height={34} />
                </Button>
              </Tooltip>
            ) : (
              <>
                <Tooltip title="Editar QR">
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleEditQR}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <Image src="/edit-qr.svg" alt="Editar QR" width={30} height={30} />
                  </Button>
                </Tooltip>
                <Tooltip title="Ver QR">
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleViewQR}
                    sx={{ minWidth: 'auto', p: 0.5 }}
                  >
                    <Image src="/view-qr.svg" alt="Ver QR" width={30} height={30} />
                  </Button>
                </Tooltip>
              </>
            )}
          </Box>
        )}
      </Box>
      <GenericFilterContainer
        filters={filterConfig}
        onResetFilters={handleResetFilter}
      />
      <PaymentTable
        payments={payments}
        editedValues={editedValues}
        onValueChange={handleValueChange}
        getPatientName={(patientId) =>
          patients.find((p) => p.value === patientId)?.label || patientId
        }
        formatDate={formatDate}
        isAdmin={isAdmin}
      />
      {payments && payments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => fetchDataWithCurrentFilters(page)}
        />
      )}
      <Dialog 
        open={qrDialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Imagen QR</DialogTitle>
        <DialogContent>
          {qrImageUrl && (
            <Box 
              sx={{ 
                position: 'relative', 
                width: '100%',
                height: '60vh',
                minHeight: '300px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                src={qrImageUrl}
                alt="Código QR"
                fill
                style={{ 
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Volver atrás
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments;