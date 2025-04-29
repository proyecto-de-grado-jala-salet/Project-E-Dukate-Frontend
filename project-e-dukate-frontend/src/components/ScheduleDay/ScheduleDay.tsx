// src/components/ScheduleDay/ScheduleDay.tsx
import React from "react";
import { Box, Typography, FormControlLabel, Checkbox, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { TimeSlotEditor } from "../TimeSlotEditor";
import { ScheduleDto } from "@/types/schedule";
import { daysOfWeek } from "@/utils/scheduleUtils";
import { Dayjs } from "dayjs";
import { canAddTimeSlot } from "@/utils/scheduleUtils";

interface ScheduleDayProps {
  schedule: ScheduleDto;
  dayIndex: number;
  onAttendsChange: (dayIndex: number, checked: boolean) => void;
  onTimeChange: (
    dayIndex: number,
    slotIndex: number,
    field: "startTime" | "endTime",
    value: Dayjs | null
  ) => void;
  onAddTimeSlot: (dayIndex: number) => void;
  onRemoveTimeSlot: (dayIndex: number, slotIndex: number) => void;
}

export const ScheduleDay: React.FC<ScheduleDayProps> = ({
  schedule,
  dayIndex,
  onAttendsChange,
  onTimeChange,
  onAddTimeSlot,
  onRemoveTimeSlot,
}) => {
  const canAdd = canAddTimeSlot(schedule.timeSlots);

  return (
    <Box
      sx={{
        px: 6,
        py: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: schedule.attends ? "flex-start" : "center",
        borderBottom:
          dayIndex < daysOfWeek.length - 1 ? "1px solid #e0e0e0" : "none",
        bgcolor: "white",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "330px" }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", color: "black", mb: 1 }}
        >
          {daysOfWeek[dayIndex].label.toUpperCase()}
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={schedule.attends}
              onChange={(e) => onAttendsChange(dayIndex, e.target.checked)}
            />
          }
          label="Atiende"
          sx={{ color: "black" }}
        />
      </Box>

      {schedule.attends && (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {schedule.timeSlots.map((slot, slotIndex) => (
            <TimeSlotEditor
              key={slotIndex}
              slot={slot}
              slotIndex={slotIndex}
              dayIndex={dayIndex}
              canDelete={schedule.timeSlots.length > 1}
              onTimeChange={onTimeChange}
              onRemove={onRemoveTimeSlot}
            />
          ))}
          {canAdd && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                onClick={() => onAddTimeSlot(dayIndex)}
                sx={{ color: "#757575" }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ScheduleDay;