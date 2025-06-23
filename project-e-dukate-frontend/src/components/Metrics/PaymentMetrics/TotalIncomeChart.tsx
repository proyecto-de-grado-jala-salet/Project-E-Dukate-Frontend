"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { GenericFilterContainer } from '@/components/GenericFilters';
import { GenericEChart } from '@/components/Metrics/GenericCharts';
import { Filter } from '@/types/filterOption';

interface TotalIncomeChartProps {
  filters: Filter[];
  data: { status: string; count: number }[];
  periodType: string;
  onResetFilters: () => void;
}

export const TotalIncomeChart: React.FC<TotalIncomeChartProps> = ({
  filters,
  data,
  periodType,
  onResetFilters,
}) => (
  <Box
    sx={{
      width: '100%',
      bgcolor: '#ffffff',
      borderRadius: '12px',
      p: 2,
      margin: '30px 0 0 0',
      boxShadow: 1,
    }}
  >
    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', m: 3 }}>
      {periodType === 'yearly' ? 'Gráfico de Barras' : 'Gráfico de Líneas'}
    </Typography>
    {filters.length > 0 && (
      <Box sx={{ m: 3 }}>
        <GenericFilterContainer filters={filters} onResetFilters={onResetFilters} />
      </Box>
    )}
    {!data || data.length === 0 ? (
      <Typography color="textSecondary" align="center">
        No hay datos disponibles para mostrar.
      </Typography>
    ) : (
      <GenericEChart
        type={periodType === 'yearly' ? 'bar' : 'line'}
        data={data}
        title="Ingresos Totales por Período"
        height="500px"
        formatLabel={(status) => status}
        colors={{}}
      />
    )}
  </Box>
);