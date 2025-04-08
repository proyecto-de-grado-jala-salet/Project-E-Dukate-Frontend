import React from 'react';
import { Box } from '@mui/material';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  selectedTab: string;
  onTabChange: (tab: string) => void;
  userName: string;
  userRole: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  selectedTab,
  onTabChange,
  userName,
  userRole,
}) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar selectedTab={selectedTab} onTabChange={onTabChange} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header userName={userName} userRole={userRole} />
        <Box sx={{ flex: 1, backgroundColor: '#f5f5f5', p: 3, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};