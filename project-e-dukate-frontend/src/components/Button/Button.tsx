import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  label: string;
}

export const Button: React.FC<CustomButtonProps> = ({ label, sx, ...props }) => (
  <MuiButton sx={{ borderRadius: '12px', ...sx }} {...props}>{label}</MuiButton>
);

export default Button;