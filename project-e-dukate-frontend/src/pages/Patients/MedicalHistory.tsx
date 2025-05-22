"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { useEditStore } from '@/stores/editStore';
import { MedicalHistoryDto, MedicalHistoryStatus } from '@/types/medicalHistory';
import { Patient, Specialist } from '@/types/userTypes';
import { PatientInfo } from '@/components/PatientInfo';
import { SpecialistStatusForm } from '@/components/SpecialistStatusForm';
import { getMedicalHistoryByPatientId, updatePermission, deletePermission, updateMedicalHistoryStatus, getSpecialistConsultations } from '@/services/medicalHistoryService';
import { apiRequest } from '@/services/api';

interface Consultation {
  id: string;
  reason: string;
  consultationDate: string;
  notes: string;
  specialistId: string;
}

interface PaginatedConsultations {
  Items: Consultation[];
  TotalCount: number;
  PageNumber: number;
  PageSize: number;
  TotalPages: number;
}

export const MedicalHistory: React.FC = () => {
  const router = useRouter();
  const { entityId: patientId, entityType } = useEditStore();
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryDto | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [selectedSpecialists, setSelectedSpecialists] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<MedicalHistoryStatus>(MedicalHistoryStatus.ContinuaEnTratamiento);
  const [selectedConsultationSpecialist, setSelectedConsultationSpecialist] = useState<string>('');
  const [consultations, setConsultations] = useState<PaginatedConsultations | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [errorConsultations, setErrorConsultations] = useState<string | null>(null);
  const pageSize = 10; // Alineado con el backend
  const { data: specialists, loading: specialistsLoading, error: specialistsError } = useApi<Specialist>('specialists');

  useEffect(() => {
    if (!patientId || entityType !== 'patient') {
      console.log('Invalid patientId or entityType, redirecting to /dashboard/pacientes', { patientId, entityType });
      router.push('/dashboard/pacientes');
      return;
    }

    const fetchMedicalHistory = async () => {
      console.log('Fetching medical history for patientId:', patientId);
      const history = await getMedicalHistoryByPatientId(patientId);
      if (history) {
        console.log('Medical history loaded:', {
          medicalHistoryId: history.id,
          permissions: history.permissions,
        });
        setMedicalHistory(history);
        const initialSpecialists = history.permissions
          .filter(p => p.canEdit)
          .map(p => p.specialistId);
        setSelectedSpecialists(initialSpecialists);
        const initialStatus = history.permissions.length > 0 ? history.permissions[0].status : MedicalHistoryStatus.ContinuaEnTratamiento;
        setSelectedStatus(initialStatus);
        setConsultations(null);
        setSelectedConsultationSpecialist('');
        setCurrentPage(1);
      } else {
        console.error('No medical history found for patientId:', patientId);
        setMedicalHistory(null);
        setConsultations(null);
        setSelectedConsultationSpecialist('');
      }
    };

    const fetchPatientData = async () => {
      try {
        const patient = await apiRequest<Patient>('patients', 'GET', undefined, patientId);
        console.log('Patient data loaded:', patient);
        setPatientData(patient);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        router.push('/dashboard/pacientes');
      }
    };

    fetchMedicalHistory();
    fetchPatientData();
  }, [patientId, entityType, router]);

  const specialistsWithPermission = specialists?.filter(specialist =>
    medicalHistory?.permissions.some(permission => permission.specialistId === specialist.id && permission.canEdit)
  ) || [];

  useEffect(() => {
    if (!selectedConsultationSpecialist || !medicalHistory) {
      console.log('No specialist or medical history selected, clearing consultations', {
        selectedConsultationSpecialist,
        medicalHistoryId: medicalHistory?.id,
      });
      setConsultations(null);
      setErrorConsultations(null);
      setCurrentPage(1);
      return;
    }

    const fetchConsultations = async () => {
      setLoadingConsultations(true);
      setErrorConsultations(null);
      setConsultations(null);

      const permission = medicalHistory.permissions.find(p => p.specialistId === selectedConsultationSpecialist && p.canEdit);
      if (!permission) {
        console.log('No valid permission found for specialistId:', selectedConsultationSpecialist);
        setConsultations(null);
        setErrorConsultations('No se encontraron permisos válidos para este especialista');
        setLoadingConsultations(false);
        return;
      }

      const response = await getSpecialistConsultations(
        medicalHistory.id,
        selectedConsultationSpecialist,
        permission.id,
        currentPage,
        pageSize
      );
      if (!response) {
        setErrorConsultations('No se pudieron cargar las consultas');
        setConsultations(null);
      } else {
        setConsultations(response);
      }
      setLoadingConsultations(false);
    };

    fetchConsultations();
  }, [selectedConsultationSpecialist, medicalHistory, currentPage, patientId]);

  const handleAddConsultation = () => {
    console.log('Añadir consulta:');
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

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    console.log('Changing page to:', page);
    setCurrentPage(page);
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
        specialistsWithPermission={specialistsWithPermission}
        selectedConsultationSpecialist={selectedConsultationSpecialist}
        setSelectedConsultationSpecialist={setSelectedConsultationSpecialist}
      />

      {selectedConsultationSpecialist && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ color: '#000000', mb: 2 }}>
            Consultas del Especialista
          </Typography>
          {loadingConsultations ? (
            <Typography variant="body1" sx={{ color: '#000000' }}>
              Cargando consultas...
            </Typography>
          ) : errorConsultations ? (
            <Typography variant="body1" sx={{ color: '#ff0000' }}>
              {errorConsultations}
            </Typography>
          ) : consultations && consultations.Items && consultations.Items.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {consultations.Items.map((consultation) => (
                <Box key={consultation.id} sx={{ p: 2, border: '1px solid #D8D8D8', borderRadius: '8px' }}>
                  <Typography variant="body1" sx={{ color: '#000000', fontWeight: 'bold' }}>
                    Motivo de Consulta: {consultation.reason}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000000' }}>
                    Fecha de Consulta: {new Date(consultation.consultationDate).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000000' }}>
                    Notas del encuentro: {consultation.notes}
                  </Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={consultations.TotalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ color: '#000000' }}>
              Este especialista aún no tiene consultas registradas.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};