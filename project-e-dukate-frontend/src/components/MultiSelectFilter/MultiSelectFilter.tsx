"use client";

import React from 'react';
import { FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import { Box } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 'auto',
      minWidth: 280,
    },
  },
};

interface FilterOption {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: FilterOption[];
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({ label, value, onChange, options }) => {
  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const { target: { value: newValue } } = event;
    onChange(typeof newValue === 'string' ? newValue.split(',') : newValue);
  };

  const longestLabel = options.reduce((max, opt) => Math.max(max, opt.label.length), 0);
  const estimatedWidth = Math.min(Math.max(longestLabel * 8, 200), 500);

  return (
    <Box
      sx={{
        px: 0.5,
        py: 0.5,
        borderLeft: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <FormControl sx={{ width: { xs: '100%', sm: estimatedWidth }, height: 32 }}>
        {value.length === 0 && (
          <InputLabel
            id={`${label}-multi-select-label`}
            sx={{ color:"#000", top: '-10px', textAlign: "center", width: "100%" }}
            shrink={false}
          >
            {label}
          </InputLabel>
        )}
        <Select
          labelId={`${label}-multi-select-label`}
          id={`${label}-multi-select`}
          multiple
          value={value}
          onChange={handleChange}
          input={
            <OutlinedInput
              id={`${label}-select`}
              label={value.length === 0 ? label : undefined}
              notched={false}
            />
          }
          renderValue={(selected) =>
            selected.map(val => options.find(opt => opt.value === val)?.label || val).join(', ')
          }
          MenuProps={{
            ...MenuProps,
            PaperProps: {
              ...MenuProps.PaperProps,
              style: {
                ...MenuProps.PaperProps.style,
                width: estimatedWidth,
              },
            },
          }}
          sx={{
            height: 32,
            '.MuiOutlinedInput-input': { padding: '6px 14px' },
            '.MuiSelect-select': { paddingRight: '24px !important' },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox checked={value.includes(option.value)} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};