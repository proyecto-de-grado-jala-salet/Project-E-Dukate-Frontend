import React, { useState } from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface CustomTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  adornment?: string;
  fullWidth?: boolean;
  type?: string;
  select?: boolean;
  children?: React.ReactNode;
  showToggle?: boolean;
  autoComplete?: string;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  adornment,
  fullWidth = true,
  type,
  select,
  children,
  showToggle = false,
  autoComplete,
}) => {
  const [showText, setShowText] = useState(false);

  const handleToggleShowText = () => {
    setShowText((prev) => !prev);
  };

  const inputType = showToggle && type === "password" ? (showText ? "text" : "password") : type;

  return (
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
      type={inputType}
      select={select}
      autoComplete={autoComplete}
      InputProps={{
        startAdornment: adornment ? (
          <InputAdornment position="start">{adornment}</InputAdornment>
        ) : undefined,
        endAdornment: showToggle ? (
          <InputAdornment position="end">
            <IconButton onClick={handleToggleShowText} edge="end">
              {showText ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
    >
      {children}
    </TextField>
  );
};