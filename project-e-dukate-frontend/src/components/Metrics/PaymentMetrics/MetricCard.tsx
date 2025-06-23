import React from 'react';
import { Box, Typography } from '@mui/material';

interface MetricCardProps {
  label: string;
  value?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value }) => (
  <Box
    sx={{
      bgcolor: '#ffffff',
      borderRadius: '12px',
      p: 3,
      boxShadow: 1,
      textAlign: 'center',
      minWidth: '200px',
      flex: 1,
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
      {label}
    </Typography>
    <Typography variant="h4" color="#4CAF50">
      {typeof value === 'number' ? `${value.toFixed(2)} bs.` : '-'}
    </Typography>
  </Box>
);