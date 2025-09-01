import React from 'react';
import MuiButton from '@mui/material/Button';
import { type ButtonProps } from '@mui/material/Button';

interface CustomButtonProps extends ButtonProps {
  label: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const ButtonComponent: React.FC<CustomButtonProps> = ({
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

ButtonComponent.displayName = 'Button';

export const Button = React.memo(ButtonComponent);
export default Button;