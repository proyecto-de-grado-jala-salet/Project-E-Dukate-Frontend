/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, DialogTitle, Button, Box } from '@mui/material';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';

interface PDFPreviewDialogProps {
  open: boolean;
  previewImage: string | null;
  onClose: () => void;
  onConfirm: () => void;
  dialogWidth?: string;
  initialZoom?: number;
}

export const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({
  open,
  previewImage,
  onClose,
  onConfirm,
  dialogWidth = '1450px',
  initialZoom = 2.1,
}) => {
  const [zoom, setZoom] = useState(initialZoom);
  const imageRef = useRef<HTMLImageElement>(null);

  const minZoom = initialZoom;
  const maxZoom = 3;
  const zoomStep = 0.1;
  const zoomThreshold = initialZoom + 0.1;

  const getTransformOrigin = () => {
    return zoom >= zoomThreshold ? 'top left' : 'top center';
  };

  const getJustifyContent = () => (zoom >= zoomThreshold ? 'flex-start' : 'center');

  useEffect(() => {
    if (open) {
      setZoom(initialZoom);
    }
  }, [initialZoom, open]);

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + zoomStep, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - zoomStep, minZoom));
  };

  const handleClose = () => {
    setZoom(initialZoom);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { maxWidth: dialogWidth, overflow: 'auto', maxHeight: '90vh' },
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', color: '#000' }}>
        Vista Previa del PDF
      </DialogTitle>
      <DialogContent
        sx={{
          p: 0,
          position: 'relative',
          overflow: 'auto',
        }}
      >
        {previewImage ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: getJustifyContent(),
              alignItems: 'flex-start',
              minHeight: '100%',
              transition: 'justify-content 1.3s ease',
              paddingLeft: zoom >= zoomThreshold ? '16px' : '0',
            }}
          >
            <Box
              sx={{
                transform: `scale(${zoom})`,
                transformOrigin: getTransformOrigin(),
                transition: 'transform 0.9s ease',
              }}
            >
              <img
                ref={imageRef}
                src={previewImage}
                alt="PDF Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  userSelect: 'none',
                }}
              />
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            No hay vista previa disponible
          </Box>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'flex-end',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 2,
          pb: 3,
          pr: 3,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FiZoomIn
            size={20}
            color="#000000"
            onClick={handleZoomIn}
            style={{ cursor: 'pointer' }}
          />
          <FiZoomOut
            size={20}
            color="#000000"
            onClick={handleZoomOut}
            style={{ cursor: 'pointer' }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={handleClose}
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
        </Box>
      </DialogActions>
    </Dialog>
  );
};