import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from "@mui/material/FormControl";
import { type SxProps, type Theme } from '@mui/material/styles';
import { type SelectChangeEvent } from '@mui/material/Select';
import Tooltip from "@mui/material/Tooltip";
import { statuses } from "@/utils/medicalHistoryConstants";
import { statusColors } from "@/utils/medicalHistoryConstants";
import { formatStatusLabel } from "@/utils/medicalHistoryConstants";
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
                    {formatStatusLabel(value)}
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
                    {formatStatusLabel(status)}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {userRole !== "Administrator" && (
        <Tooltip title={isAddConsultationDisabled ? "No tienes permisos para añadir consultas" : ""}>
          <span>
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
                borderRadius: "10px",
              }}
            >
              Añadir Consulta
            </Button>
          </span>
        </Tooltip>
      )}
    </Box>
  );
};