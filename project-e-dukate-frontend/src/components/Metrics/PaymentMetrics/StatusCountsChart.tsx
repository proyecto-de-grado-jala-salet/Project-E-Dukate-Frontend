"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { GenericFilterContainer } from '@/components/GenericFilters';
import { GenericEChart } from '@/components/Metrics/GenericCharts';
import { Filter } from '@/types/filterOption';

interface StatusCountsChartProps {
  filters: Filter[];
  data: { status: string; count: number }[];
  onResetFilters: () => void;
  showFilters: boolean;
}

export const StatusCountsChart: React.FC<StatusCountsChartProps> = ({
  filters,
  data,
  onResetFilters,
  showFilters,
}) => (
  <Box
    sx={{
      width: '100%',
      bgcolor: '#ffffff',
      borderRadius: '12px',
      p: 2,
      margin: '30px 0 0 0',
      boxShadow: 1,
      whiteSpace: 'pre-wrap',
    }}
  >
    <Typography
      variant="h5"
      sx={{
        fontWeight: 'bold',
        color: 'black',
        m: 3,
        whiteSpace: 'pre-wrap',
        wordBreak: 'keep-all',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      Gráfico{' '}de{' '}Conteo{' '}de{' '}Pagos
    </Typography>
    {showFilters && filters.length > 0 && (
      <Box sx={{ m: 3 }}>
        <GenericFilterContainer filters={filters} onResetFilters={onResetFilters} />
      </Box>
    )}
    {!data ? (
      <Typography color="textSecondary" align="center">
        No hay datos disponibles para mostrar.
      </Typography>
    ) : (
      <GenericEChart
        type="pie"
        data={data}
        title=""
        height="400px"
        formatLabel={(status) => (status === 'Pending' ? 'Pendientes' : 'Completados')}
        colors={{ Pending: '#FF6384', Completed: '#36A2EB' }}
      />
    )}
  </Box>
);