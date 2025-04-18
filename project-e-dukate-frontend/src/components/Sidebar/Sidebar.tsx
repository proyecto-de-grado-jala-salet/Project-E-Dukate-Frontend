import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, SxProps } from '@mui/material';
import { FaStethoscope } from "react-icons/fa";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { RiUserHeartLine } from "react-icons/ri";
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  value: string;
}

interface SidebarProps {
  selectedTab: string;
  sx?: SxProps;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedTab, sx }) => {
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { label: 'Especialidades', icon: <FaStethoscope size={20} />, value: 'especialidades' },
    { label: 'Usuarios', icon: <PeopleAltOutlinedIcon />, value: 'usuarios' },
    { label: 'Paciente', icon: <RiUserHeartLine size={25}/>, value: 'paciente' },
    { label: 'Pagos', icon: <PaymentsOutlinedIcon />, value: 'pagos' },
    { label: 'Horarios', icon: <CalendarMonthOutlinedIcon />, value: 'horarios' },
    { label: 'Metricas', icon: <BarChartIcon />, value: 'metricas' },
  ];

  const handleLogout = () => router.push('/login');

  return (
    <Box sx={{ width: 330, height: '100vh', bgcolor: '#04633c', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...sx }}>
      <Box>
        <Box sx={{ p: 6, display: 'flex', alignItems: 'center' }}>
          <img src="/E-Dukate_Logo.png" alt="E-Dukate Logo" />
        </Box>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.value}
              onClick={() => router.push(`/dashboard/${item.value}`)}
              sx={{
                mx: 2,
                borderRadius: 2,
                pl: 4,
                bgcolor: selectedTab === item.value ? 'white' : 'transparent',
                color: selectedTab === item.value ? '#04633c' : 'white',
                '&:hover': { bgcolor: selectedTab === item.value ? 'white' : 'rgba(255, 255, 255, 0.1)' },
                ...(selectedTab === item.value && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: -16,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    bgcolor: 'white',
                    borderRadius: '0 2px 2px 0',
                  },
                }),
              }}
            >
              <ListItemIcon sx={{ color: selectedTab === item.value ? '#04633c' : 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <List>
        <ListItemButton onClick={handleLogout} sx={{ pl: 7, color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' } }}>
          <ListItemIcon sx={{ color: 'white' }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;