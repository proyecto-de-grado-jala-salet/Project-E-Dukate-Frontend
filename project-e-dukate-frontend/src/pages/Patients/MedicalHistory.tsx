/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { useEditStore } from '@/stores/editStore';
import { MedicalHistoryDto } from '@/types/medicalHistory';
import { Patient, Specialist } from '@/types/userTypes';
import { PatientInfo } from '@/components/PatientInfo';
import { SpecialistStatusForm } from '@/components/SpecialistStatusForm';
import { getMedicalHistoryByPatientId, updatePermission, deletePermission, updateMedicalHistoryStatus, getSpecialistConsultations } from '@/services/medicalHistoryService';
import { apiRequest } from '@/services/api';
import { showNotification } from '@/services/notificationService';

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
  const [selectedStatus, setSelectedStatus] = useState<string>(''); // Inicializar como vacío
  const [selectedConsultationSpecialist, setSelectedConsultationSpecialist] = useState<string>('');
  const [isStatusDropdownDisabled, setIsStatusDropdownDisabled] = useState<boolean>(true); // Controlar estado del dropdown
  const [consultations, setConsultations] = useState<PaginatedConsultations | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [errorConsultations, setErrorConsultations] = useState<string | null>(null);
  const pageSize = 10;
  const { data: specialists, loading: specialistsLoading, error: specialistsError } = useApi<Specialist>('specialists');

  useEffect(() => {
    if (!patientId || entityType !== 'patient') {
      showNotification('Invalid patient or entityType', "error");
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
        setConsultations(null);
        setSelectedConsultationSpecialist('');
        setSelectedStatus('');
        setIsStatusDropdownDisabled(true);
        setCurrentPage(1);
      } else {
        setMedicalHistory(null);
        setConsultations(null);
        setSelectedConsultationSpecialist('');
        setSelectedStatus('');
        setIsStatusDropdownDisabled(true);
      }
    };

    const fetchPatientData = async () => {
      try {
        const patient = await apiRequest<Patient>('patients', 'GET', undefined, patientId);
        setPatientData(patient);
      } catch (error) {
        showNotification('Error fetching patient data', "error");
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
      setConsultations(null);
      setSelectedStatus('');
      setIsStatusDropdownDisabled(true);
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
        setConsultations(null);
        setSelectedStatus('');
        setIsStatusDropdownDisabled(true);
        setErrorConsultations('No se encontraron permisos válidos para este especialista');
        setLoadingConsultations(false);
        return;
      }
      setSelectedStatus(permission.status);
      setIsStatusDropdownDisabled(false);

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
    if (!medicalHistory || !patientId || !selectedConsultationSpecialist) {
      showNotification('Cannot update status', "error");
      return;
    }

    await updateMedicalHistoryStatus(medicalHistory.id, selectedConsultationSpecialist, newStatus);
    setSelectedStatus(newStatus);

    const updatedHistory = await getMedicalHistoryByPatientId(patientId);
    if (updatedHistory) {
      setMedicalHistory(updatedHistory);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
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
        isStatusDropdownDisabled={isStatusDropdownDisabled}
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