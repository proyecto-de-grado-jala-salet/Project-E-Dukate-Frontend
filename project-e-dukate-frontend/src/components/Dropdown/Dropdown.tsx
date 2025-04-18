import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

interface DropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: boolean;
  helperText?: string;
  sx?: object;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  required,
  error = false,
  helperText,
  sx,
}) => {
  return (
    <FormControl fullWidth sx={sx} error={!!error}>
      <InputLabel>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
        label={`${label}${required ? ' *' : ''}`}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 3 + 8,
              width: 'auto',
            },
          },
        }}
        sx={{
          '& .MuiSelect-select': {
            padding: '16px 14px',
          },
        }}
      >
        <MenuItem value="">
          <em>Seleccione una opción</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};