/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { use } from 'react';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePatientEdit } from '@/hooks/usePatientEdit';
import { PatientEdit } from '@/pages/Patients/PatientEdit';
import { Patient } from '@/types/userTypes';
import { useEditStore } from '@/stores/editStore';

interface PatientEditPageProps {
  params: Promise<{ slug: string }>;
}

export default function PatientEditPage({ params }: PatientEditPageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const { entityId, entityType } = useEditStore();
  const { formData, loading, isSubmitting, isUpdateSuccessful, error, handleSubmit, setFormData } = usePatientEdit<Patient>({ id: entityId || '' });

  if (isSubmitting || isUpdateSuccessful) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!entityId || entityType !== 'patient') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          No se proporcionó un ID de paciente válido
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
    </Box>
    );
  }

  if (error || !formData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {error || 'No se encontraron datos del paciente'}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <PatientEdit
        formData={formData}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        isSubmitting={isSubmitting}
      />
      <ToastContainer />
    </>
  );
}