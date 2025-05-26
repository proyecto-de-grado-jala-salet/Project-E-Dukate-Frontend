import React from "react";
import { Box } from "@mui/material";
import { Specialist } from "@/types/userTypes";
import { SpecialistSelect } from "@/components/MedicalHistory/SpecialistSelect";
import { StatusSelectWithButton } from "@/components/MedicalHistory/StatusSelectWithButton";
import { useAuthStore } from "@/stores/authStore";

interface SpecialistStatusFormProps {
  specialists: Specialist[];
  selectedSpecialists: string[];
  setSelectedSpecialists: (specialists: string[]) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onAddConsultation: () => void;
  specialistsWithPermission: Specialist[];
  selectedConsultationSpecialist: string;
  setSelectedConsultationSpecialist: (specialistId: string) => void;
  isStatusDropdownDisabled: boolean;
  canEditSelectedSpecialist: boolean;
}

export const SpecialistStatusForm: React.FC<SpecialistStatusFormProps> = ({
  specialists,
  selectedSpecialists,
  setSelectedSpecialists,
  selectedStatus,
  setSelectedStatus,
  onAddConsultation,
  specialistsWithPermission,
  selectedConsultationSpecialist,
  setSelectedConsultationSpecialist,
  isStatusDropdownDisabled,
  canEditSelectedSpecialist,
}) => {
  const { userRole } = useAuthStore();

  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {userRole !== "Specialist" && (
          <SpecialistSelect<string[]>
            label="Permisos para editar"
            specialists={specialists}
            value={selectedSpecialists}
            onChange={setSelectedSpecialists}
            multiple
            width={290}
          />
        )}
        <SpecialistSelect<string>
          label="Ver consulta del Prof. Especialista"
          specialists={specialistsWithPermission}
          value={selectedConsultationSpecialist}
          onChange={setSelectedConsultationSpecialist}
          width={250}
        />
      </Box>
      <StatusSelectWithButton
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        onAddConsultation={onAddConsultation}
        isStatusDropdownDisabled={isStatusDropdownDisabled}
        isAddButtonDisabled={!selectedSpecialists.length || !selectedStatus}
        width={250}
        userRole={userRole}
        canEditSelectedSpecialist={canEditSelectedSpecialist}
      />
    </Box>
  );
};