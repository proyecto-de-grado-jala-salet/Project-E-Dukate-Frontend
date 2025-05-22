"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { Patient } from '@/types/userTypes';
import dayjs from 'dayjs';
import { mapGenderToRadioValue } from '@/utils/formUtils';

export default function MedicalHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams ? searchParams.get('id') : null;
  const { data: patient, loading, error } = useApi<Patient>('patients');

  const [patientData, setPatientData] = useState<Patient | null>(null);

  useEffect(() => {
    if (!searchParams || !patientId) {
      router.push('/dashboard/pacientes');
      return;
    }

    if (patient && patient.length > 0) {
      const foundPatient = patient.find(p => p.id === patientId);
      if (foundPatient) {
        setPatientData(foundPatient);
      } else {
        router.push('/dashboard/pacientes');
      }
    }
  }, [patientId, patient, router, searchParams]);

  if (loading) return <Typography variant="h6">Cargando...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  if (!patientData) return <Typography variant="h6">Paciente no encontrado</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ py: 3, px: 0, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2, color: '#000000' }}>
          Identificación del Paciente
        </Typography>
        <Divider sx={{ mb: 2, borderColor: '#D8D8D8' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, px: 0, color: '#000000' }}>
          <Box sx={{ px: 3 }}>
            <Typography variant="body1" sx={{ py: 0.5 }}>
              <strong>Nombre y Apellido:</strong> {patientData.names} {patientData.lastNamePaternal} {patientData.lastNameMaternal || ''}
            </Typography>
          </Box>
          <Divider sx={{ mt: 1, borderColor: '#D8D8D8' }} />
          <Box sx={{ px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body1" sx={{ py: 0.5 }}>
                <strong>Fecha de Nacimiento:</strong> {dayjs(patientData.dateOfBirth).format('YYYY/MM/DD')}
              </Typography>
              <Typography variant="body1" sx={{ py: 0.5 }}>
                <strong>Edad:</strong> {patientData.age}
              </Typography>
              <Typography variant="body1" sx={{ py: 0.5 }}>
                <strong>Género:</strong> {mapGenderToRadioValue(patientData.gender)}
              </Typography>
              <Typography variant="body1" sx={{ py: 0.5 }}>
                <strong>CI:</strong> {patientData.identityCard}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 1, borderColor: '#D8D8D8' }} />
          <Box sx={{ px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body1" sx={{ py: 0.5 }}>
                <strong>Domicilio:</strong> {patientData.address}
              </Typography>
              <Typography variant="body1" sx={{ py: 0.5 }}>
                <strong>Celular:</strong> {patientData.mobileNumber}
              </Typography>
              <Typography variant="body1" sx={{ py: 0.5 }}>
                <strong>Teléfono:</strong> {patientData.phoneNumber || 'No registrado'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Typography variant="body1" sx={{ mt: 3, color: '#000000' }}>
        Esta es una página placeholder para el historial médico. Puedes expandirla con datos del backend (por ejemplo, consultas médicas) usando el API.
      </Typography>
    </Box>
  );
}