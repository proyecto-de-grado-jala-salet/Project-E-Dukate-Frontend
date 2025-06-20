"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { GenericFilterContainer } from '@/components/GenericFilters';
import { MetricasDemograficasCharts } from '@/components/MetricasDemograficas';
import { fetchDemographicMetrics } from '@/services/demographicMetricsService';
import { DemographicFilterDto, DemographicMetricsDto } from '@/types/metricas';
import { FilterOption } from '@/types/filterOption';

export const MetricasDemograficas: React.FC = () => {
  const [filter, setFilter] = useState<DemographicFilterDto>({});
  const [metricsData, setMetricsData] = useState<DemographicMetricsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
        Métricas Demográficas
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
        <MetricasDemograficasCharts metricsData={metricsData} />
      )}
    </Box>
  );
};

export default MetricasDemograficas;