"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { FilterButton } from '@/components/FilterButton';
import { MetricsCharts } from '@/components/Metrics';
import { fetchMedicalHistoryMetrics } from '@/services/metricsService';
import { MedicalHistoryFilterDto, MedicalHistoryMetricsDto } from '@/types/medicalHistory';
import { statuses } from '@/utils/medicalHistoryConstants';

export const Metrics: React.FC = () => {
  const [filter, setFilter] = useState<MedicalHistoryFilterDto>({});
  const [metricsData, setMetricsData] = useState<MedicalHistoryMetricsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = statuses.map(status => ({
    value: status,
    label: status
      .replace('ContinuaEnTratamiento', 'Continúa en Tratamiento')
      .replace('AltaDefinitiva', 'Alta Definitiva')
      .replace('AltaTemporal', 'Alta Temporal')
      .replace('AltaAbandono', 'Alta por Abandono')
  }));

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      const data = await fetchMedicalHistoryMetrics(filter);
      console.log('Metrics data set:', data); // Debug log
      setMetricsData(data);
      setLoading(false);
    };
    fetchMetrics();
  }, [filter]);

  const handleFilterChange = (field: keyof MedicalHistoryFilterDto) => (value: string) => {
    setFilter(prev => {
      if (field === 'Statuses') {
        const currentStatuses = prev.Statuses || [];
        const newStatuses = currentStatuses.includes(value)
          ? currentStatuses.filter(s => s !== value)
          : [...currentStatuses, value];
        return { ...prev, Statuses: newStatuses.length > 0 ? newStatuses : undefined };
      }
      const newValue = value ? parseInt(value) : undefined;
      return { ...prev, [field]: newValue };
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
        Métricas
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3, bgcolor: '#ffffff', p: 1, borderRadius: '8px', boxShadow: 1 }}>
        <FilterButton
          label="Año"
          type="year"
          value={filter.Year?.toString() || ''}
          onChange={handleFilterChange('Year')}
        />
        <FilterButton
          label="Mes"
          type="month"
          value={filter.Month?.toString() || ''}
          onChange={handleFilterChange('Month')}
        />
        <FilterButton
          label="Día"
          type="month"
          value={filter.Day?.toString() || ''}
          onChange={handleFilterChange('Day')}
        />
        <FilterButton
          label="Estado"
          type="dropdown"
          value=""
          options={statusOptions}
          onChange={handleFilterChange('Statuses')}
        />
      </Box>
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
        <MetricsCharts metricsData={metricsData} />
      )}
    </Box>
  );
};

export default Metrics;