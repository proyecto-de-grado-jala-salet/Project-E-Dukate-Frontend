/*
 * Este archivo utiliza la plantilla Simple Editor de Tiptap, que está bajo la licencia MIT.
 * Copyright (c) 2021-present, ueberdosis and contributors
 * Ver THIRD-PARTY-LICENSES.md para el texto completo de la licencia.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { SimpleEditor } from "@/components/tiptap/tiptap-templates/simple/simple-editor";
import { apiRequest } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { useMedicalHistory } from "@/hooks/useMedicalHistory";
import { showNotification } from "@/services/notificationService";

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
  newConsultationId?: string | null;
}

export const ConsultationsList: React.FC<ConsultationsListProps> = ({
  consultations,
  loadingConsultations,
  errorConsultations,
  currentPage,
  onPageChange,
  onConsultationsUpdate,
  newConsultationId,
}) => {
  const [expandedConsultationId, setExpandedConsultationId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const { userRole, userId } = useAuthStore();
  const { medicalHistory } = useMedicalHistory();

  useEffect(() => {
    if (newConsultationId) {
      setExpandedConsultationId(newConsultationId);
      setEditorContent("");
    }
  }, [newConsultationId]);

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
      if (expandedConsultationId === consultationId) {
        setExpandedConsultationId(null);
        setEditorContent("");
      }
    } catch (error) {
      showNotification("Error al eliminar la consulta", "error");
    }
  };

  const handleSave = async (consultationId: string) => {
    const consultation = consultations.Items.find((c) => c.id === consultationId);
    if (!consultation) return;

    const updatedReason =
      (document.getElementById(`reason-${consultationId}`) as HTMLInputElement)?.value ||
      consultation.reason;
    const updatedNotes = editorContent;

    try {
      await apiRequest<void>(
        "medicalconsultations",
        "PUT",
        {
          reason: updatedReason,
          consultationDate: consultation.consultationDate,
          notes: updatedNotes,
        },
        consultationId
      );

      setEditorContent(updatedNotes);
      onConsultationsUpdate();
    } catch (error) {
      showNotification("Error al actualizar la consulta", "error");
    }
  };

  const canEditConsultation = (consultation: Consultation) => {
    if (userRole === "Administrator") {
      return false;
    }
    if (userRole === "Specialist" && userId) {
      const permission = medicalHistory?.permissions.find(
        (p) => p.specialistId === userId && p.canEdit
      );
      return consultation.specialistId === userId && !!permission;
    }
    return false;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {consultations.Items.map((consultation, index) => {
        const isEditable = canEditConsultation(consultation);

        return (
          <Box
            key={consultation.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              alignItems: "flex-start",
              gap: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                border: "1px solid #D8D8D8",
                borderRadius: "8px",
                backgroundColor: "#fff",
                overflow: "hidden",
                width: "100%",
              }}
            >
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
              </Box>

              {expandedConsultationId === consultation.id && (
                <Box sx={{ py: 2, px: 5 }}>
                  <TextField
                    label="Motivo de Consulta"
                    id={`reason-${consultation.id}`}
                    defaultValue={consultation.reason}
                    fullWidth
                    required
                    disabled={!isEditable}
                    sx={{
                      mb: 2,
                      "& .MuiInputBase-input": { color: "black" },
                      "& .MuiInputLabel-root": { color: "black" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#D8D8D8" },
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
                        editable={isEditable}
                      />
                    </Box>
                  </Box>

                  {isEditable && (
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, gap: 1 }}>
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
                  )}
                </Box>
              )}
            </Box>

            {isEditable && (
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(consultation.id);
                }}
                size="medium"
                sx={{
                  ml: 1,
                  alignSelf: "flex-start",
                  margin: "10px 0px 0px 0px",
                  color: "#000",
                  "&:hover": { color: "error.main" },
                }}
              >
                <DeleteIcon fontSize="medium" />
              </IconButton>
            )}
          </Box>
        );
      })}
      {consultations && consultations.TotalPages > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            mt: 2,
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
              "& .MuiPaginationItem-root": { color: "text.primary" },
            }}
          />
        </Box>
      )}
    </Box>
  );
};
