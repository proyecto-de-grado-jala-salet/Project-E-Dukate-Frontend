"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { GenericFilterContainer } from '@/components/GenericFilters';
import { GenericEChart } from '@/components/Metrics/GenericCharts';
import { Filter } from '@/types/filterOption';

interface TotalIncomeChartProps {
  filters: Filter[];
  data: { status: string; count: number }[];
  periodType: string;
  onResetFilters: () => void;
  showFilters: boolean;
}

export const TotalIncomeChart: React.FC<TotalIncomeChartProps> = ({
  filters,
  data,
  periodType,
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
      Ingresos{' '}Totales{' '}por{' '}Período
    </Typography>
    {showFilters && filters.length > 0 && (
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
        title=""
        height="500px"
        formatLabel={(status) => status}
        colors={{}}
      />
    )}
  </Box>
);