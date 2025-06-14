import React from "react";
import { Box, Typography } from "@mui/material";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
}) => {
  return (
    <Box
      sx={{
        bgcolor: "white",
        p: 5,
        borderRadius: "12px",
        mb: 3,
        boxShadow: 1,
        position: "relative",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, p: "0px 0px 40px 0px", fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "100px",
          borderBottom: "1px solid #D0D0D0",
          mb: 2,
        }}
      />
      {children}
    </Box>
  );
};
