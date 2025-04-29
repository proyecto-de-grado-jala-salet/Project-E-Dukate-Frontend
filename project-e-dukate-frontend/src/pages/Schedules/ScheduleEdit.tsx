/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useRouter, useParams } from 'next/navigation';
import { apiRequest } from '@/services/api';
import { showNotification } from '@/services/notificationService';
import { useEditStore } from '@/stores/editStore';
import { Button } from '@/components/Button';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs, { Dayjs } from 'dayjs';

interface ScheduleDto {
  dayOfWeek: string;
  timeSlots: TimeSlotDto[];
  attends: boolean;
}

interface TimeSlotDto {
  startTime: string;
  endTime: string;
}

interface BackendSchedule {
  specialistId: string;
  specialist: null;
  dayOfWeek: number;
  timeSlots: { startTime: string; endTime: string }[];
  attends: boolean;
  id: string;
}

const dayOfWeekMapping: { [key: number]: string } = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const daysOfWeek = [
  { value: 'Monday', label: 'Lunes' },
  { value: 'Tuesday', label: 'Martes' },
  { value: 'Wednesday', label: 'Miércoles' },
  { value: 'Thursday', label: 'Jueves' },
  { value: 'Friday', label: 'Viernes' },
  { value: 'Saturday', label: 'Sábado' },
  { value: 'Sunday', label: 'Domingo' },
];

