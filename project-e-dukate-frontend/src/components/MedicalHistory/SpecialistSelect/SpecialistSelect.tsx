import React from "react";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { FormControl } from "@mui/material";
import { Select } from "@mui/material";
import { MenuItem } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { SxProps } from "@mui/material";
import { Theme } from "@mui/material";
import { Specialist } from "@/types/userTypes";
import { GenericChip } from "@/components/GenericChip";
import { MenuProps } from "@/utils/medicalHistoryConstants";
import { baseSelectStyles } from "@/utils/theme";

interface SpecialistSelectProps<T extends string | string[]> {
  label: string;
  specialists: Specialist[];
  value: T;
  onChange: (value: T) => void;
  multiple?: boolean;
  width?: number;
  sx?: SxProps<Theme>;
}

export const SpecialistSelect = <T extends string | string[]>({
  label,
  specialists,
  value,
  onChange,
  multiple = false,
  width = 290,
  sx,
}: SpecialistSelectProps<T>) => {
  const handleChange = (e: SelectChangeEvent<T>) => {
    onChange(e.target.value as T);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body1" sx={{ color: "#000000", fontWeight: "bold" }}>
        {label}:
      </Typography>
      <FormControl sx={{ width }}>
        <Select
          multiple={multiple}
          value={value}
          onChange={handleChange}
          sx={{ ...baseSelectStyles, ...sx }}
          displayEmpty
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {multiple ? (
                (selected as string[]).length > 0 ? (
                  <>
                    {(selected as string[]).slice(0, 3).map((value) => {
                      const specialist = specialists.find(
                        (s) => s.id === value
                      );
                      return specialist ? (
                        <GenericChip
                          key={value}
                          label={`${specialist.names} ${specialist.lastNamePaternal}`}
                        />
                      ) : null;
                    })}
                    {(selected as string[]).length > 3 && (
                      <GenericChip label="..." />
                    )}
                  </>
                ) : (
                  <Typography sx={{ color: "#000000", fontStyle: "italic" }}>
                    Seleccione un especialista
                  </Typography>
                )
              ) : selected ? (
                (() => {
                  const specialist = specialists.find((s) => s.id === selected);
                  return specialist ? (
                    <GenericChip
                      label={`${specialist.names} ${specialist.lastNamePaternal}`}
                    />
                  ) : null;
                })()
              ) : (
                <Typography sx={{ color: "#000000", fontStyle: "italic" }}>
                  Seleccione un especialista
                </Typography>
              )}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          <MenuItem value="" disabled>
            <Typography
              sx={{
                color: "#000000",
                fontWeight: "bold",
                fontStyle: "italic",
              }}
            >
              Seleccione un especialista
            </Typography>
          </MenuItem>
          {specialists.map((specialist) => (
            <MenuItem
              key={specialist.id}
              value={specialist.id}
              sx={{ color: "#000000" }}
            >
              {specialist.names} {specialist.lastNamePaternal}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
