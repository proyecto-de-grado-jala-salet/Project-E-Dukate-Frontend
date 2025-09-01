import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TextField } from "../TextField";

interface EditableCurrencyFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const EditableCurrencyField: React.FC<EditableCurrencyFieldProps> = ({
  value,
  onChange,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
      }}
    >
      <TextField
        value={value}
        onChange={onChange}
        sx={{
          "& .MuiInputBase-root": { height: "auto" },
          width: "70px",
        }}
        type="number"
        placeholder="0"
      />
      <Typography sx={{ color: "black" }}>bs.</Typography>
    </Box>
  );
};
