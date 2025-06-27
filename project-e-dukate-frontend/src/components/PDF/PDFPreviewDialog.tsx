/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface PDFPreviewDialogProps {
  open: boolean;
  previewImage: string | null;
  onClose: () => void;
  onConfirm: () => void;
  dialogWidth?: string;
}

export const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({
  open,
  previewImage,
  onClose,
  onConfirm,
  dialogWidth = '612px',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      disableEnforceFocus
      sx={{
        '& .MuiDialog-paper': {
          width: dialogWidth,
          maxHeight: '90vh',
          bgcolor: '#fff',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', color: '#000' }}>Vista Previa del PDF</DialogTitle>
      <DialogContent sx={{ p: 0, overflow: 'auto', maxHeight: '80vh' }}>
        {previewImage ? (
          <TransformWrapper
            initialScale={1}
            minScale={0.5}
            maxScale={3}
            wheel={{ step: 0.1 }}
            doubleClick={{ mode: 'toggle' }}
          >
            <TransformComponent>
              <Box
                sx={{
                  width: '100%',
                  height: 'auto',
                  bgcolor: '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src={previewImage}
                  alt="Vista previa del PDF"
                  style={{
                    width: 'auto',
                    maxWidth: '100%',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </TransformComponent>
          </TransformWrapper>
        ) : (
          <Typography color="error" align="center">
            No se pudo generar la vista previa.
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{ mt: 1, display: 'block', textAlign: 'center' }}
        >
          Usa la rueda del ratón para hacer zoom y arrastra para desplazarte.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: 'red',
            borderColor: 'red',
            borderRadius: '10px',
            '&:hover': {
              borderColor: 'darkred',
              color: 'darkred',
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{ bgcolor: '#f5a623', color: 'black', borderRadius: '10px' }}
        >
          Descargar PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};