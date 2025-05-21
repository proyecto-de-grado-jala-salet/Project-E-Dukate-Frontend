"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApi } from '../../../../../hooks/useApi';
import { Patient } from '../../../../../types/userTypes';

export default function MedicalHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams ? searchParams.get('id') : null;
  const { data: patient, loading, error } = useApi<Patient>('patients');

  const [patientName, setPatientName] = useState<string>('');

  useEffect(() => {
    if (!searchParams || !patientId) {
      router.push('/dashboard/pacientes');
      return;
    }

    if (patient && patient.length > 0) {
      const foundPatient = patient.find(p => p.id === patientId);
      if (foundPatient) {
        setPatientName(`${foundPatient.names} ${foundPatient.lastNamePaternal}`);
      } else {
        router.push('/dashboard/pacientes');
      }
    }
  }, [patientId, patient, router, searchParams]);

  if (loading) return <Typography variant="h6">Cargando...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Historial Médico del Paciente
      </Typography>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {patientName ? `Paciente: ${patientName}` : 'Paciente no encontrado'}
      </Typography>
      <Typography variant="body1">
        Esta es una página placeholder para el historial médico. Puedes expandirla con datos del backend (por ejemplo, consultas médicas) usando el API.
      </Typography>
    </Box>
  );
}