import React, { useState } from 'react';
import { TextField as MuiTextField, InputAdornment, IconButton, SxProps, TextFieldProps, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface CustomTextFieldProps extends Omit<TextFieldProps, 'onChange'> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  showToggle?: boolean;
  startAdornment?: React.ReactNode;
  sx?: SxProps;
  select?: boolean;
  children?: React.ReactNode;
}

export const TextField: React.FC<CustomTextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required,
  type,
  showToggle = false,
  startAdornment,
  sx,
  autoComplete,
  select,
  children,
  placeholder,
  ...props
}) => {
  const [showText, setShowText] = useState(false);
  const inputType = showToggle && type === "password" ? (showText ? "text" : "password") : type;

  const renderLabel = () => {
    if (!label) return undefined;
    return (
      <span>
        {label}
        {required && (
          <Typography component="span" sx={{ color: 'red', ml: 0.5 }}>
            *
          </Typography>
        )}
      </span>
    );
  };

  return (
    <MuiTextField
      label={renderLabel()}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={!!error}
      helperText={error}
      type={inputType}
      fullWidth
      autoComplete={autoComplete}
      select={select}
      placeholder={placeholder}
      sx={{ ...sx }}
      InputProps={{
        startAdornment: startAdornment ? (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ) : undefined,
        endAdornment: showToggle ? (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowText(!showText)}>
              {showText ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      {...props}
    >
      {children}
    </MuiTextField>
  );
};

export default TextField;