"use client";

import React from 'react';
import { Box } from '@mui/material';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getSelectedTab = () => {
    if (!pathname) return 'especialidades';
    const path = pathname.split('/').pop();
    return path || 'especialidades';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar selectedTab={getSelectedTab()} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header userName="Cara Martinez" userRole="Administrador" />
        <Box sx={{ flex: 1, bgcolor: '#EDEDED', p: 3, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}