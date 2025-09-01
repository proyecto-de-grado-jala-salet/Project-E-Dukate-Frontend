"use client";

import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { GenericFilterContainer } from '@/components/GenericFilters';
import { DemographicMetricsCharts } from '@/components/Metrics/DemographicMetrics';
import { fetchDemographicMetrics } from '@/services/demographicMetricsService';
import { FilterOption } from '@/types/filterOption';
import { DemographicFilterDto, DemographicMetricsDto } from '@/types/metricas';
import { usePDFGenerator } from '@/hooks/usePDFGenerator';
import { PDFPreviewDialog } from '@/components/PDF';

export const DemographicMetrics: React.FC = () => {
  const [filter, setFilter] = useState<DemographicFilterDto>({});
  const [metricsData, setMetricsData] = useState<DemographicMetricsDto | null>(null);
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
  } = usePDFGenerator({ contentRef: pdfContentRef, fileName: 'Informe_de_métricas_demográficas' });

  const genderOptions: FilterOption[] = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' },
  ];

  const ageOptions: FilterOption[] = [
    { value: '0', label: '0' },
    { value: '10', label: '10' },
    { value: '20', label: '20' },
    { value: '30', label: '30' },
    { value: '40', label: '40' },
    { value: '50', label: '50' },
    { value: '60', label: '60' },
    { value: '70', label: '70' },
    { value: '80', label: '80' },
    { value: '90', label: '90' },
    { value: '100', label: '100' },
  ];

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      const data = await fetchDemographicMetrics(filter);
      setMetricsData(data);
      setLoading(false);
    };
    fetchMetrics();
  }, [filter]);

  const handleFilterChange = (field: keyof DemographicFilterDto) => (value: string | string[]) => {
    setFilter(prev => {
      if (field === 'genders') {
        const newGenders = Array.isArray(value) ? value : [];
        return { ...prev, genders: newGenders.length > 0 ? newGenders : undefined };
      }
      const newValue = value ? parseInt(value as string) : undefined;
      return { ...prev, [field]: newValue };
    });
  };

  const filterConfig = [
    {
      type: 'multi-select' as const,
      label: 'Género',
      value: filter.genders || [],
      onChange: handleFilterChange('genders'),
      options: genderOptions,
    },
    {
      type: 'dropdown' as const,
      label: 'Edad mínima',
      value: filter.minAge?.toString() || '',
      onChange: handleFilterChange('minAge'),
      options: ageOptions,
    },
    {
      type: 'dropdown' as const,
      label: 'Edad máxima',
      value: filter.maxAge?.toString() || '',
      onChange: handleFilterChange('maxAge'),
      options: ageOptions,
    },
  ];

  return (
    <>
      <Box sx={{ p: 3 }} ref={componentRef}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
            Métricas Demográficas
          </Typography>
          <Button
            variant="contained"
            onClick={handleGeneratePDF}
            sx={{ bgcolor: '#f5a623', color: 'black', borderRadius: '10px' }}
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
          <DemographicMetricsCharts metricsData={metricsData} />
        )}
      </Box>
      <Box
        ref={pdfContentRef}
        sx={{
          display: isCapturing ? 'block' : 'none',
          position: isCapturing ? 'absolute' : 'static',
          left: isCapturing ? '-9999px' : 'auto',
          top: isCapturing ? '-9999px' : 'auto',
          width: isCapturing ? '1612px' : 'auto',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
            Métricas Demográficas
          </Typography>
          {!loading && !error && metricsData && (
            <DemographicMetricsCharts metricsData={metricsData} />
          )}
        </Box>
      </Box>
      <PDFPreviewDialog
        open={previewOpen}
        previewImage={previewImage}
        onClose={handleClosePreview}
        onConfirm={handleConfirmDownload}
      />
    </>
  );
};

export default DemographicMetrics;