import React from 'react';
import { Box, Typography } from '@mui/material';

export const Login: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Typography variant="h4">Pantalla de Inicio de Sesión</Typography>
    </Box>
  );
};

export default Login;