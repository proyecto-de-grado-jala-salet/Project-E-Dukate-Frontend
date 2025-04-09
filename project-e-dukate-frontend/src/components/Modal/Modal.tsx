import React from 'react';
import { Modal as MuiModal, Box, Typography, SxProps } from '@mui/material';
import { Button } from '../Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  sx?: SxProps;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  sx,
}) => (
  <MuiModal open={open} onClose={onClose}>
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
        ...sx,
      }}
    >
      <Typography variant="h6" mb={2}>{title}</Typography>
      {children}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
        <Button label={cancelLabel} onClick={onClose} variant="outlined" />
        {onSubmit && <Button label={submitLabel} onClick={onSubmit} variant="contained" color="primary" />}
      </Box>
    </Box>
  </MuiModal>
);

export default Modal;