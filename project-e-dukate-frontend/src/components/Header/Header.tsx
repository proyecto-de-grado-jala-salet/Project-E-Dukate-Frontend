import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, SxProps } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';

interface HeaderProps {
  userName: string;
  userRole: string;
  sx?: SxProps;
}

export const Header: React.FC<HeaderProps> = ({ userName, userRole, sx }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    router.push('/login');
    handleMenuClose();
  };

  return (
    <Box sx={{ height: 75, bgcolor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 4, ...sx }}>
      <IconButton sx={{ color: '#000000' }}>
        <FaRegUserCircle size={30} />
      </IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', mr: 1 }}>
          <Typography variant="body1" sx={{ color: '#000000' }}>{userName}</Typography>
          <Typography variant="body2" sx={{ color: '#000000' }}>{userRole}</Typography>
        </Box>
        <IconButton onClick={handleMenuOpen} sx={{ color: '#000000' }}>
          <ArrowDropDownIcon />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Header;