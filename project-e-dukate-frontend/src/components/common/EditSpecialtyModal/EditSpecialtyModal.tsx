/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/common/EditSpecialtyModal/EditSpecialtyModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { updateSpecialty } from '../../../services/specialtyService';

interface EditSpecialtyModalProps {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  specialty: { id: string; typeOfSpecialty: string } | null;
}

export const EditSpecialtyModal: React.FC<EditSpecialtyModalProps> = ({ open, onClose, onEditSuccess, specialty }) => {
  const [typeOfSpecialty, setTypeOfSpecialty] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Prellenar el campo con el valor actual de la especialidad
  useEffect(() => {
    if (open && specialty) {
      setTypeOfSpecialty(specialty.typeOfSpecialty);
    }
  }, [open, specialty]);

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

    if (!specialty) return;

    try {
      await updateSpecialty(specialty.id, { typeOfSpecialty });
      onEditSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar la especialidad');
    }
  };

  const handleCancel = () => {
    setTypeOfSpecialty('');
    setError(null);
    onClose();
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
          Editar Especialidad
        </Typography>
        <TextField
          label="Nombre de la Especialidad"
          value={typeOfSpecialty}
          onChange={(e) => setTypeOfSpecialty(e.target.value)}
          fullWidth
          error={!!error}
          helperText={error}
          sx={{
            mb: 2,
            '& .MuiInputBase-input': {
              color: '#000000',
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(0, 0, 0, 0.6)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#000000',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: '#000000',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#000000',
              },
            },
          }}
          autoComplete="off"
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={handleCancel} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};