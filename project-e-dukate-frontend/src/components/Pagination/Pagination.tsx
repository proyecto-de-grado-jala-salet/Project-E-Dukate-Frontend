import React from 'react';
import { Box, Typography, IconButton, SxProps } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sx?: SxProps;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  sx,
}) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, ...sx }}>
      <Typography sx={{ color: 'black' }}>
        Página {currentPage} de {totalPages}
      </Typography>
      <Box>
        <IconButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          sx={{ mr: 1, color: 'black' }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          sx={{ mr: 1, color: 'black' }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Pagination;