/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  deleteSpecialty,
  fetchSpecialties,
} from "../../../services/specialtyService";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { EditSpecialtyModal } from "../EditSpecialtyModal";

interface Specialty {
  id: string;
  typeOfSpecialty: string;
}

interface SpecialtiesTableProps {
  refreshList: () => void;
}

export const SpecialtiesTable: React.FC<SpecialtiesTableProps> = ({
  refreshList,
}) => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(
    null
  );
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<Specialty | null>(
    null
  );

  const loadSpecialties = async () => {
    try {
      const data = await fetchSpecialties();
      setSpecialties(data);
    } catch (err) {
      setError("Error al cargar las especialidades");
    }
  };

  useEffect(() => {
    loadSpecialties();
  }, []);

  useEffect(() => {
    loadSpecialties();
  }, [refreshList]);

  const handleEdit = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setOpenEditModal(true);
  };

  const handleOpenDeleteDialog = (specialty: Specialty) => {
    setSpecialtyToDelete(specialty);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setSpecialtyToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    if (!specialtyToDelete) return;

    try {
      await deleteSpecialty(specialtyToDelete.id);
      loadSpecialties();
      handleCloseDeleteDialog();
    } catch (err) {
      setError("Error al eliminar la especialidad");
    }
  };

  const handleEditSuccess = () => {
    loadSpecialties();
  };

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (specialties.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Typography variant="h6">
          No se encuentra ninguna especialidad
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{ 
            boxShadow: "none", 
            border: "1px solid #e0e0e0",
            borderRadius: '12px', // Bordes redondeados
            overflow: 'hidden',}}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "10%",
                  textAlign: "center",
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "75%",
                  textAlign: "center",
                }}
              >
                Especialidades
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "15%",
                  textAlign: "center",
                }}
              >
                Acción
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialties.map((specialty, index) => (
              <TableRow key={specialty.id}>
                <TableCell
                  sx={{
                    color: "black",
                    padding: "16px 24px",
                    textAlign: "center",
                  }}
                >
                  {index + 1}
                </TableCell>
                <TableCell
                  sx={{
                    color: "black",
                    padding: "16px 24px",
                    textAlign: "center",
                  }}
                >
                  {specialty.typeOfSpecialty}
                </TableCell>
                <TableCell
                  sx={{
                    color: "black",
                    padding: "16px 24px",
                    textAlign: "center",
                  }}
                >
                  <IconButton onClick={() => handleEdit(specialty)}>
                    <FaRegEdit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDeleteDialog(specialty)}>
                    <DeleteOutlineIcon sx={{ color: "red" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <EditSpecialtyModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        onEditSuccess={handleEditSuccess}
        specialty={selectedSpecialty}
      />
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás segura de eliminar la especialidad &#34;
            {specialtyToDelete?.typeOfSpecialty}&#34;?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="error">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
