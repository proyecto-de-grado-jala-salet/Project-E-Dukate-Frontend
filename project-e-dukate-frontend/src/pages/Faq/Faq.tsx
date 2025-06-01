"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';

export const Faq: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Typography variant="h5">This is the FAQ section</Typography>
    </Box>
  );
};

export default Faq;