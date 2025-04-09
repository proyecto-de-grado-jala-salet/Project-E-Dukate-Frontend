import React from "react";
import { Button } from "@mui/material";

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({ label, onClick, className }) => (
  <Button
    //variant="contained"
    onClick={onClick}
    className={className}
    //sx={{ backgroundColor: "#42a5f5", textTransform: "none", borderRadius: 2, padding: "8px 24px" }}
  >
    {label}
  </Button>
);