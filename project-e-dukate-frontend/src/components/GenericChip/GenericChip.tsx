import React from "react";
import { Chip, SxProps, Theme } from "@mui/material";

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
