import React from "react";
import { Box, Typography } from "@mui/material";
import { HiOutlineFilter } from "react-icons/hi";
import { FilterButton } from "../FilterButton";
import { Button } from "../Button";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";

interface FilterOption {
  value: string;
  label: string;
}

interface PaymentFiltersProps {
  specialistId: string;
  year: string;
  month: string;
  day: string;
  status: string;
  setSpecialistId: (value: string) => void;
  setYear: (value: string) => void;
  setMonth: (value: string) => void;
  setDay: (value: string) => void;
  setStatus: (value: string) => void;
  specialists: FilterOption[];
  statuses: FilterOption[];
  onResetFilters: () => void;
}

export const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  specialistId,
  year,
  month,
  day,
  status,
  setSpecialistId,
  setYear,
  setMonth,
  setDay,
  setStatus,
  specialists,
  statuses,
  onResetFilters,
}) => {
  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        alignItems: "center",
        bgcolor: "#fff",
        p: 0.5,
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        width: "56%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1,
          py: 0.5,
          borderRight: "1px solid #e0e0e0",
        }}
      >
        <HiOutlineFilter size={20} color="#000" />
        <Typography
          variant="body2"
          sx={{ ml: 2.5, color: "#000", fontWeight: 500 }}
        >
          Filtrar por
        </Typography>
      </Box>

      <FilterButton
        label="Especialista"
        value={specialistId}
        onChange={setSpecialistId}
        options={specialists}
        type="dropdown"
      />

      <FilterButton
        label="Años"
        value={year}
        onChange={setYear}
        type="year"
      />

      <FilterButton
        label="Meses"
        value={month}
        onChange={setMonth}
        type="month"
      />

      <FilterButton
        label="Día"
        value={day}
        onChange={setDay}
        options={[
          { value: "", label: "Días" },
          ...Array.from({ length: 31 }, (_, i) => ({
            value: (i + 1).toString().padStart(2, "0"),
            label: (i + 1).toString().padStart(2, "0"),
          })),
        ]}
        type="dropdown"
      />

      <FilterButton
        label="Estado"
        value={status}
        onChange={setStatus}
        options={statuses}
        type="dropdown"
      />

      <Box
        sx={{
          px: 0.5,
          py: 0.5,
          borderLeft: "1px solid #e0e0e0",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ReplayOutlinedIcon fontSize="small" />}
          sx={{
            borderRadius: "8px",
            minWidth: "100px",
            height: "32px",
            fontSize: "14px",
            textTransform: "none",
            borderColor: "transparent",
            color: "red",
          }}
          onClick={onResetFilters}
          label={"Restablecer filtro"}
        />
      </Box>
    </Box>
  );
};