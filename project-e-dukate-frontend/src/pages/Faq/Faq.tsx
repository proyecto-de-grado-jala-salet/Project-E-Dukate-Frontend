"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Collapse,
} from "@mui/material";
import { Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon, Edit as EditIcon } from "@mui/icons-material";
import { Pagination } from '@/components/Pagination/Pagination';

export const Faq: React.FC = () => {
  const [faqs, setFaqs] = useState([
    { id: "1", question: "¿Cuánto dura la sesión?", answer: "La sesión dura aproximadamente 1 hora." },
    { id: "2", question: "¿Cuánto es el precio por cada especialidad?", answer: "El precio varía entre $50 y $100 por especialidad." },
    { id: "3", question: "¿Dónde todas las especialidades que tienen?", answer: "Ofrecemos cardiología, neurología y pediatría." },
    { id: "4", question: "¿Cuáles especialidades existen actualmente?", answer: "Existen 5 especialidades actualmente." },
  ]);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const [editedAnswer, setEditedAnswer] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(faqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFaqs = faqs.slice(startIndex, startIndex + itemsPerPage);

  const handleToggleExpand = (id: string) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
    if (expandedFaqId !== id) {
      const faq = faqs.find((f) => f.id === id);
      setEditedQuestion(faq?.question || "");
      setEditedAnswer(faq?.answer || "");
      setEditingFaqId(null);
    }
  };

  const handleEdit = (id: string) => {
    setEditingFaqId(id);
    const faq = faqs.find((f) => f.id === id);
    setEditedQuestion(faq?.question || "");
    setEditedAnswer(faq?.answer || "");
  };

  const handleSaveEdit = (id: string) => {
    setFaqs(
      faqs.map((faq) =>
        faq.id === id ? { ...faq, question: editedQuestion, answer: editedAnswer } : faq
      )
    );
    setEditingFaqId(null);
  };

  const handleDelete = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
    if (expandedFaqId === id) {
      setExpandedFaqId(null);
      setEditedQuestion("");
      setEditedAnswer("");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#000000" }}>
          Preguntas frecuentes
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#F4A601", color: "#000", "&:hover": { backgroundColor: "#e69500" } }}
        >
          Añadir Pregunta
        </Button>
      </Box>

      {currentFaqs.map((faq) => (
        <Box
          key={faq.id}
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "flex-start",
            gap: 1,
            width: "100%",
            mb: 2,
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
              onClick={() => handleToggleExpand(faq.id)}
              sx={{
                py: 2,
                px: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f9f9f9" },
              }}
            >
              {expandedFaqId === faq.id && editingFaqId === faq.id ? (
                <TextField
                  value={editedQuestion}
                  onChange={(e) => setEditedQuestion(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiInputBase-input": { color: "black" },
                    "& .MuiInputLabel-root": { color: "black" },
                    "& .MuiOutlinedInput-root": { borderColor: "#D8D8D8" },
                  }}
                />
              ) : (
                <Typography variant="subtitle1" sx={{ color: "black" }}>
                  {faq.question}
                </Typography>
              )}
              <IconButton size="small" sx={{ color: "black" }}>
                {expandedFaqId === faq.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>

            <Collapse in={expandedFaqId === faq.id}>
              <Box sx={{ p: 3 }}>
                {editingFaqId === faq.id ? (
                  <>
                    <TextField
                      label="Respuesta"
                      value={editedAnswer}
                      onChange={(e) => setEditedAnswer(e.target.value)}
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{
                        mb: 2,
                        "& .MuiInputBase-input": { color: "black" },
                        "& .MuiInputLabel-root": { color: "black" },
                        "& .MuiOutlinedInput-root": { borderColor: "#D8D8D8" },
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Button
                        variant="contained"
                        onClick={() => handleSaveEdit(faq.id)}
                        sx={{ backgroundColor: "#F4A601", color: "#000", "&:hover": { backgroundColor: "#e69500" } }}
                      >
                        Guardar Cambios
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="body1"
                      sx={{ color: "black", mb: 2, whiteSpace: "pre-wrap" }}
                    >
                      {faq.answer}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(faq.id)}
                        sx={{ color: "#000", borderColor: "#D8D8D8", "&:hover": { borderColor: "#F4A601" } }}
                      >
                        Editar
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </Collapse>
          </Box>

          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(faq.id);
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
        </Box>
      ))}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Box>
  );
};

export default Faq;