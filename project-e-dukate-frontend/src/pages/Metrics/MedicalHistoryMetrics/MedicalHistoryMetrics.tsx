/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { GenericFilterContainer } from '@/components/GenericFilters';
import { MedicalHistoryMetricsCharts } from '@/components/Metrics/MedicalHistoryMetrics';
import { fetchMedicalHistoryMetrics } from '@/services/metricsService';
import { MedicalHistoryFilterDto } from '@/types/medicalHistory';
import { MedicalHistoryMetricsDto } from '@/types/medicalHistory';
import { statuses } from '@/utils/medicalHistoryConstants';
import { formatStatusLabel } from '@/utils/medicalHistoryConstants';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export const MedicalHistoryMetrics: React.FC = () => {
  const [filter, setFilter] = useState<MedicalHistoryFilterDto>({});
  const [metricsData, setMetricsData] = useState<MedicalHistoryMetricsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const statusOptions = statuses.map(status => ({
    value: status,
    label: formatStatusLabel(status),
  }));

  const dayOptions = Array.from({ length: 31 }, (_, index) => ({
    value: (index + 1).toString(),
    label: (index + 1).toString(),
  }));

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      const data = await fetchMedicalHistoryMetrics(filter);
      setMetricsData(data);
      setLoading(false);
    };
    fetchMetrics();
  }, [filter]);

  const handleFilterChange = (field: keyof MedicalHistoryFilterDto) => (value: string | string[]) => {
    setFilter(prev => {
      if (field === 'Statuses') {
        const newStatuses = Array.isArray(value) ? value : [];
        return { ...prev, Statuses: newStatuses.length > 0 ? newStatuses : undefined };
      }
      const newValue = value ? parseInt(value as string) : undefined;
      return { ...prev, [field]: newValue };
    });
  };

  const filterConfig = [
    {
      type: 'year' as const,
      label: 'Año',
      value: filter.Year?.toString() || '',
      onChange: handleFilterChange('Year'),
    },
    {
      type: 'month' as const,
      label: 'Mes',
      value: filter.Month?.toString() || '',
      onChange: handleFilterChange('Month'),
    },
    {
      type: 'dropdown' as const,
      label: 'Día',
      value: filter.Day?.toString() || '',
      onChange: handleFilterChange('Day'),
      options: dayOptions,
    },
    {
      type: 'multi-select' as const,
      label: 'Estado',
      value: filter.Statuses || [],
      onChange: handleFilterChange('Statuses'),
      options: statusOptions,
    },
  ];

  const handleDownloadPDF = async () => {
    if (!pdfContentRef.current) {
      console.error('Error: pdfContentRef no está definido');
      alert('Error: No se pudo generar la vista previa. El contenedor de PDF no está disponible.');
      return;
    }

    try {
      setIsGeneratingPDF(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); 

      console.log('Capturando pdfContentRef:', pdfContentRef.current);
      const canvas = await html2canvas(pdfContentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: true,
        width: 1357,
        height: pdfContentRef.current.scrollHeight,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      setPreviewImage(imgData);
      setPreviewOpen(true);
    } catch (error) {
      console.error('Error generando vista previa:', error);
      alert('Error al generar la vista previa. Revisa la consola para más detalles.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleConfirmDownload = () => {
    if (!previewImage) {
      console.error('Error: No hay imagen para generar el PDF');
      alert('Error: No hay imagen disponible para generar el PDF.');
      return;
    }

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1357, 1357 * (12 / 8.5)],
      });

      const img = new Image();
      img.src = previewImage;
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 45;
      const imgWidth = img.width;
      const imgHeight = img.height;
      const ratio = Math.min((pdfWidth - 2 * margin) / imgWidth, (pdfHeight - 2 * margin) / imgHeight);
      const scaledWidth = imgWidth * ratio;
      let scaledHeight = imgHeight * ratio;

      const pageHeight = (pdfHeight - 2 * margin) / ratio;
      let yOffset = 0;

      while (yOffset < imgHeight) {
        if (yOffset > 0) {
          pdf.addPage();
        }
        pdf.addImage(
          previewImage,
          'JPEG',
          margin,
          margin,
          scaledWidth,
          Math.min(scaledHeight, pdfHeight - 2 * margin),
          undefined,
          'FAST',
          0,
        );
        yOffset += pageHeight;
        scaledHeight -= (pdfHeight - 2 * margin);
      }

      pdf.save('MedicalHistoryMetrics_Report.pdf');
      setPreviewOpen(false);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Revisa la consola para más detalles.');
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewImage(null);
  };

  return (
    <>
      <Box sx={{ p: 3 }} ref={componentRef}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
            Métricas de Historiales Médicos
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#f5a623', color: 'black', borderRadius: '10px' }}
            onClick={handleDownloadPDF}
          >
            Descargar en PDF
          </Button>
        </Box>
        <GenericFilterContainer
          filters={filterConfig}
          onResetFilters={() => setFilter({})}
        />
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography color="error" sx={{ my: 2 }}>
            {error}
          </Typography>
        )}
        {!loading && !error && metricsData && (
          <MedicalHistoryMetricsCharts metricsData={metricsData} />
        )}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          left: '-9999px',
          top: '-9999px',
          width: '1357px',
          height: 'auto',
          visibility: isGeneratingPDF ? 'visible' : 'hidden',
        }}
        ref={pdfContentRef}
      >
        <Box sx={{ p: 3, backgroundColor: '#ffffff' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
            Métricas de Historiales Médicos
          </Typography>
          {!loading && !error && metricsData && (
            <MedicalHistoryMetricsCharts metricsData={metricsData} />
          )}
        </Box>
      </Box>
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth={false}
        disableEnforceFocus
        sx={{
          '& .MuiDialog-paper': {
            width: '850px',
            maxHeight: '90vh',
            bgcolor: '#fff',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#000' }}>Vista Previa del PDF</DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
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
                    width: '880px',
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
                      width: '100%',
                      maxHeight: '73vh',
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
          <Typography variant="body2" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
            Usa la rueda del ratón para hacer zoom y arrastra para desplazarte.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePreview}
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
            onClick={handleConfirmDownload}
            variant="contained"
            color="primary"
            sx={{ bgcolor: '#f5a623', color: 'black', borderRadius: '10px' }}
          >
            Descargar PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MedicalHistoryMetrics;