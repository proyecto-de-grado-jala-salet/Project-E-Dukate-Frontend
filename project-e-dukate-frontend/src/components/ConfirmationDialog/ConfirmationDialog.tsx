import React from 'react';
import { Dialog} from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { DialogActions } from '@mui/material';
import { SxProps } from '@mui/material';
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
  <Dialog
    open={open}
    onClose={onClose}
    sx={{
      "& .MuiDialog-paper": {
        borderRadius: "10px",
        padding: "16px",
        margin: "24px",
      },
      ...sx,
    }}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        label={cancelLabel}
        onClick={onClose}
        color="error"
        variant="outlined"
      />
      <Button
        label={confirmLabel}
        onClick={onConfirm}
        color="primary"
        variant="contained"
        sx={{ bgcolor: "#f5a623", color: "black" }}
      />
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;