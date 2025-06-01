import React from "react";
import { Box, Typography } from "@mui/material";
import { ScheduleDay } from "../ScheduleDay";
import { Button } from "../Button";
import { useRouter } from "next/navigation";
import { ScheduleDto } from "@/types/schedule";
import { Dayjs } from "dayjs";

interface ScheduleFormProps {
  specialistName: string;
  schedules: ScheduleDto[];
  loading: boolean;
  onAttendsChange: (dayIndex: number, checked: boolean) => void;
  onTimeChange: (
    dayIndex: number,
    slotIndex: number,
    field: "startTime" | "endTime",
    value: Dayjs | null
  ) => void;
  onAddTimeSlot: (dayIndex: number) => void;
  onRemoveTimeSlot: (dayIndex: number, slotIndex: number) => void;
  onSubmit: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  specialistName,
  schedules,
  loading,
  onAttendsChange,
  onTimeChange,
  onAddTimeSlot,
  onRemoveTimeSlot,
  onSubmit,
}) => {
  const router = useRouter();

  if (loading) return <Typography>Cargando...</Typography>;

  return (
    <Box sx={{ px: 30, py: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "black", mb: 3 }}>
        {specialistName}
      </Typography>

      <Box sx={{ border: "1px solid #e0e0e0", borderRadius: "8px", overflow: "hidden" }}>
        <Box
          sx={{
            bgcolor: "#ffffff",
            px: 6,
            py: 3,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", color: "black" }}
          >
            Crear Horario
          </Typography>
        </Box>

        {schedules.map((schedule, dayIndex) => (
          <ScheduleDay
            key={schedule.dayOfWeek}
            schedule={schedule}
            dayIndex={dayIndex}
            onAttendsChange={onAttendsChange}
            onTimeChange={onTimeChange}
            onAddTimeSlot={onAddTimeSlot}
            onRemoveTimeSlot={onRemoveTimeSlot}
          />
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
        <Button
          label="Cancelar"
          onClick={() => router.push("/dashboard/horarios")}
          variant="outlined"
          color="error"
        />
        <Button
          label="Aceptar"
          onClick={onSubmit}
          variant="contained"
          color="primary"
          sx={{ color: "#000000", bgcolor: "#f5a623", "&:hover": { bgcolor: "#e69520" } }}
        />
      </Box>
    </Box>
  );
};

export default ScheduleForm;