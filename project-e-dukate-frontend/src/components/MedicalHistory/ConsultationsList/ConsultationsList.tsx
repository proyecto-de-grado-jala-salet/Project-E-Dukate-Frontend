/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Este archivo utiliza la plantilla Simple Editor de Tiptap, que está bajo la licencia MIT.
 * Copyright (c) 2021-present, ueberdosis and contributors
 * Ver THIRD-PARTY-LICENSES.md para el texto completo de la licencia.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { FaRegEye } from "react-icons/fa6";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { SimpleEditor } from "@/components/tiptap/tiptap-templates/simple/simple-editor";
import { apiRequest, API_ENDPOINTS, getAuthToken } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { useMedicalHistory } from "@/hooks/useMedicalHistory";
import { showNotification } from "@/services/notificationService";
import { PDFViewer } from "@/components/PdfViewer/PdfViewer";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";

interface Consultation {
  id: string;
  reason: string;
  consultationDate: string;
  notes: string;
  specialistId: string;
}

interface Document {
  id: string;
  fileName: string;
  uploadDate: string;
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
  selectedSpecialistId: string;
  canEditSelectedSpecialist: boolean;
}

export const ConsultationsList: React.FC<ConsultationsListProps> = ({
  consultations,
  loadingConsultations,
  errorConsultations,
  currentPage,
  onPageChange,
  onConsultationsUpdate,
  newConsultationId,
  selectedSpecialistId,
  canEditSelectedSpecialist,
}) => {
  const [expandedConsultationId, setExpandedConsultationId] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const { userRole, userId } = useAuthStore();
  const { medicalHistory, handleDeleteDocument, handleUploadDocument, loadingDocuments, refreshDocuments } = useMedicalHistory();
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setIsUploading(true);
      
      try {
        await handleUploadDocument(selectedFile);
        await refreshDocuments();
        
      } catch (error) {
        showNotification("Error al subir el documento", "error");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      showNotification("Por favor selecciona un archivo PDF", "error");
    }
  };

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

  const handleToggleExpand = (id: string) => {
    if (expandedConsultationId === id) {
      setExpandedConsultationId(null);
      setEditorContent("");
    } else {
      setExpandedConsultationId(id);
      const consultation = consultations!.Items.find((c) => c.id === id);
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
    const consultation = consultations!.Items.find((c) => c.id === consultationId);
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

  const handleViewDocument = async (documentId: string) => {
    const token = getAuthToken();
    const url = `${API_ENDPOINTS.medicalconsultations}/documents/${documentId}`;
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("No tienes permisos para ver este documento.");
        } else if (response.status === 404) {
          throw new Error("El documento no se encontró en el servidor.");
        } else {
          throw new Error(`Error al obtener el PDF: ${response.statusText}`);
        }
      }
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setPdfUrl(blobUrl);
      setShowPDFViewer(true);
    } catch (error: any) {
      console.error("Error viewing document:", error);
      showNotification(error.message || "Error al cargar el PDF", "error");
    }
  };

  const documents = medicalHistory?.permissions
    .find((p) => p.specialistId === selectedSpecialistId)
    ?.documents || [];
  
  const selectedPermission = medicalHistory?.permissions.find(
    (p) => p.specialistId === selectedSpecialistId
  );

  const canDeleteDocument = userRole === "Administrator" || (
    userRole === "Specialist" &&
    userId === selectedSpecialistId &&
    selectedPermission?.canEdit
  );

  return (
    <Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {consultations?.Items?.length ? (
          <>
            {consultations?.Items.map((consultation, index) => {
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
                          expandedConsultationId === consultation.id
                            ? "#fff"
                            : "#fff",
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
                        {new Date(
                          consultation.consultationDate
                        ).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              mt: 1,
                              gap: 1,
                            }}
                          >
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
          </>
        ) : (
          <Typography variant="body1" sx={{ color: "black", mb: 2 }}>
            Este especialista aún no tiene consultas registradas.
          </Typography>
        )}
      </Box>

      {selectedSpecialistId && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between",
            alignItems: "center", 
            mb: 2 
          }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "black" }}>
              Documentos Médicos
            </Typography>
            
            {canEditSelectedSpecialist && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  disabled={isUploading}
                />
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={isUploading}
                  startIcon={<HiOutlineDocumentArrowUp size={20} />}
                  sx={{
                    backgroundColor: isUploading ? "#cccccc" : "#F4A601",
                    color: "#000",
                    borderRadius: "10px",
                    px: 3,
                    py: 1,
                    fontSize: "14px",
                    "&:hover": { 
                      backgroundColor: isUploading ? "#cccccc" : "#e69500" 
                    },
                    "& .MuiButton-startIcon": {
                      marginRight: 1,
                    }
                  }}
                >
                  {isUploading ? "Subiendo..." : "Añadir PDF"}
                </Button>
              </Box>
            )}
          </Box>
          {loadingDocuments ? (
            <Typography variant="body1" sx={{ color: "black" }}>
              Cargando documentos...
            </Typography>
          ) : documents.length > 0 ? (
            <List>
              {documents.map((doc) => (
                <ListItem
                  key={doc.id}
                  sx={{ borderBottom: "1px solid #8B8989", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <BsFillFileEarmarkPdfFill size={26} color="#FF0000" />
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "left" }}>
                      <Typography sx={{ color: "black" }}>{doc.fileName}</Typography>
                      <Typography variant="body2" sx={{ color: "black" }}>
                        {new Date(doc.uploadDate).toLocaleDateString("es-ES")}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Vista Previa" placement="bottom">
                      <IconButton onClick={() => handleViewDocument(doc.id)}>
                        <FaRegEye />
                      </IconButton>
                    </Tooltip>
                    {canDeleteDocument && (
                      <Tooltip title="Eliminar" placement="bottom">
                        <IconButton onClick={() => handleDeleteDocument(doc.id)}>
                          <DeleteOutlineIcon sx={{ color: "red" }} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={{ color: "black" }}>
              No hay documentos registrados para este especialista.
            </Typography>
          )}
        </Box>
      )}

      {showPDFViewer && pdfUrl && (
        <PDFViewer fileUrl={pdfUrl} onClose={() => setShowPDFViewer(false)} />
      )}
    </Box>
  );
};