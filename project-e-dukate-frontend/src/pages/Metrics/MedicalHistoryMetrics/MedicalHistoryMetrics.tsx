"use client";

import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { fetchMedicalHistoryMetrics } from '@/services/metricsService';
import { MedicalHistoryFilterDto, MedicalHistoryMetricsDto } from '@/types/medicalHistory';
import { statuses, formatStatusLabel } from '@/utils/medicalHistoryConstants';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import { PDFPreviewDialog } from '@/components/PDF';
import dynamic from 'next/dynamic';

const GenericFilterContainer = dynamic(() => 
  import('@/components/GenericFilters/GenericFilterContainer').then(mod => mod.GenericFilterContainer), 
  {
    loading: () => <>
        <CircularProgress /> 
        <br/>
      </>,
    ssr: false
  }
);

const MedicalHistoryMetricsCharts = dynamic(() => 
  import('@/components/Metrics/MedicalHistoryMetrics/MedicalHistoryMetricsCharts').then(mod => mod.MedicalHistoryMetricsCharts), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

export const MedicalHistoryMetrics: React.FC = () => {
  const [filter, setFilter] = useState<MedicalHistoryFilterDto>({});
  const [metricsData, setMetricsData] = useState<MedicalHistoryMetricsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const {
    previewOpen,
    previewImage,
    isCapturing,
    handleGeneratePDF,
    handleConfirmDownload,
    handleClosePreview,
  } = usePDFGenerator({ contentRef: pdfContentRef, fileName: 'Informe_de_métricas_del_historial_médico' });

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
            onClick={handleGeneratePDF}
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
          visibility: isCapturing ? 'visible' : 'hidden',
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
      <PDFPreviewDialog
        open={previewOpen}
        previewImage={previewImage}
        onClose={handleClosePreview}
        onConfirm={handleConfirmDownload}
        dialogWidth="1450px"
        initialZoom={1.6}
      />
    </>
  );
};

export default MedicalHistoryMetrics;