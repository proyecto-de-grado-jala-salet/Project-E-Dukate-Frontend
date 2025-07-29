import React from "react";
import { Box, Button } from "@mui/material";

interface PDFViewerProps {
  fileUrl: string;
  onClose: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, onClose }) => {

  return (
    <Box sx={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100%", 
      height: "100%", 
      bgcolor: "rgba(0,0,0,0.8)", 
      zIndex: 1300, 
      overflow: "auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Box sx={{ 
        width: "90%", 
        maxWidth: "1000px",
        bgcolor: "white", 
        p: 3, 
        borderRadius: 2,
        margin: "auto"
      }}>
        <iframe 
          src={fileUrl} 
          width="100%" 
          height="650px"
          title="PDF Viewer"
          style={{ border: "none" }}
        ></iframe>
        <Button 
          variant="contained" 
          onClick={onClose} 
          sx={{ 
            bgcolor: "#F4A601",
            color: "#000000",
            textTransform: "none",
            my: 1,
            px: 3,
            py: 1,
            borderRadius: "10px",
          }}
        >
          Cerrar
        </Button>
      </Box>
    </Box>
  );
};