export const ScheduleEdit: React.FC = () => {
  const router = useRouter();
  useParams();
  const { entityId } = useEditStore();
  const [specialistName, setSpecialistName] = useState<string>('');
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!entityId) return;
      setLoading(true);
      try {
        const response = await apiRequest<BackendSchedule[]>('schedules', 'GET', undefined, `specialist/${entityId}`);
        const fetchedSchedules = response.map((schedule: BackendSchedule) => {
          const dayString = dayOfWeekMapping[schedule.dayOfWeek];
          if (!dayString) {
            throw new Error(`Invalid dayOfWeek value: ${schedule.dayOfWeek}`);
          }
          return {
            dayOfWeek: dayString,
            timeSlots: schedule.timeSlots.map((slot) => ({
              startTime: slot.startTime.slice(0, 5),
              endTime: slot.endTime.slice(0, 5),
            })),
            attends: schedule.attends,
          };
        });

        const allSchedules = daysOfWeek.map((day) => {
          const existingSchedule = fetchedSchedules.find(
            (sched: ScheduleDto) => sched.dayOfWeek.toLowerCase() === day.value.toLowerCase()
          );
          return existingSchedule || { dayOfWeek: day.value, timeSlots: [], attends: false };
        });

        setSchedules(allSchedules);

        const specialistResponse = await apiRequest<any>('specialists', 'GET', undefined, entityId);
        setSpecialistName(`${specialistResponse.names} ${specialistResponse.lastNamePaternal} ${specialistResponse.lastNameMaternal || ''}`);
      } catch (error) {
        showNotification('Error al cargar los horarios: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [entityId]);

  const handleAttendsChange = (dayIndex: number, checked: boolean) => {
    setSchedules((prev) =>
      prev.map((sched, idx) =>
        idx === dayIndex
          ? { ...sched, attends: checked, timeSlots: checked && sched.timeSlots.length === 0 ? [{ startTime: '08:00', endTime: '12:00' }] : sched.timeSlots }
          : sched
      )
    );
  };

  const handleTimeChange = (dayIndex: number, slotIndex: number, field: 'startTime' | 'endTime', value: Dayjs | null) => {
    if (!value) return;
    const formattedTime = value.format('HH:mm');
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
    setSchedules((prev) =>
      prev.map((sched, idx) =>
        idx === dayIndex
          ? { ...sched, timeSlots: [...sched.timeSlots, { startTime: '08:00', endTime: '12:00' }] }
          : sched
      )
    );
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    setSchedules((prev) =>
      prev.map((sched, idx) =>
        idx === dayIndex
          ? { ...sched, timeSlots: sched.timeSlots.filter((_, sIdx) => sIdx !== slotIndex) }
          : sched
      )
    );
  };

  const handleSubmit = async () => {
    if (!entityId) return;
    try {
      const payload = schedules.map((sched) => ({
        dayOfWeek: sched.dayOfWeek,
        timeSlots: sched.attends
          ? sched.timeSlots.map((slot) => ({
              startTime: `${slot.startTime}:00`,
              endTime: `${slot.endTime}:00`,
            }))
          : [],
        attends: sched.attends,
      }));
      await apiRequest('schedules', 'PUT', payload, `specialist/${entityId}`);
      showNotification('Horarios actualizados con éxito', 'success');
      router.push('/dashboard/horarios');
    } catch (error) {
      showNotification('Error al actualizar los horarios: ' + (error instanceof Error ? error.message : 'Unknown error'), 'error');
    }
  };

  if (loading) return <Typography>Cargando...</Typography>;

  return (
    <Box sx={{ px: 30, py: 3 }}>
      {/* Título del especialista */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black', mb: 3 }}>
        {specialistName}
      </Typography>

      {/* Contenedor de la tabla */}
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        {/* Encabezado "Crear Horario" */}
        <Box sx={{ bgcolor: '#ffffff', px: 6, py: 3, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
            Crear Horario
          </Typography>
        </Box>

        {/* Lista de días */}
        {schedules.map((schedule, dayIndex) => (
          <Box
            key={schedule.dayOfWeek}
            sx={{
              px: 6, 
              py: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: schedule.attends ? 'flex-start' : 'center',
              borderBottom: dayIndex < schedules.length - 1 ? '1px solid #e0e0e0' : 'none',
              bgcolor: 'white',
            }}
          >
            {/* Sección izquierda: Día y Checkbox */}
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '330px' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black', mb: 1 }}>
                {daysOfWeek[dayIndex].label.toUpperCase()}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={schedule.attends}
                    onChange={(e) => handleAttendsChange(dayIndex, e.target.checked)}
                  />
                }
                label="Atiende"
                sx={{ color: 'black' }}
              />
            </Box>

            {schedule.attends && (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {schedule.timeSlots.map((slot, slotIndex) => (
                  <Box
                    key={slotIndex}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderRadius: '4px',
                      p: 1,
                    }}
                  >
                    <TimePicker
                      label=""
                      value={dayjs(slot.startTime, 'HH:mm')}
                      onChange={(value) => handleTimeChange(dayIndex, slotIndex, 'startTime', value)}
                      ampm={true}
                      slots={{
                        openPickerIcon: AccessTimeIcon,
                      }}
                      sx={{
                        width: '330px',
                        '& .MuiInputBase-root': {
                          borderRadius: '4px',
                          bgcolor: 'white',
                          border: '1px solid #e0e0e0',
                          paddingRight: '30px',
                        },
                        '& .MuiInputBase-input': {
                          padding: '8px 14px',
                          fontSize: '14px',
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '20px',
                        },
                      }}
                    />
                    <TimePicker
                      label=""
                      value={dayjs(slot.endTime, 'HH:mm')}
                      onChange={(value) => handleTimeChange(dayIndex, slotIndex, 'endTime', value)}
                      ampm={true}
                      slots={{
                        openPickerIcon: AccessTimeIcon,
                      }}
                      sx={{
                        width: '330px',
                        '& .MuiInputBase-root': {
                          borderRadius: '4px',
                          bgcolor: 'white',
                          border: '1px solid #e0e0e0',
                          paddingRight: '30px',
                        },
                        '& .MuiInputBase-input': {
                          padding: '8px 14px',
                          fontSize: '14px',
                        },
                        '& .MuiSvgIcon-root': {
                          fontSize: '20px',
                        },
                      }}
                    />
                    {schedule.timeSlots.length > 1 && (
                      <IconButton onClick={() => removeTimeSlot(dayIndex, slotIndex)}>
                        <DeleteIcon sx={{ color: '#757575' }} />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={() => addTimeSlot(dayIndex)} sx={{ color: '#757575' }}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button label="Cancelar" onClick={() => router.push('/dashboard/horarios')} variant="outlined" />
        <Button label="Aceptar" onClick={handleSubmit} variant="contained" color="primary" sx={{ bgcolor: '#f5a623', '&:hover': { bgcolor: '#e69520' } }} />
      </Box>
    </Box>
  );
};

export default ScheduleEdit;