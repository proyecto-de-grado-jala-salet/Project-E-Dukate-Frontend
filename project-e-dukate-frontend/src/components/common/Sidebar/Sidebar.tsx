/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { FaStethoscope } from "react-icons/fa";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedTab, onTabChange }) => {
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  const menuItems = [
    { label: 'Especialidades', icon: <FaStethoscope size={20}/>, value: 'especialidades' },
    { label: 'Usuarios', icon: <PeopleAltOutlinedIcon />, value: 'usuarios' },
    { label: 'Pagos', icon: <PaymentsOutlinedIcon />, value: 'pagos' },
    { label: 'Horarios', icon: <CalendarMonthOutlinedIcon />, value: 'horarios' },
    { label: 'Métricas', icon: <BarChartIcon />, value: 'metricas' },
  ];

  return (
    <Box
      sx={{
        width: 330,
        height: '100vh',
        backgroundColor: '#04633c',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Box sx={{ p: 6, display: 'flex', alignItems: 'center' }}>
          <img src="/E-Dukate_Logo.png" alt="E-Dukate Logo"/>
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.value}
              onClick={() => onTabChange(item.value)}
              sx={{
                position: 'relative',
                mx: 2,
                borderRadius: 2,
                pl: 4,
                backgroundColor: selectedTab === item.value ? 'white' : 'transparent',
                color: selectedTab === item.value ? '#04633c' : 'white',
                '&:hover': {
                  backgroundColor: selectedTab === item.value ? 'white' : 'rgba(255, 255, 255, 0.1)',
                },
                ...(selectedTab === item.value && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: -16,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    backgroundColor: 'white',
                    borderRadius: '0 2px 2px 0',
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ color: selectedTab === item.value ? '#04633c' : 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <List>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            pl: 7,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'white' }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );
};