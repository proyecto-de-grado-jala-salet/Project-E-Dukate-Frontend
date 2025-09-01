import React from "react";
import Chip from '@mui/material/Chip';
import { type SxProps, type Theme } from '@mui/material/styles';

interface GenericChipProps {
  label: string;
  sx?: SxProps<Theme>;
  onDelete?: () => void;
}

export const GenericChip: React.FC<GenericChipProps> = ({
  label,
  sx,
  onDelete,
}) => {
  return (
    <Chip
      label={label}
      onDelete={onDelete}
      sx={{
        color: "#fff",
        backgroundColor: "#013c28",
        ...sx,
      }}
    />
  );
};
