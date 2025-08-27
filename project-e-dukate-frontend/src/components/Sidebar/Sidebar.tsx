import React, { useState, useRef } from 'react';
import {
  Box,
  Popper,
  Paper,
  ClickAwayListener,
  Grow,
  MenuList,
  MenuItem,
} from '@mui/material';
import { List, ListItemButton, ListItemIcon, Tooltip } from '@mui/material';
import { SxProps } from '@mui/material';
import { FaStethoscope } from 'react-icons/fa';
import { IoSettingsOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdOutlinePrivacyTip } from 'react-icons/md';
import { RiFolderChartLine, RiUserHeartLine } from 'react-icons/ri';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { LiaBusinessTimeSolid } from 'react-icons/lia';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { clearAuthToken } from '../../services/api';
import Image from 'next/image';

interface SubMenuItem {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  value: string;
  roles: string[];
  subItems?: SubMenuItem[];
}

interface SidebarProps {
  selectedTab: string;
  sx?: SxProps;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedTab, sx }) => {
  const router = useRouter();
  const { userRole, clearAuth } = useAuthStore();
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const [openSettingsMenu, setOpenSettingsMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const settingsAnchorRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    {
      label: 'Especialidades',
      icon: <FaStethoscope size={20} />,
      value: 'especialidades',
      roles: ['Administrator'],
    },
    {
      label: 'Usuarios',
      icon: <PeopleAltOutlinedIcon />,
      value: 'usuarios',
      roles: ['Administrator'],
    },
    {
      label: 'Pacientes',
      icon: <RiUserHeartLine size={25} />,
      value: 'pacientes',
      roles: ['Administrator', 'Specialist'],
    },
    {
      label: 'Pagos',
      icon: <PaymentsOutlinedIcon />,
      value: 'pagos',
      roles: ['Administrator', 'Specialist'],
    },
    {
      label: 'Citas',
      icon: <CalendarMonthOutlinedIcon />,
      value: 'citas',
      roles: ['Administrator', 'Specialist'],
    },
    {
      label: 'Horarios',
      icon: <LiaBusinessTimeSolid size={23} />,
      value: 'horarios',
      roles: ['Administrator'],
    },
    {
      label: 'Metricas',
      icon: <BarChartIcon />,
      value: 'metricas',
      roles: ['Administrator'],
      subItems: [
        {
          label: 'Historial médico',
          value: 'metricas/historial-medico',
          icon: <RiFolderChartLine size={20} />,
        },
        {
          label: 'Demografía',
          value: 'metricas/demografia',
          icon: <IoPeopleOutline size={20} />,
        },
        {
          label: 'Pagos',
          value: 'metricas/pagos',
          icon: <PaymentsOutlinedIcon />,
        },
      ],
    },
  ];

  const handleToggleSubmenu = () => {
    setOpenSubmenu((prevOpen) => !prevOpen);
  };

  const handleToggleSettingsMenu = () => {
    setOpenSettingsMenu((prevOpen) => !prevOpen);
  };

  const handleCloseSubmenu = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpenSubmenu(false);
  };

  const handleCloseSettingsMenu = (event: Event | React.SyntheticEvent) => {
    if (
      settingsAnchorRef.current &&
      settingsAnchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenSettingsMenu(false);
  };

  const handleSubitemClick = (value: string) => {
    router.push(`/dashboard/${value}`);
    setOpenSubmenu(false);
  };

  const handlePrivacyPolicyClick = () => {
    router.push('/dashboard/politica-privacidad');
    setOpenSettingsMenu(false);
  };

  const handleLogout = () => {
    clearAuthToken();
    clearAuth();
    router.push('/login');
  };

  const filteredMenuItems = menuItems.filter((item) =>
    userRole && item.roles.includes(userRole)
  );

  return (
    <Box
      sx={{
        width: 120,
        height: '100vh',
        bgcolor: '#013c28',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...sx,
      }}
    >
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
            <div key={item.value}>
              <Tooltip title={item.label} placement="right">
                <ListItemButton
                  ref={item.value === 'metricas' ? anchorRef : null}
                  onClick={() => {
                    if (item.value === 'metricas') {
                      handleToggleSubmenu();
                    } else {
                      router.push(`/dashboard/${item.value}`);
                    }
                  }}
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
              {item.value === 'metricas' && (
                <Popper
                  open={openSubmenu}
                  anchorEl={anchorRef.current}
                  role={undefined}
                  placement="right-start"
                  transition
                  disablePortal
                  sx={{ zIndex: 1200 }}
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <Paper
                        sx={{
                          bgcolor: 'white',
                          color: 'black',
                          borderRadius: 2,
                          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
                          overflow: 'hidden',
                          ml: 1,
                        }}
                      >
                        <ClickAwayListener onClickAway={handleCloseSubmenu}>
                          <MenuList autoFocusItem={openSubmenu}>
                            {item.subItems?.map((subItem) => (
                              <MenuItem
                                key={subItem.value}
                                onClick={() => handleSubitemClick(subItem.value)}
                                sx={{
                                  color: 'black',
                                  '&:hover': { bgcolor: 'rgba(1, 60, 40, 0.1)' },
                                  ...(selectedTab === subItem.value && {
                                    bgcolor: 'white',
                                    color: '#04633c',
                                  }),
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    color: selectedTab === subItem.value ? '#04633c' : 'black',
                                    minWidth: 0,
                                    mr: 1,
                                  }}
                                >
                                  {subItem.icon}
                                </ListItemIcon>
                                {subItem.label}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              )}
            </div>
          ))}
        </List>
      </Box>
      <List>
        <Tooltip title="Configuración" placement="right">
          <ListItemButton
            ref={settingsAnchorRef}
            onClick={handleToggleSettingsMenu}
            sx={{
              mx: 2,
              borderRadius: 2,
              justifyContent: 'center',
              bgcolor: selectedTab === 'politica-privacidad' ? 'white' : 'transparent',
              color: selectedTab === 'politica-privacidad' ? '#04633c' : 'white',
              '&:hover': { bgcolor: selectedTab === 'politica-privacidad' ? 'white' : 'rgba(255, 255, 255, 0.1)' },
              ...(selectedTab === 'politica-privacidad' && {
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
            <ListItemIcon
              sx={{
                color: selectedTab === 'politica-privacidad' ? '#04633c' : 'white',
                minWidth: 0,
              }}
            >
              <IoSettingsOutline size={24} />
            </ListItemIcon>
          </ListItemButton>
        </Tooltip>
        <Popper
          open={openSettingsMenu}
          anchorEl={settingsAnchorRef.current}
          role={undefined}
          placement="right-start"
          transition
          disablePortal
          sx={{ zIndex: 1200 }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper
                sx={{
                  bgcolor: 'white',
                  color: 'black',
                  borderRadius: 2,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
                  overflow: 'hidden',
                  ml: 1,
                }}
              >
                <ClickAwayListener onClickAway={handleCloseSettingsMenu}>
                  <MenuList autoFocusItem={openSettingsMenu}>
                    <MenuItem
                      onClick={handlePrivacyPolicyClick}
                      sx={{
                        color: 'black',
                        '&:hover': { bgcolor: 'rgba(1, 60, 40, 0.1)' },
                        ...(selectedTab === 'politica-privacidad' && {
                          bgcolor: 'white',
                          color: '#04633c',
                        }),
                      }}
                    >
                      <ListItemIcon sx={{ color: 'black', minWidth: 0, mr: 1 }}>
                        <MdOutlinePrivacyTip size={20} />
                      </ListItemIcon>
                      Políticas de Privacidad
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <Tooltip title="Cerrar Sesión" placement="right">
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