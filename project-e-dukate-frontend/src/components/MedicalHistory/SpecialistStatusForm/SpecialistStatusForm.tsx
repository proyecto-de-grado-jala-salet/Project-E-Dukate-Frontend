import React, { useRef } from "react";
import { Box, Button } from "@mui/material";
import { Specialist } from "@/types/userTypes";
import { SpecialistSelect } from "@/components/MedicalHistory/SpecialistSelect";
import { StatusSelectWithButton } from "@/components/MedicalHistory/StatusSelectWithButton";
import { useAuthStore } from "@/stores/authStore";
import { useMedicalHistory } from "@/hooks/useMedicalHistory";
import { showNotification } from "@/services/notificationService";

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
  const { handleUploadDocument } = useMedicalHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      await handleUploadDocument(selectedFile);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      showNotification("Por favor selecciona un archivo PDF", "error");
    }
  };

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
          onChange={(value) => {
            setSelectedConsultationSpecialist(value);
          }}
          width={250}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
        {canEditSelectedSpecialist && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              onClick={handleUpload}
              sx={{
                backgroundColor: "#F4A601",
                color: "#000",
                borderRadius: "10px",
                px: 3,
                py: 1,
                "&:hover": { backgroundColor: "#e69500" },
              }}
            >
              Subir PDF
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};