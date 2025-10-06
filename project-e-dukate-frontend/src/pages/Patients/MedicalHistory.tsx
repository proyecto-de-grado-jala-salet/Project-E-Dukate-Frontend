"use client";

import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useMedicalHistory } from "@/hooks/useMedicalHistory";
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';
import { useNavigation } from '@/contexts/NavigationContext';

const PatientInfo = dynamic(() => 
  import('@/components/MedicalHistory/PatientInfo').then(mod => mod.PatientInfo), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

const SpecialistStatusForm = dynamic(() => 
  import('@/components/MedicalHistory/SpecialistStatusForm').then(mod => mod.SpecialistStatusForm), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

const ConsultationsList = dynamic(() => 
  import('@/components/MedicalHistory/ConsultationsList').then(mod => mod.ConsultationsList), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

export const MedicalHistory: React.FC = () => {
  const [newConsultationId, setNewConsultationId] = useState<string | null>(null);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>("");
  const { setIsNavigating } = useNavigation();
  const {
    medicalHistory,
    patientData,
    specialists,
    specialistsWithPermission,
    selectedSpecialists,
    selectedStatus,
    selectedConsultationSpecialist,
    isStatusDropdownDisabled,
    canEditSelectedSpecialist,
    consultations,
    currentPage,
    loadingConsultations,
    errorConsultations,
    specialistsLoading,
    specialistsError,
    setSelectedSpecialists,
    setSelectedStatus,
    setSelectedConsultationSpecialist,
    setCurrentPage,
    handleAddConsultation,
    refreshConsultations,
  } = useMedicalHistory();
  
  useEffect(() => {
    if (!specialistsLoading && !loadingConsultations) {
      setIsNavigating(false);
    }
  }, [specialistsLoading, loadingConsultations, setIsNavigating]);

  useEffect(() => {
    if (selectedConsultationSpecialist) {
      setSelectedSpecialistId(selectedConsultationSpecialist);
    }
  }, [selectedConsultationSpecialist]);
  
  useEffect(() => {
    if (selectedSpecialistId) {
      setSelectedConsultationSpecialist(selectedSpecialistId);
    }
  }, [selectedSpecialistId, setSelectedConsultationSpecialist]);

  const handleAddConsultationWithId = async () => {
    const consultationId = await handleAddConsultation();
    if (consultationId) {
      setNewConsultationId(consultationId);
    }
  };

  if (specialistsLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (specialistsError) {
    return (
      <Typography variant="h6" sx={{ color: "#000000" }} color="error">
        {specialistsError}
      </Typography>
    );
  }

  if (!medicalHistory || !patientData) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#000000" }}
        >
          Historial Medico {patientData.names} {patientData.lastNamePaternal}
        </Typography>
      </Box>
      <PatientInfo patient={patientData} />
      <SpecialistStatusForm
        specialists={specialists || []}
        selectedSpecialists={selectedSpecialists}
        setSelectedSpecialists={setSelectedSpecialists}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onAddConsultation={handleAddConsultationWithId}
        specialistsWithPermission={specialistsWithPermission}
        selectedConsultationSpecialist={selectedSpecialistId}
        setSelectedConsultationSpecialist={setSelectedSpecialistId}
        isStatusDropdownDisabled={isStatusDropdownDisabled}
        canEditSelectedSpecialist={canEditSelectedSpecialist}
      />
      {selectedSpecialistId && (
        <Box sx={{ mt: 3 }}>
          <ConsultationsList
            consultations={consultations}
            loadingConsultations={loadingConsultations}
            errorConsultations={errorConsultations}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onConsultationsUpdate={refreshConsultations}
            newConsultationId={newConsultationId}
            selectedSpecialistId={selectedSpecialistId}
            canEditSelectedSpecialist={canEditSelectedSpecialist}
          />
        </Box>
      )}
    </Box>
  );
};

export default MedicalHistory;