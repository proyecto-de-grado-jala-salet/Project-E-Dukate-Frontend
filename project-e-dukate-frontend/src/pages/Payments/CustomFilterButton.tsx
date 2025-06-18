import React, { useState } from "react";
import { Box, Button, Menu, MenuItem } from "@mui/material";

interface CustomFilterButtonProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  isYearSelector?: boolean;
  isMonthSelector?: boolean;
}

export const CustomFilterButton: React.FC<CustomFilterButtonProps> = ({
  label,
  value,
  onChange,
  options,
  isYearSelector,
  isMonthSelector,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (value: string) => {
    onChange(value);
    handleClose();
  };

  const displayValue = options.find((opt) => opt.value === value)?.label || 
    (isYearSelector ? (value || label) : 
    isMonthSelector ? (value || label) : "Seleccione una opción");

  return (
    <Box
      sx={{
        px: 0.5,
        py: 0.5,
        borderLeft: "1px solid #e0e0e0",
        "&:first-of-type": {
          borderLeft: "none",
        },
      }}
    >
      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{
          borderRadius: "8px",
          height: "32px",
          minWidth: "100px",
          textTransform: "none",
          borderColor: "#e0e0e0",
          color: "#333",
          fontSize: "14px",
          "&:hover": {
            borderColor: "#1976d2",
            backgroundColor: "rgba(25, 118, 210, 0.04)",
          },
          padding: "0 8px",
        }}
      >
        {displayValue} <span style={{ marginLeft: "8px" }}>▼</span>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 200,
            width: 200,
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
            selected={option.value === value}
          >
            {option.label}
          </MenuItem>
        ))}
        {isYearSelector && (
          Array.from({ length: 11 }, (_, i) => {
            const year = new Date().getFullYear() - 5 + i;
            return (
              <MenuItem
                key={year}
                onClick={() => handleSelect(year.toString())}
                selected={year.toString() === value}
              >
                {year}
              </MenuItem>
            );
          })
        )}
        {isMonthSelector && (
          Array.from({ length: 12 }, (_, i) => {
            const month = (i + 1).toString().padStart(2, "0");
            return (
              <MenuItem
                key={month}
                onClick={() => handleSelect(month)}
                selected={month === value}
              >
                {new Date(0, i).toLocaleString("es-ES", { month: "long" })}
              </MenuItem>
            );
          })
        )}
      </Menu>
    </Box>
  );
};