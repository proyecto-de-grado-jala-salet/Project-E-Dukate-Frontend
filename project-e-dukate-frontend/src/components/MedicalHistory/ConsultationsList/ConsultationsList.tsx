import React from "react";
import { Box, Typography, Pagination } from "@mui/material";

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

interface ConsultationsListProps {
  consultations: PaginatedConsultations | null;
  loadingConsultations: boolean;
  errorConsultations: string | null;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const ConsultationsList: React.FC<ConsultationsListProps> = ({
  consultations,
  loadingConsultations,
  errorConsultations,
  currentPage,
  onPageChange,
}) => {
  if (loadingConsultations) {
    return (
      <Typography variant="body1" sx={{ color: "#000000" }}>
        Cargando consultas...
      </Typography>
    );
  }

  if (errorConsultations) {
    return (
      <Typography variant="body1" sx={{ color: "#ff0000" }}>
        {errorConsultations}
      </Typography>
    );
  }

  if (
    !consultations ||
    !consultations.Items ||
    consultations.Items.length === 0
  ) {
    return (
      <Typography variant="body1" sx={{ color: "#000000" }}>
        Este especialista aún no tiene consultas registradas.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {consultations.Items.map((consultation) => (
        <Box
          key={consultation.id}
          sx={{
            p: 2,
            border: "1px solid #D8D8D8",
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="body1"
            sx={{ color: "#000000", fontWeight: "bold" }}
          >
            Motivo de Consulta: {consultation.reason}
          </Typography>
          <Typography variant="body1" sx={{ color: "#000000" }}>
            Fecha de Consulta:{" "}
            {new Date(consultation.consultationDate).toLocaleString()}
          </Typography>
          <Typography variant="body1" sx={{ color: "#000000" }}>
            Notas del encuentro: {consultation.notes}
          </Typography>
        </Box>
      ))}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={consultations.TotalPages}
          page={currentPage}
          onChange={(event, page) => onPageChange(page)}
          color="primary"
        />
      </Box>
    </Box>
  );
};
