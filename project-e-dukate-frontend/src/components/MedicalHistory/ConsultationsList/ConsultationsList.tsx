"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Pagination,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { apiRequest } from "@/services/api";

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
  onConsultationsUpdate: () => void;
}

export const ConsultationsList: React.FC<ConsultationsListProps> = ({
  consultations,
  loadingConsultations,
  errorConsultations,
  currentPage,
  onPageChange,
  onConsultationsUpdate,
}) => {
  const [expandedConsultationId, setExpandedConsultationId] = useState<
    string | null
  >(null);
  const [editorContent, setEditorContent] = useState<string>("");

  // Limpieza de elementos DeepL si existen
  useEffect(() => {
    const cleanupDeepL = () => {
      document
        .querySelectorAll('deepl-input-selection-trigger, [class*="dl-"]')
        .forEach((el) => el.remove());
    };
    cleanupDeepL();
    const observer = new MutationObserver(cleanupDeepL);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (loadingConsultations) {
    return (
      <Typography variant="body1" sx={{ color: "black" }}>
        Cargando consultas...
      </Typography>
    );
  }

  if (errorConsultations) {
    return (
      <Typography variant="body1" sx={{ color: "black" }}>
        {errorConsultations}
      </Typography>
    );
  }

  if (!consultations?.Items?.length) {
    return (
      <Typography variant="body1" sx={{ color: "black" }}>
        Este especialista aún no tiene consultas registradas.
      </Typography>
    );
  }

  const handleToggleExpand = (id: string) => {
    if (expandedConsultationId === id) {
      setExpandedConsultationId(null);
      setEditorContent("");
    } else {
      setExpandedConsultationId(id);
      const consultation = consultations.Items.find((c) => c.id === id);
      setEditorContent(consultation?.notes || "");
    }
  };

  const handleDelete = async (consultationId: string) => {
    try {
      await apiRequest<void>(
        "medicalconsultations",
        "DELETE",
        undefined,
        consultationId
      );
      onConsultationsUpdate();
    } catch (error) {
      console.error("Error deleting consultation:", error);
    }
  };

  const handleSave = async (consultationId: string) => {
    const consultation = consultations.Items.find(
      (c) => c.id === consultationId
    );
    if (!consultation) return;

    try {
      await apiRequest<void>(
        "medicalconsultations",
        "PUT",
        {
          reason:
            (
              document.getElementById(
                `reason-${consultationId}`
              ) as HTMLInputElement
            )?.value || consultation.reason,
          consultationDate: consultation.consultationDate,
          notes: editorContent,
        },
        consultationId
      );

      setExpandedConsultationId(null);
      setEditorContent("");
      onConsultationsUpdate();
    } catch (error) {
      console.error("Error updating consultation:", error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {consultations.Items.map((consultation, index) => (
        <Box
          key={consultation.id}
          sx={{
            border: "1px solid #D8D8D8",
            borderRadius: "8px",
            backgroundColor: "#fff",
            overflow: "hidden",
          }}
        >
          {/* Encabezado de la consulta */}
          <Box
            onClick={() => handleToggleExpand(consultation.id)}
            sx={{
              py: 2,
              px: 5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor:
                expandedConsultationId === consultation.id ? "#fff" : "#fff",
              "&:hover": { backgroundColor: "#f9f9f9" },
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ color: "black" }}
            >
              {`Consulta ${index + 1}`}
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" sx={{ color: "black" }}>
                {new Date(consultation.consultationDate).toLocaleDateString(
                  "es-ES",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </Typography>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(consultation.id);
                }}
                size="small"
                sx={{ "&:hover": { color: "error.main" } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {expandedConsultationId === consultation.id && (
            <Box sx={{ py: 2, px: 5 }}>
              <TextField
                label="Motivo de Consulta"
                id={`reason-${consultation.id}`}
                defaultValue={consultation.reason}
                fullWidth
                required
                sx={{
                  mb: 2,
                  "& .MuiInputBase-input": {
                    color: "black",
                  },
                  "& .MuiInputLabel-root": {
                    color: "black",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#D8D8D8",
                    },
                  },
                }}
                variant="outlined"
                size="small"
              />

              <Box
                sx={{
                  border: "1px solid #D8D8D8",
                  borderRadius: "4px",
                  overflow: "hidden",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #D8D8D8",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    sx={{ color: "black" }}
                  >
                    NOTAS DEL ENCUENTRO
                  </Typography>
                </Box>

                <Box sx={{ py: 1, px: 0, color: "#000" }}>
                  <SimpleEditor
                    content={editorContent}
                    onUpdate={(content) => setEditorContent(content)}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Button
                  variant="contained"
                  onClick={() => handleSave(consultation.id)}
                  sx={{
                    backgroundColor: "#F4A601",
                    color: "#000",
                    "&:hover": { backgroundColor: "#e69500" },
                  }}
                >
                  Guardar Cambios
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      ))}
      {consultations && consultations.TotalPages > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            position: "sticky",
            bottom: 16,
            py: 2,
            zIndex: 1,
          }}
        >
          <Pagination
            count={consultations.TotalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "text.primary",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};
