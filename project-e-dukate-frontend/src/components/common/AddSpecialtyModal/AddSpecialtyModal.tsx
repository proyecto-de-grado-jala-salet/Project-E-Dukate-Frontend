/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/common/AddSpecialtyModal/AddSpecialtyModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { addSpecialty } from '../../../services/specialtyService';

interface AddSpecialtyModalProps {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
}

export const AddSpecialtyModal: React.FC<AddSpecialtyModalProps> = ({ open, onClose, onAddSuccess }) => {
  const [typeOfSpecialty, setTypeOfSpecialty] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Limpiar el estado cuando el modal se cierre
  useEffect(() => {
    if (!open) {
      setTypeOfSpecialty('');
      setError(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!typeOfSpecialty.trim()) {
      setError('El nombre de la especialidad es requerido');
      return;
    }

    try {
      await addSpecialty({ typeOfSpecialty });
      onAddSuccess(); // Llamar al callback para recargar la lista
      onClose(); // Cerrar el modal
    } catch (err) {
      setError('Error al añadir la especialidad');
    }
  };

  const handleCancel = () => {
    setTypeOfSpecialty(''); // Limpiar el campo al cancelar
    setError(null); // Limpiar errores
    onClose(); // Cerrar el modal
  };

  return (
    <Modal open={open} onClose={handleCancel}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2}>
          Añadir Nueva Especialidad
        </Typography>
        <TextField
          label="Nombre de la Especialidad"
          value={typeOfSpecialty}
          onChange={(e) => setTypeOfSpecialty(e.target.value)}
          fullWidth
          error={!!error}
          helperText={error}
          sx={{ mb: 2,
            '& .MuiInputBase-input': {
              color: '#000000', // Cambiar el color del texto a negro
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(0, 0, 0, 0.6)', // Cambiar el color del label a un gris oscuro
            },
          }}
          autoComplete="off" // Evitar que el navegador guarde el valor en caché
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={handleCancel} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Añadir
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};