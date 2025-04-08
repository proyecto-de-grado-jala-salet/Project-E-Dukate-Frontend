"use client";

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DashboardLayout } from '../../components/common/DashboardLayout';

const tabMessages: { [key: string]: string } = {
  especialidades: 'Este es el botón de Especialidades',
  usuarios: 'Este es el botón de Usuarios',
  pagos: 'Este es el botón de Pagos',
  horarios: 'Este es el botón de Horarios',
  metricas: 'Este es el botón de Métricas',
};

export const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('especialidades');

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <DashboardLayout
      selectedTab={selectedTab}
      onTabChange={handleTabChange}
      userName="Cara Martinez"
      userRole="Administrador"
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Typography variant="h5">{tabMessages[selectedTab]}</Typography>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;