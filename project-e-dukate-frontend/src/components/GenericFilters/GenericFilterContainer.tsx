import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { HiOutlineFilter } from 'react-icons/hi';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import { FilterButton } from '../FilterButton';
import { MultiSelectFilter } from '../MultiSelectFilter';
import { FilterOption } from '@/types/filterOption';

interface BaseFilterConfig {
  label: string;
}

interface SingleSelectFilterConfig extends BaseFilterConfig {
  type: 'dropdown' | 'year' | 'month';
  value: string;
  onChange: (value: string) => void;
  options?: FilterOption[];
}

interface MultiSelectFilterConfig extends BaseFilterConfig {
  type: 'multi-select';
  value: string[];
  onChange: (value: string[]) => void;
  options: FilterOption[];
}

type FilterConfig = SingleSelectFilterConfig | MultiSelectFilterConfig;

interface GenericFilterContainerProps {
  filters: FilterConfig[];
  onResetFilters: () => void;
}

export const GenericFilterContainer: React.FC<GenericFilterContainerProps> = ({
  filters,
  onResetFilters,
}) => {
  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        alignItems: 'center',
        bgcolor: '#fff',
        p: 0.5,
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        width: 'fit-content',
        gap: { xs: 1, sm: 0 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1,
          py: 0.5,
          borderRight: { xs: 'none', sm: '1px solid #e0e0e0' },
        }}
      >
        <HiOutlineFilter size={20} color="#000" />
        <Typography variant="body2" sx={{ ml: 2.5, color: '#000', fontWeight: 500 }}>
          Filtrar por
        </Typography>
      </Box>
      {filters.map((filter, index) => (
        <React.Fragment key={index}>
          {filter.type === 'multi-select' ? (
            <MultiSelectFilter
              label={filter.label}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
            />
          ) : (
            <FilterButton
              label={filter.label}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
              type={filter.type}
            />
          )}
        </React.Fragment>
      ))}
      <Box sx={{ px: 0.5, py: 0.5, borderLeft: { xs: 'none', sm: '1px solid #e0e0e0' } }}>
        <Button
          variant="outlined"
          startIcon={<ReplayOutlinedIcon fontSize="small" />}
          sx={{
            borderRadius: '8px',
            minWidth: '100px',
            height: '32px',
            fontSize: '14px',
            textTransform: 'none',
            borderColor: 'transparent',
            color: 'red',
          }}
          onClick={onResetFilters}
        >
          Restablecer filtro
        </Button>
      </Box>
    </Box>
  );
};