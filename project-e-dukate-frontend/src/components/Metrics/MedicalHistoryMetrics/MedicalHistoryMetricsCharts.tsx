import React from 'react';
import { Box, Typography } from '@mui/material';
import { GenericEChart } from '../GenericCharts';
import { MedicalHistoryMetricsDto } from '@/types/medicalHistory';

interface MedicalHistoryMetricsChartsProps {
  metricsData: MedicalHistoryMetricsDto | null;
}

export const MedicalHistoryMetricsCharts: React.FC<MedicalHistoryMetricsChartsProps> = ({
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
          margin: '30px 0 0 0',
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
          Métricas{' '}de{' '}Estado{' '}de{' '}Consulta
        </Typography>
        {metricsData && !metricsData.metrics && (
          <Typography color="textSecondary" align="center">
            No hay datos disponibles para mostrar.
          </Typography>
        )}
        {metricsData?.metrics && (
          <>
            <GenericEChart
            type="bar"
            data={metricsData.metrics}
            title=""
            height="500px"
          />
          <GenericEChart
            type="pie"
            data={metricsData.metrics}
            title=""
          />
          </>
        )}
      </Box>
    </>
  );
};