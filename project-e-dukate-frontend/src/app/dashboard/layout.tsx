"use client";

import React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useNavigation } from '@/contexts/NavigationContext';
import ECGLoader from '@/components/Loader/ECGLoader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, token } = useAuthStore();
  const [, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const { isNavigating } = useNavigation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    if (!token) {
      setShouldRedirect(true);
      return;
    }

    const initializeDashboard = async () => {
      setIsLoading(true);
      try {
        if (!pathname || !userRole) return;
        const pathSegments = pathname.split('/').filter(Boolean);
        const currentTab = pathSegments[1] || 'dashboard';
        const allowedTabs =
          userRole === 'Administrator'
            ? ['especialidades', 'usuarios', 'pacientes', 'pagos', 'horarios', 'metricas', 'citas', 'politica-privacidad', 'notificaciones']
            : ['pacientes', 'pagos', 'citas', 'politica-privacidad'];
        const defaultTab = userRole === 'Administrator' ? 'especialidades' : 'pacientes';

        if (currentTab === 'dashboard' || !allowedTabs.includes(currentTab)) {
          await router.push(`/dashboard/${defaultTab}`);
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [token, userRole, pathname, router, isClient]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/login');
    }
  }, [shouldRedirect, router]);

  const getSelectedTab = () => {
    if (!pathname) return userRole === 'Administrator' ? 'especialidades' : 'pacientes';
    const pathSegments = pathname.split('/').filter(Boolean);
    const mainTab = pathSegments[1];
    const validTabs =
      userRole === 'Administrator'
        ? ['especialidades', 'usuarios', 'pacientes', 'pagos', 'horarios', 'metricas', 'citas', 'politica-privacidad', 'notificaciones']
        : ['pacientes', 'pagos', 'citas', 'politica-privacidad'];
    return validTabs.includes(mainTab) ? mainTab : userRole === 'Administrator' ? 'especialidades' : 'pacientes';
  };

  if (!isClient) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!token || shouldRedirect) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar selectedTab={getSelectedTab()} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Box sx={{ flex: 1, bgcolor: '#EDEDED', p: 3, overflow: 'auto', position: 'relative' }}>
          {isNavigating && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                zIndex: 9999,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ECGLoader message="Cargando" />
            </Box>
          )}
          {children}
        </Box>
      </Box>
    </Box>
  );
}