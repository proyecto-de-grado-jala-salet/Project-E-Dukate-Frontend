/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Box, Typography, Button, Popover } from '@mui/material';
import { HiOutlineFilter } from 'react-icons/hi';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import { FilterButton } from '../FilterButton';
import { MultiSelectFilter } from '../MultiSelectFilter';
import { Filter } from '@/types/filterOption';
import { DateRangePicker } from 'react-date-range';
import { startOfWeek } from 'date-fns';
import { endOfWeek } from 'date-fns';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { staticRanges } from '@/utils/dateRangeConstants'
import { inputRanges } from '@/utils/dateRangeConstants'
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";

interface GenericFilterContainerProps {
  filters: Filter[];
  onResetFilters: () => void;
}

export const GenericFilterContainer: React.FC<GenericFilterContainerProps> = ({
  filters,
  onResetFilters,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [currentWeekFilterIndex, setCurrentWeekFilterIndex] = useState<number | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setCurrentWeekFilterIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentWeekFilterIndex(null);
  };

  const handleWeekSelect = (ranges: any) => {
    if (currentWeekFilterIndex !== null) {
      const filter = filters[currentWeekFilterIndex] as Filter & {
        type: 'week-range';
        value: { startDate: Date; endDate: Date } | null;
      };
      const startDate = startOfWeek(ranges.selection.startDate, { weekStartsOn: 1, locale: es });
      const endDate = endOfWeek(ranges.selection.endDate, { weekStartsOn: 1, locale: es });
      filter.onChange({ startDate, endDate });
      handleClose();
    }
  };

  return (
    <>
      <style>
        {`
          .rdrDateRangePickerWrapper .rdrDefinedRangesWrapper .rdrStaticRangeSelected {
            color: #013c28 !important;
          }
          .rdrDateRangePickerWrapper .rdrDay:not(.rdrDayPassive) .rdrInRange,
          .rdrDateRangePickerWrapper .rdrDay:not(.rdrDayPassive) .rdrStartEdge,
          .rdrDateRangePickerWrapper .rdrDay:not(.rdrDayPassive) .rdrEndEdge,
          .rdrDateRangePickerWrapper .rdrDay:not(.rdrDayPassive) .rdrSelected {
            background-color: #013c28 !important;
          }
          .rdrDateRangePickerWrapper .rdrDay:not(.rdrDayPassive) .rdrDayNumber span.rdrSelected {
            color: #ffffff !important;
          }
          .rdrDateRangePickerWrapper .rdrDayToday .rdrDayNumber span:after {
            color: #ffffff !important;
            background: #013c28 !important;
          }
          .rdrDateRangePickerWrapper .rdrDateDisplayItemActive {
            background-color: #013c28 !important;
            color: #ffffff !important;
          }
          .rdrDateRangePickerWrapper .rdrDateDisplayItem {
            background-color: #f5f5f5 !important;
            color: #000000 !important;
          }
          .rdrDateRangePickerWrapper .rdrDateInput input {
            color: inherit !important;
          }
          .rdrDateRangePickerWrapper .rdrDayStartPreview,
          .rdrDateRangePickerWrapper .rdrDayEndPreview {
            border: 1px solid #013c28 !important;
          }
          .rdrDayInPreview {
            border-top: 1px solid #013c28 !important;
            border-bottom: 1px solid #013c28 !important;
            border-left: none !important;
            border-right: none !important;
          }
          .rdrInputRanges {
            font-size: 12px !important;
            padding: 8px 12px !important;
          }
          .rdrInputRangeInput {
            border-radius: 4px !important;
            border: 1px solid #e0e0e0 !important;
            padding: 4px !important;
            margin-left: 8px !important;
          }
        `}
      </style>
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
            py: 1,
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
            ) : filter.type === 'week-range' ? (
              <Button
                variant="outlined"
                sx={{
                  borderRadius: '8px',
                  minWidth: '150px',
                  height: '32px',
                  fontSize: '14px',
                  textTransform: 'none',
                  borderColor: '#e0e0e0',
                  color: '#000',
                  mx: 0.5,
                }}
                onClick={(event) => handleClick(event, index)}
              >
                {filter.value
                  ? `${format(filter.value.startDate, 'dd/MM/yyyy', { locale: es })} - ${format(
                      filter.value.endDate,
                      'dd/MM/yyyy',
                      { locale: es }
                    )}`
                  : filter.label}
              </Button>
            ) : filter.type === "date" ? (
              <Box
                sx={{
                  mx: 0.5,
                  width: "180px",
                  minWidth: "180px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: "transparent",
                    backgroundColor: "transparent",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "transparent",
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "transparent",
                  },
                  borderLeft: { xs: "none", sm: "1px solid #e0e0e0" },
                  px: 0.5,
                  py: 0.5,
                }}
              >
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="es"
                >
                  <DatePicker
                    value={filter.value ? dayjs(filter.value) : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        filter.onChange(newValue.format("YYYY-MM-DD"));
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        sx: {
                          "& .MuiInputBase-root": {
                            height: "32px",
                          },
                          "& .MuiInputBase-input": {
                            padding: "8.5px 14px",
                            fontSize: "14px",
                          },
                        },
                      },
                      inputAdornment: {
                        sx: {
                          "& .MuiButtonBase-root": {
                            color: "#000",
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
            ) : (
              <FilterButton
                label={filter.label}
                value={filter.value}
                onChange={filter.onChange}
                options={filter.options}
                type={filter.type}
                minDate={filter.minDate}
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
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <DateRangePicker
            ranges={
              currentWeekFilterIndex !== null &&
              filters[currentWeekFilterIndex]?.type === 'week-range' &&
              filters[currentWeekFilterIndex].value
                ? [
                    {
                      startDate: (filters[currentWeekFilterIndex] as any).value!.startDate,
                      endDate: (filters[currentWeekFilterIndex] as any).value!.endDate,
                      key: 'selection',
                    },
                  ]
                : [{ startDate: new Date(), endDate: new Date(), key: 'selection' }]
            }
            onChange={handleWeekSelect}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
            weekStartsOn={1}
            locale={es}
            staticRanges={staticRanges}
            inputRanges={inputRanges}
          />
        </Popover>
      </Box>
    </>
  );
};