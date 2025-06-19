"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { FilterButton } from '@/components/FilterButton';
import { MultiSelectFilter } from '@/components/MultiSelectFilter';
import { MetricsCharts } from '@/components/Metrics';
import { fetchMedicalHistoryMetrics } from '@/services/metricsService';
import { MedicalHistoryFilterDto, MedicalHistoryMetricsDto } from '@/types/medicalHistory';
import { statuses } from '@/utils/medicalHistoryConstants';
import { HiOutlineFilter } from 'react-icons/hi';
import { Button } from '@mui/material';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';

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
      console.log('Metrics data set:', data);
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

  const handleResetFilters = () => {
    setFilter({});
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
        Métricas de Historiales Médicos
      </Typography>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          alignItems: 'center',
          bgcolor: '#fff',
          p: 0.5,
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          width: 'fit-content',
          gap: { xs: 1, sm: 0 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 1,
            py: 0.5,
            borderRight: { xs: 'none', sm: '1px solid #e0e0e0' },
          }}
        >
          <HiOutlineFilter size={20} color="#000" />
          <Typography
            variant="body2"
            sx={{ ml: 2.5, color: '#000', fontWeight: 500 }}
          >
            Filtrar por
          </Typography>
        </Box>
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
        <MultiSelectFilter
          label="Estado"
          value={filter.Statuses || []}
          onChange={handleFilterChange('Statuses')}
          options={statusOptions}
        />
        <Box
          sx={{
            px: 0.5,
            py: 0.5,
            borderLeft: { xs: 'none', sm: '1px solid #e0e0e0' },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ReplayOutlinedIcon fontSize="small" />}
            sx={{
              borderRadius: '8px',
              minWidth: '100px',
              height: '32px',
              fontSize: '14px',
              textTransform: 'none',
              borderColor: 'transparent',
              color: 'red',
            }}
            onClick={handleResetFilters}
          >
            Restablecer filtro
          </Button>
        </Box>
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