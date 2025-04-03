import React from "react";
import { TextField, InputAdornment } from "@mui/material";

interface CustomTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  adornment?: string;
  fullWidth?: boolean;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  adornment,
  fullWidth = true,
}) => (
  <TextField
    label={
      <span>
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </span>
    }
    value={value}
    onChange={(e) => onChange(e.target.value)}
    error={!!error}
    helperText={error}
    variant="outlined"
    fullWidth={fullWidth}
    InputProps={
      adornment ? { startAdornment: <InputAdornment position="start">{adornment}</InputAdornment> } : undefined
    }
  />
);