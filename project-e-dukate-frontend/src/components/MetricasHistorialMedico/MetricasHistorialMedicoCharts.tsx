import React from 'react';
import { Box, Typography } from '@mui/material';
import { GenericEChart } from '../GenericCharts';
import { MedicalHistoryMetricsDto } from '@/types/medicalHistory';

interface MetricasHistorialMedicoChartsProps {
  metricsData: MedicalHistoryMetricsDto | null;
}

export const MetricasHistorialMedicoCharts: React.FC<MetricasHistorialMedicoChartsProps> = ({
  metricsData,
}) => {
  return (
    <>
      <Box
        sx={{
          width: '100%',
          bgcolor: '#ffffff',
          borderRadius: '12px',
          p: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'black', m: 3 }}>
          Gráfico de Barras
        </Typography>
        {metricsData && !metricsData.metrics && (
          <Typography color="textSecondary" align="center">
            No hay datos disponibles para mostrar.
          </Typography>
        )}
        {metricsData?.metrics && (
          <GenericEChart
            type="bar"
            data={metricsData.metrics}
            title="Métricas de Historiales Médicos"
            height="500px"
          />
        )}
      </Box>
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
          Gráfico Circular
        </Typography>
        {metricsData && !metricsData.metrics && (
          <Typography color="textSecondary" align="center">
            No hay datos disponibles para mostrar.
          </Typography>
        )}
        {metricsData?.metrics && (
          <GenericEChart
            type="pie"
            data={metricsData.metrics}
            title="Métricas de Historiales Médicos"
          />
        )}
      </Box>
    </>
  );
};