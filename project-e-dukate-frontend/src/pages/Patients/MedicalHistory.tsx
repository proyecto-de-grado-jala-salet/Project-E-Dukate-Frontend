"use client"

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { useEditStore } from '@/stores/editStore';
import { MedicalHistoryDto, MedicalHistoryStatus } from '@/types/medicalHistory';
import { Patient, Specialist} from '@/types/userTypes';
import { PatientInfo } from '@/components/PatientInfo';
import { SpecialistStatusForm } from '@/components/SpecialistStatusForm';
import { getMedicalHistoryByPatientId, updatePermission, deletePermission, updateMedicalHistoryStatus } from '@/services/medicalHistoryService';
import { apiRequest } from '@/services/api';

export const MedicalHistory: React.FC = () => {
  const router = useRouter();
  const { entityId: patientId, entityType } = useEditStore();
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryDto | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [selectedSpecialists, setSelectedSpecialists] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<MedicalHistoryStatus>(MedicalHistoryStatus.ContinuaEnTratamiento);
  const { data: specialists, loading: specialistsLoading, error: specialistsError } = useApi<Specialist>('specialists');

  useEffect(() => {
    if (!patientId || entityType !== 'patient') {
      router.push('/dashboard/pacientes');
      return;
    }

    const fetchMedicalHistory = async () => {
      const history = await getMedicalHistoryByPatientId(patientId);
      if (history) {
        setMedicalHistory(history);
        const initialSpecialists = history.permissions
          .filter(p => p.canEdit)
          .map(p => p.specialistId);
        setSelectedSpecialists(initialSpecialists);
        const initialStatus = history.permissions.length > 0 ? history.permissions[0].status : MedicalHistoryStatus.ContinuaEnTratamiento;
        setSelectedStatus(initialStatus);
      }
    };

    const fetchPatientData = async () => {
      try {
        const patient = await apiRequest<Patient>('patients', 'GET', undefined, patientId);
        setPatientData(patient);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        router.push('/dashboard/pacientes');
      }
    };

    fetchMedicalHistory();
    fetchPatientData();
  }, [patientId, entityType, router]);

  const handleAddConsultation = () => {
    console.log('Añadir consulta:', {
      patientId,
      specialistIds: selectedSpecialists,
      status: selectedStatus,
    });
  };

  const handleSpecialistChange = async (newSpecialists: string[]) => {
    if (!medicalHistory || !patientId) return;

    const addedSpecialists = newSpecialists.filter(s => !selectedSpecialists.includes(s));
    const removedSpecialists = selectedSpecialists.filter(s => !newSpecialists.includes(s));
    
    for (const specialistId of addedSpecialists) {
      await updatePermission({ medicalHistoryId: medicalHistory.id, specialistId, canEdit: true });
    }

    for (const specialistId of removedSpecialists) {
      const permission = medicalHistory.permissions.find(p => p.specialistId === specialistId);
      if (permission) {
        await deletePermission(permission.id);
      }
    }

    const updatedHistory = await getMedicalHistoryByPatientId(patientId);
    if (updatedHistory) {
      setMedicalHistory(updatedHistory);
    }

    setSelectedSpecialists(newSpecialists);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!medicalHistory || !patientId || medicalHistory.permissions.length === 0) return;

    const permission = medicalHistory.permissions[0];
    await updateMedicalHistoryStatus(medicalHistory.id, permission.specialistId, newStatus);
    setSelectedStatus(newStatus as MedicalHistoryStatus);

    const updatedHistory = await getMedicalHistoryByPatientId(patientId);
    if (updatedHistory) {
      setMedicalHistory(updatedHistory);
    }
  };

  if (specialistsLoading) return <Typography variant="h6" sx={{ color: '#000000' }}>Cargando...</Typography>;
  if (specialistsError) return <Typography variant="h6" sx={{ color: '#000000' }} color="error">{specialistsError}</Typography>;
  if (!medicalHistory || !patientData) return <Typography variant="h6" sx={{ color: '#000000' }}>Cargando...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <PatientInfo patient={patientData} />
      <SpecialistStatusForm
        specialists={specialists || []}
        selectedSpecialists={selectedSpecialists}
        setSelectedSpecialists={handleSpecialistChange}
        selectedStatus={selectedStatus}
        setSelectedStatus={handleStatusChange}
        onAddConsultation={handleAddConsultation}
      />
      <Typography variant="body1" sx={{ mt: 3, color: '#000000' }}>
        Consultations
      </Typography>
    </Box>
  );
};