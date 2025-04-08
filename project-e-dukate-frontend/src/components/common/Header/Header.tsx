import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { FaRegUserCircle } from "react-icons/fa";
import { useRouter } from 'next/navigation';

interface HeaderProps {
  userName: string;
  userRole: string;
}

export const Header: React.FC<HeaderProps> = ({ userName, userRole }) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    router.push('/login');
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        height: 80,
        backgroundColor: '#04633c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        px: 4,
      }}
    >
      <IconButton sx={{ color: 'white' }}>
        <FaRegUserCircle size={30} />
      </IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', mr: 1 }}>
          <Typography variant="body1" sx={{ color: 'white' }}>
            {userName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            {userRole}
          </Typography>
        </Box>
        <IconButton onClick={handleMenuOpen} sx={{ color: 'white' }}>
          <ArrowDropDownIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};