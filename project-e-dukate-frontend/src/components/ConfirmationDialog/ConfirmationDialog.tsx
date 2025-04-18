import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, SxProps } from '@mui/material';
import { Button } from '../Button';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  sx?: SxProps;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = "Confirmar Acción",
  message,
  confirmLabel = "Aceptar",
  cancelLabel = "Cancelar",
  sx,
}) => (
  <Dialog open={open} onClose={onClose} sx={sx}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button label={cancelLabel} onClick={onClose} color="error" variant="outlined" />
      <Button label={confirmLabel} onClick={onConfirm} color="primary" variant="contained" />
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;