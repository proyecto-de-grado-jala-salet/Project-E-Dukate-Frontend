import React from "react";
import { Radio, RadioGroup, FormControlLabel, Typography } from "@mui/material";

interface CustomRadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
}

export const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  value,
  onChange,
  options,
  error,
}) => (
  <div>
    <RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={<Radio />}
          label={option.label}
        />
      ))}
    </RadioGroup>
    {error && (
      <Typography color="error" variant="caption">
        {error}
      </Typography>
    )}
  </div>
);