"use client";

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { GenericFilterContainer } from '@/components/GenericFilters';
import { MedicalHistoryMetricsCharts } from '@/components/Metrics/MedicalHistoryMetrics';
import { fetchMedicalHistoryMetrics } from '@/services/metricsService';
import { MedicalHistoryFilterDto } from '@/types/medicalHistory';
import { MedicalHistoryMetricsDto } from '@/types/medicalHistory';
import { statuses } from '@/utils/medicalHistoryConstants';
import { formatStatusLabel } from '@/utils/medicalHistoryConstants';

export const MedicalHistoryMetrics: React.FC = () => {
  const [filter, setFilter] = useState<MedicalHistoryFilterDto>({});
  const [metricsData, setMetricsData] = useState<MedicalHistoryMetricsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = statuses.map(status => ({
    value: status,
    label: formatStatusLabel(status),
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
      type: 'month' as const,
      label: 'Día',
      value: filter.Day?.toString() || '',
      onChange: handleFilterChange('Day'),
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
        Métricas de Historiales Médicos
      </Typography>
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
  );
};

export default MedicalHistoryMetrics;