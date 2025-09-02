"use client"
import React from "react";
import { useSchedules } from "@/hooks/useSchedules";
import { useSpecialist } from "@/hooks/useSpecialist";
import { Dayjs } from "dayjs";
import { calculateNextTimeSlot } from "@/utils/scheduleUtils";
import { showNotification } from "@/services/notificationService";
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';

const ScheduleForm = dynamic(() => 
  import('@/components/ScheduleForm/ScheduleForm').then(mod => mod.ScheduleForm), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

export const ScheduleEdit: React.FC = () => {
  const { schedules, setSchedules, loading, handleSubmit } = useSchedules();
  const { specialistName } = useSpecialist();

  const handleAttendsChange = (dayIndex: number, checked: boolean) => {
    setSchedules((prev) =>
      prev.map((sched, idx) =>
        idx === dayIndex
          ? {
              ...sched,
              attends: checked,
              timeSlots:
                checked && sched.timeSlots.length === 0
                  ? [calculateNextTimeSlot([])]
                  : sched.timeSlots,
            }
          : sched
      )
    );
  };

  const handleTimeChange = (
    dayIndex: number,
    slotIndex: number,
    field: "startTime" | "endTime",
    value: Dayjs | null
  ) => {
    if (!value) return;
    const formattedTime = value.format("HH:mm");
    setSchedules((prev) =>
      prev.map((sched, idx) =>
        idx === dayIndex
          ? {
              ...sched,
              timeSlots: sched.timeSlots.map((slot, sIdx) =>
                sIdx === slotIndex ? { ...slot, [field]: formattedTime } : slot
              ),
            }
          : sched
      )
    );
  };

  const addTimeSlot = (dayIndex: number) => {
    try {
      setSchedules((prev) =>
        prev.map((sched, idx) =>
          idx === dayIndex
            ? {
                ...sched,
                timeSlots: [
                  ...sched.timeSlots,
                  calculateNextTimeSlot(sched.timeSlots),
                ],
              }
            : sched
        )
      );
    } catch (error) {
      showNotification(
        error instanceof Error
          ? error.message
          : "No se pudo agregar el slot.",
        "error"
      );
    }
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setSchedules((prev) =>
      prev.map((sched, idx) =>
        idx === dayIndex
          ? {
              ...sched,
              timeSlots: sched.timeSlots.filter((_, sIdx) => sIdx !== slotIndex),
            }
          : sched
      )
    );
  };

  return (
    <ScheduleForm
      specialistName={specialistName}
      schedules={schedules}
      loading={loading}
      onAttendsChange={handleAttendsChange}
      onTimeChange={handleTimeChange}
      onAddTimeSlot={addTimeSlot}
      onRemoveTimeSlot={removeTimeSlot}
      onSubmit={handleSubmit}
    />
  );
};

export default ScheduleEdit;