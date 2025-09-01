import React from 'react';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioButtonGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  orientation?: 'vertical' | 'horizontal';
  required?: boolean;
  sx?: object;
}

export const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  label,
  value,
  onChange,
  options,
  orientation = 'vertical',
  required = false,
  sx,
}) => {
  return (
    <FormControl sx={sx}>
      <FormLabel sx={{ fontWeight: 'bold', color: 'black' }}>
        {label}
        {required && <span style={{ color: 'red' }}> *</span>}
      </FormLabel>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        row={orientation === 'horizontal'}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
            sx={{ mb: orientation === 'vertical' ? 1 : 0 }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};