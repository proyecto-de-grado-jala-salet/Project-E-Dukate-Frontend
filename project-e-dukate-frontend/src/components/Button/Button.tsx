import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  label: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button: React.FC<CustomButtonProps> = ({
  label,
  startIcon,
  endIcon,
  sx,
  color,
  size = 'medium',
  ...props
}) => (
  <MuiButton
    startIcon={startIcon}
    endIcon={endIcon}
    color={color}
    size={size}
    sx={{
      borderRadius: '12px',
      ...(color ? {} : { backgroundColor: undefined, color: undefined }),
      ...sx,
    }}
    {...props}
  >
    {label}
  </MuiButton>
);

export default Button;