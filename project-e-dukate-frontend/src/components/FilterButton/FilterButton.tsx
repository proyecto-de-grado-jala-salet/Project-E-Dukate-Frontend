"use client";

import React, { useState } from "react";
import { Box, Button, Menu, MenuItem, Popover } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { YearCalendar } from "@mui/x-date-pickers/YearCalendar";
import { MonthCalendar } from "@mui/x-date-pickers/MonthCalendar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface FilterButtonProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  type?: "dropdown" | "year" | "month" | "date";
  minDate?: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  value,
  onChange,
  options = [],
  type = "dropdown",
  minDate,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedYear, setSelectedYear] = useState<dayjs.Dayjs | null>(
    value && type === "year" ? dayjs().year(parseInt(value)) : null
  );
  const [selectedMonth, setSelectedMonth] = useState<dayjs.Dayjs | null>(
    value && type === "month" ? dayjs().month(parseInt(value) - 1) : null
  );
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(
    value && type === "date" ? dayjs(value) : null
  );

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

  const handleYearChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedYear(date);
      onChange(date.year().toString());
      handleClose();
    }
  };

  const handleMonthChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedMonth(date);
      onChange((date.month() + 1).toString().padStart(2, "0"));
      handleClose();
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      onChange(date.format('YYYY-MM-DD'));
      handleClose();
    }
  };

  const getDisplayValue = () => {
    switch (type) {
      case "year":
        return value || "Años";
      case "month":
        if (!value) return "Meses";
        const monthIndex = parseInt(value) - 1;
        return dayjs().month(monthIndex).format("MMMM");
      case "date":
        return value ? dayjs(value).format('DD/MM/YYYY') : label;
      default:
        return options.find((opt) => opt.value === value)?.label || label;
    }
  };

  const renderCalendarContent = () => {
    if (type === "year") {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <Box sx={{ p: 2 }}>
            <YearCalendar
              value={selectedYear}
              onChange={handleYearChange}
              minDate={dayjs().subtract(10, "year")}
              maxDate={dayjs().add(5, "year")}
            />
          </Box>
        </LocalizationProvider>
      );
    }

    if (type === "month") {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <Box sx={{ p: 2 }}>
            <MonthCalendar value={selectedMonth} onChange={handleMonthChange} />
          </Box>
        </LocalizationProvider>
      );
    }

    if (type === "date") {
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <Box sx={{ p: 2 }}>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              minDate={minDate ? dayjs(minDate) : undefined}
              slotProps={{
                textField: { size: 'small', fullWidth: true },
              }}
            />
          </Box>
        </LocalizationProvider>
      );
    }

    return null;
  };

  const displayValue = getDisplayValue();

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
          textTransform: type === "month" ? "capitalize" : "none",
          borderColor: "transparent",
          color: "#000",
          fontSize: "14px",
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        {displayValue}
        {type === "year" || type === "month" || type === "date" ? (
          <CalendarTodayIcon sx={{ fontSize: 16, ml: 1 }} />
        ) : (
          <span style={{ marginLeft: "8px" }}>▼</span>
        )}
      </Button>

      {type === "year" || type === "month" || type === "date" ? (
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {renderCalendarContent()}
        </Popover>
      ) : (
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
        </Menu>
      )}
    </Box>
  );
};