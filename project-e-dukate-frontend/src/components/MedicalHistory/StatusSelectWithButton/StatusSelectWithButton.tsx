import React from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  SxProps,
  Theme,
  SelectChangeEvent,
} from "@mui/material";
import { statuses, statusColors } from "@/utils/medicalHistoryConstants";
import { baseSelectStyles } from "@/utils/theme";

interface StatusSelectWithButtonProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onAddConsultation: () => void;
  isStatusDropdownDisabled: boolean;
  isAddButtonDisabled: boolean;
  width?: number;
  sx?: SxProps<Theme>;
  userRole: string | null;
  canEditSelectedSpecialist: boolean;
}

export const StatusSelectWithButton: React.FC<StatusSelectWithButtonProps> = ({
  selectedStatus,
  setSelectedStatus,
  onAddConsultation,
  isStatusDropdownDisabled,
  isAddButtonDisabled,
  width = 250,
  sx,
  userRole,
  canEditSelectedSpecialist,
}) => {
  const handleChange = (e: SelectChangeEvent<string>) => {
    setSelectedStatus(e.target.value);
  };

  const isStatusSelectDisabled = isStatusDropdownDisabled || !canEditSelectedSpecialist;
  const isAddConsultationDisabled = isAddButtonDisabled || !canEditSelectedSpecialist;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="body1"
          sx={{ color: "#000000", fontWeight: "bold" }}
        >
          Estado:
        </Typography>
        <FormControl sx={{ width }}>
          <Select
            value={selectedStatus}
            onChange={handleChange}
            disabled={isStatusSelectDisabled}
            sx={{ ...baseSelectStyles, ...sx }}
            displayEmpty
            renderValue={(value) =>
              value ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor:
                        statusColors[value as keyof typeof statusColors],
                    }}
                  />
                  <Typography variant="body1" sx={{ color: "#000000" }}>
                    {value}
                  </Typography>
                </Box>
              ) : (
                <em style={{ color: "#000000" }}>Seleccione un estado</em>
              )
            }
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status} sx={{ color: "#000000" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor:
                        statusColors[status as keyof typeof statusColors],
                    }}
                  />
                  <Typography variant="body1" sx={{ color: "#000000" }}>
                    {status}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {userRole !== "Administrator" && (
        <Button
          variant="contained"
          onClick={onAddConsultation}
          disabled={isAddConsultationDisabled}
          sx={{
            bgcolor: "#F4A601",
            color: "#000000",
            textTransform: "none",
            px: 3,
            py: 1,
          }}
        >
          Añadir Consulta
        </Button>
      )}
    </Box>
  );
};
