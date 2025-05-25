/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { PatientInfo } from "@/components/MedicalHistory/PatientInfo";
import { SpecialistStatusForm } from "@/components/MedicalHistory/SpecialistStatusForm";
import { ConsultationsList } from "@/components/MedicalHistory/ConsultationsList";
import { useMedicalHistory } from "@/hooks/useMedicalHistory";

export const MedicalHistory: React.FC = () => {
  const {
    medicalHistory,
    patientData,
    specialists,
    specialistsWithPermission,
    selectedSpecialists,
    selectedStatus,
    selectedConsultationSpecialist,
    isStatusDropdownDisabled,
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

  if (specialistsLoading) {
    return (
      <Typography variant="h6" sx={{ color: "#000000" }}>
        Cargando...
      </Typography>
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
      <Typography variant="h6" sx={{ color: "#000000" }}>
        Cargando...
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <PatientInfo patient={patientData} />
      <SpecialistStatusForm
        specialists={specialists || []}
        selectedSpecialists={selectedSpecialists}
        setSelectedSpecialists={setSelectedSpecialists}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onAddConsultation={handleAddConsultation}
        specialistsWithPermission={specialistsWithPermission}
        selectedConsultationSpecialist={selectedConsultationSpecialist}
        setSelectedConsultationSpecialist={setSelectedConsultationSpecialist}
        isStatusDropdownDisabled={isStatusDropdownDisabled}
      />
      {selectedConsultationSpecialist && (
        <Box sx={{ mt: 3 }}>
          <ConsultationsList
            consultations={consultations}
            loadingConsultations={loadingConsultations}
            errorConsultations={errorConsultations}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onConsultationsUpdate={refreshConsultations}
          />
        </Box>
      )}
    </Box>
  );
};
