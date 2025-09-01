import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs, { Dayjs } from "dayjs";
import { TimeSlotDto } from "@/types/schedule";

interface TimeSlotEditorProps {
  slot: TimeSlotDto;
  slotIndex: number;
  dayIndex: number;
  canDelete: boolean;
  onTimeChange: (
    dayIndex: number,
    slotIndex: number,
    field: "startTime" | "endTime",
    value: Dayjs | null
  ) => void;
  onRemove: (dayIndex: number, slotIndex: number) => void;
}

export const TimeSlotEditor: React.FC<TimeSlotEditorProps> = ({
  slot,
  slotIndex,
  dayIndex,
  canDelete,
  onTimeChange,
  onRemove,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderRadius: "4px",
        p: 1,
      }}
    >
      <TimePicker
        label=""
        value={dayjs(slot.startTime, "HH:mm")}
        onChange={(value) => onTimeChange(dayIndex, slotIndex, "startTime", value)}
        ampm={true}
        slots={{ openPickerIcon: AccessTimeIcon }}
        sx={{
          width: "330px",
          "& .MuiInputBase-root": {
            borderRadius: "4px",
            bgcolor: "white",
            border: "1px solid #e0e0e0",
            paddingRight: "30px",
          },
          "& .MuiInputBase-input": {
            padding: "8px 14px",
            fontSize: "14px",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "20px",
          },
        }}
      />
      <TimePicker
        label=""
        value={dayjs(slot.endTime, "HH:mm")}
        onChange={(value) => onTimeChange(dayIndex, slotIndex, "endTime", value)}
        ampm={true}
        slots={{ openPickerIcon: AccessTimeIcon }}
        sx={{
          width: "330px",
          "& .MuiInputBase-root": {
            borderRadius: "4px",
            bgcolor: "white",
            border: "1px solid #e0e0e0",
            paddingRight: "30px",
          },
          "& .MuiInputBase-input": {
            padding: "8px 14px",
            fontSize: "14px",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "20px",
          },
        }}
      />
      {canDelete && (
        <IconButton onClick={() => onRemove(dayIndex, slotIndex)}>
          <DeleteIcon sx={{ color: "#757575" }} />
        </IconButton>
      )}
    </Box>
  );
};

export default TimeSlotEditor;