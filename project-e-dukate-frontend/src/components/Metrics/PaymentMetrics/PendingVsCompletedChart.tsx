import React from 'react';
import { Box, Typography } from '@mui/material';
import { GenericEChart } from '@/components/Metrics/GenericCharts';

interface PendingVsCompletedChartProps {
  data: { status: string; count: number }[];
}

export const PendingVsCompletedChart: React.FC<PendingVsCompletedChartProps> = ({ data }) => (
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
      Montos Pendientes vs. Completados
    </Typography>
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