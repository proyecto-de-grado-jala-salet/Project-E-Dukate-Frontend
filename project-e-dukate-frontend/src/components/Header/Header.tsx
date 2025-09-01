import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { type SxProps } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { clearAuthToken } from '../../services/api';

interface HeaderProps {
  sx?: SxProps;
}

export const Header: React.FC<HeaderProps> = ({ sx }) => {
  const router = useRouter();
  const { userName, userRole, clearAuth } = useAuthStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    clearAuthToken();
    clearAuth();
    router.push('/login');
    handleMenuClose();
  };

  const roleInSpanish =
    userRole === 'Administrator' ? 'Administrador' :
    userRole === 'Specialist' ? 'Especialista' : userRole || 'Rol';
    
  return (
    <Box sx={{ height: 75, bgcolor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 4, ...sx }}>
      <IconButton sx={{ color: '#000000' }}>
        <FaRegUserCircle size={30} />
      </IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', mr: 1 }}>
          <Typography variant="body1" sx={{ color: '#000000' }}>{userName || 'Usuario'}</Typography>
          <Typography variant="body2" sx={{ color: '#000000' }}>{roleInSpanish}</Typography>
        </Box>
        <IconButton onClick={handleMenuOpen} sx={{ color: '#000000' }}>
          <ArrowDropDownIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleLogout}>Cerrar Sesion</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;