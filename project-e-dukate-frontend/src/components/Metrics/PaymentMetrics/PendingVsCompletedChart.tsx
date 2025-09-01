import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { GenericEChart } from '@/components/Metrics/GenericCharts';
import { GenericFilterContainer } from '@/components/GenericFilters';
import { Filter } from '@/types/filterOption';

interface PendingVsCompletedChartProps {
  data: { status: string; count: number }[];
  filters: Filter[];
  onResetFilters: () => void;
  showFilters: boolean;
}

export const PendingVsCompletedChart: React.FC<PendingVsCompletedChartProps> = ({
  data,
  filters,
  onResetFilters,
  showFilters,
}) => {
  const filteredData = data.filter(item => item.count > 0);

  return (
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
        Montos Pendientes{' '}vs.{' '}Completados
      </Typography>
      {showFilters && filters.length > 0 && (
        <Box sx={{ m: 3 }}>
          <GenericFilterContainer filters={filters} onResetFilters={onResetFilters} />
        </Box>
      )}
      {filteredData.length === 0 ? (
        <Typography color="textSecondary" align="center">
          No hay datos disponibles para mostrar.
        </Typography>
      ) : (
        <GenericEChart
          type="pie"
          data={filteredData}
          title=""
          height="400px"
          formatLabel={(status) => (status === 'Pending' ? 'Pendientes' : 'Completados')}
          colors={{ Pending: '#FF6384', Completed: '#36A2EB' }}
        />
      )}
    </Box>
  );
};