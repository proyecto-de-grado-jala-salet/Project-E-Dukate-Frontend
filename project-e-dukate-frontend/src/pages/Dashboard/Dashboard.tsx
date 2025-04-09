// src/pages/Dashboard/Dashboard.tsx

"use client";

import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DashboardLayout } from '../../components/common/DashboardLayout';
import { SpecialtiesTable } from '../../components/common/SpecialtiesTable';

const tabMessages: { [key: string]: string } = {
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
      {selectedTab === 'especialidades' ? (
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>Especialidades</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search product name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ backgroundColor: 'white', borderRadius: 1 }}
              />
              <Button
                variant="contained"
                sx={{ backgroundColor: '#f5c71a', color: 'black', textTransform: 'none' }}
              >
                Añadir Especialidad
              </Button>
            </Box>
          </Box>
          <SpecialtiesTable />
        </Box>
      ) : (
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
      )}
    </DashboardLayout>
  );
};

export default Dashboard;