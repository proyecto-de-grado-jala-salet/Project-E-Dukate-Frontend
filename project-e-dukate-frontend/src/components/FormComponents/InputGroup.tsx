import React from 'react';
import { Box } from '@mui/material';
import { TextField } from '../TextField';

interface InputField {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  render?: () => React.ReactNode;
}

interface InputGroupProps {
  fields: InputField[];
}

export const InputGroup: React.FC<InputGroupProps> = ({ fields }) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      {fields.map((field, index) => (
        <Box key={index} sx={{ flex: 1 }}>
          {field.render ? (
            field.render()
          ) : (
            <TextField
              label={field.label}
              value={field.value}
              onChange={field.onChange}
              required={field.required}
              sx={{ flex: 1 }}
            />
          )}
        </Box>
      ))}
    </Box>
  );
};