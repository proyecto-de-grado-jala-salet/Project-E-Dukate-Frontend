import React from 'react';
import { Box, List, ListItemButton, ListItemIcon, SxProps, Tooltip } from '@mui/material';
import { FaStethoscope } from "react-icons/fa";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { RiUserHeartLine } from "react-icons/ri";
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { clearAuthToken } from '../../services/api';
import Image from 'next/image';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  value: string;
  roles: string[];
}

interface SidebarProps {
  selectedTab: string;
  sx?: SxProps;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedTab, sx }) => {
  const router = useRouter();
  const { userRole, clearAuth } = useAuthStore();

  const menuItems: MenuItem[] = [
    { label: 'Especialidades', icon: <FaStethoscope size={20} />, value: 'especialidades', roles: ['Administrator'] },
    { label: 'Usuarios', icon: <PeopleAltOutlinedIcon />, value: 'usuarios', roles: ['Administrator'] },
    { label: 'Pacientes', icon: <RiUserHeartLine size={25} />, value: 'pacientes', roles: ['Administrator', 'Specialist'] },
    { label: 'Pagos', icon: <PaymentsOutlinedIcon />, value: 'pagos', roles: ['Administrator', 'Specialist'] },
    { label: 'Horarios', icon: <CalendarMonthOutlinedIcon />, value: 'horarios', roles: ['Administrator'] },
    { label: 'Metricas', icon: <BarChartIcon />, value: 'metricas', roles: ['Administrator'] },
  ];

  const handleLogout = () => {
    clearAuthToken();
    clearAuth();
    router.push('/login');
  };

  const filteredMenuItems = menuItems.filter(item => 
    userRole && item.roles.includes(userRole)
  );

  return (
    <Box sx={{ width: 120, height: '100vh', bgcolor: '#013c28', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...sx }}>
      <Box>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/E-Dukate_Logo.png"
            alt="E-Dukate Logo"
            width={70}
            height={60}
          />
        </Box>
        <List>
          {filteredMenuItems.map((item) => (
            <Tooltip title={item.label} placement="right" key={item.value}>
              <ListItemButton
                onClick={() => router.push(`/dashboard/${item.value}`)}
                sx={{
                  mx: 2,
                  borderRadius: 2,
                  justifyContent: 'center',
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
                <ListItemIcon sx={{ color: selectedTab === item.value ? '#04633c' : 'white', minWidth: 0 }}>
                  {item.icon}
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>
      <List>
        <Tooltip title="Logout" placement="right">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              justifyContent: 'center',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 0 }}>
              <LogoutIcon />
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
      </List>
    </Box>
  );
};

export default Sidebar;