// src/pages/Patients/MedicalHistory.tsx
"use client"

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { useEditStore } from '@/stores/editStore';
import { Patient, Specialist } from '@/types/userTypes';
import { PatientInfo } from '@/components/PatientInfo';
import { SpecialistStatusForm } from '@/components/SpecialistStatusForm';

export const MedicalHistory: React.FC = () => {
  const router = useRouter();
  const { entityId, entityType } = useEditStore();
  const patientId = entityId;

  const { data: patient, loading: patientLoading, error: patientError } = useApi<Patient>('patients');
  const { data: specialists, loading: specialistsLoading, error: specialistsError } = useApi<Specialist>('specialists');

  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    if (!patientId || entityType !== 'patient') {
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
  }, [patientId, entityType, patient, router]);

  const handleAddConsultation = () => {
    console.log('Añadir consulta:', {
      patientId,
      specialistIds: selectedSpecialist,
      status: selectedStatus,
    });
  };

  if (patientLoading || specialistsLoading) return <Typography variant="h6" sx={{ color: '#000000' }}>Cargando...</Typography>;
  if (patientError) return <Typography variant="h6" sx={{ color: '#000000' }} color="error">{patientError}</Typography>;
  if (specialistsError) return <Typography variant="h6" sx={{ color: '#000000' }} color="error">{specialistsError}</Typography>;
  if (!patientData) return <Typography variant="h6" sx={{ color: '#000000' }}>Paciente no encontrado</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <PatientInfo patient={patientData} />
      <SpecialistStatusForm
        specialists={specialists}
        selectedSpecialist={selectedSpecialist}
        setSelectedSpecialist={setSelectedSpecialist}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onAddConsultation={handleAddConsultation}
      />
      <Typography variant="body1" sx={{ mt: 3, color: '#000000' }}>
        Consultations
      </Typography>
    </Box>
  );
};

export default MedicalHistory;