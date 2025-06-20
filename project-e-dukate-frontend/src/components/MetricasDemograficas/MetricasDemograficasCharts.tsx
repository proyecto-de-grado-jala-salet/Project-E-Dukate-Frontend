import React from 'react';
import { Box, Typography } from '@mui/material';
import { GenericEChart } from '@/components/GenericCharts';
import { DemographicMetricsDto } from '@/types/metricas';
import { genderColors, ageRangeColors, formatGenderLabel } from '@/utils/demographicConstants';

interface MetricasDemograficasChartsProps {
  metricsData: DemographicMetricsDto;
}

export const MetricasDemograficasCharts: React.FC<MetricasDemograficasChartsProps> = ({ metricsData }) => {
  const genderChartData = metricsData.genderMetrics.map(metric => ({
    status: metric.gender,
    count: metric.count,
  }));

  const ageChartData = metricsData.ageMetrics.map(metric => ({
    status: metric.ageRange,
    count: metric.count,
  }));
  
  const genderPieData = genderChartData.filter(item => item.count > 0);
  const agePieData = ageChartData.filter(item => item.count > 0);

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
          Gráfico Circular
        </Typography>
        {genderPieData.length === 0 && agePieData.length === 0 && (
          <Typography color="textSecondary" align="center">
            No hay datos disponibles para mostrar.
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {genderPieData.length > 0 && (
            <Box>
              <GenericEChart
                type="pie"
                data={genderPieData}
                title="Distribución por Género"
                height="500px"
                formatLabel={formatGenderLabel}
                colors={genderColors}
              />
            </Box>
          )}
          {agePieData.length > 0 && (
            <Box>
              <GenericEChart
                type="pie"
                data={agePieData}
                title="Distribución por Edad"
                height="500px"
                colors={ageRangeColors}
              />
            </Box>
          )}
        </Box>
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
          Gráfico de Barras
        </Typography>
        {genderChartData.length === 0 && ageChartData.length === 0 && (
          <Typography color="textSecondary" align="center">
            No hay datos disponibles para mostrar.
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {genderChartData.length > 0 && (
            <Box>
              <GenericEChart
                type="bar"
                data={genderChartData}
                title="Distribución por Género"
                height="500px"
                formatLabel={formatGenderLabel}
                colors={genderColors}
              />
            </Box>
          )}
          {ageChartData.length > 0 && (
            <Box>
              <GenericEChart
                type="bar"
                data={ageChartData}
                title="Distribución por Edad"
                height="500px"
                colors={ageRangeColors}
              />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};