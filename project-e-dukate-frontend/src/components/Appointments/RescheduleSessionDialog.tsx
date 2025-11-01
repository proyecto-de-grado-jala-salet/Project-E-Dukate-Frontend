/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { fetchSchedules } from "@/services/scheduleService";
import { fetchReschedulePreview, rescheduleSession, AvailableTimeSlot, RescheduleSessionPayload } from "@/services/appointmentService";
import { BackendSchedule, ScheduleDto } from "@/types/schedule";
import { mapBackendSchedules } from "@/utils/scheduleUtils";
import { dayTranslation } from "@/utils/scheduleUtils";
import { Appointment } from "@/types/appointment";

interface RescheduleSessionDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
  session: any;
  onRescheduleSuccess: () => void;
}

export const RescheduleSessionDialog: React.FC<RescheduleSessionDialogProps> = ({
  open,
  onClose,
  appointment,
  session,
  onRescheduleSuccess,
}) => {
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select-day' | 'select-slot'>('select-day');

  const [selectedDay, setSelectedDay] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedDay("");
      setError(null);
      setStep('select-day');
      setAvailableSlots([]);
      setLoading(true);
      
      if (!appointment) {
        setError("No se encontró la cita");
        setLoading(false);
        return;
      }
      
      const specialistId = session.specialistId;
      
      if (!specialistId || specialistId === "undefined") {
        setError("No se encontró el especialista para esta cita");
        setLoading(false);
        return;
      }
      
      fetchSchedules(specialistId)
        .then((backendSchedules: BackendSchedule[]) => {
          const mappedSchedules = mapBackendSchedules(backendSchedules);
          setSchedules(mappedSchedules);
          
          if (mappedSchedules.length === 0 || !mappedSchedules.some(s => s.attends && s.timeSlots.length > 0)) {
            setError("El especialista no tiene horarios disponibles");
          }
        })
        .catch((err) => {
          setError("Error al cargar los horarios del especialista");
          console.error("Error fetching schedules:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, appointment, session]);

  const handleDaySelect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!selectedDay) {
        setError("Por favor, seleccione un día");
        setLoading(false);
        return;
      }
      
      const slots = await fetchReschedulePreview(appointment.id, {
        sessionId: session.sessionId || session.id,
        targetDayOfWeek: selectedDay,
        lookAheadWeeks: 2
      });
      
      if (slots.length === 0) {
        setError("No se encontraron horarios disponibles para el día seleccionado");
        setLoading(false);
        return;
      }
      
      setAvailableSlots(slots);
      setStep('select-slot');
      setLoading(false);
    } catch (err : any) {
      setLoading(false);
      setError(err.message || "Error al buscar horarios disponibles");
      console.error("Error obteniendo horarios disponibles:", err);
    }
  };

  const handleConfirmReschedule = async (slot: AvailableTimeSlot) => {
    try {
      setLoading(true);
      
      const payload: RescheduleSessionPayload = {
        sessionId: session.sessionId || session.id,
        newTimeSlotId: slot.timeSlotId,
        newStartDateTime: slot.startDateTime,
        newEndDateTime: slot.endDateTime
      };

      await rescheduleSession(appointment.id, payload);
      
      setLoading(false);
      onRescheduleSuccess();
      onClose();
    } catch (err : any) {
      setLoading(false);
      setError("Error al reprogramar la sesión. Intente nuevamente.");
      console.error("Error reprogramando sesión:", err);
    }
  };

  const groupSlotsByDate = (slots: AvailableTimeSlot[]) => {
    const grouped: { [key: string]: AvailableTimeSlot[] } = {};
    
    slots.forEach(slot => {
      const dateKey = slot.formattedDate;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(slot);
    });
    
    return grouped;
  };

  const groupedSlots = groupSlotsByDate(availableSlots);

  const availableSchedules = schedules.filter(s => s.attends && s.timeSlots.length > 0);
  const hasAvailableSchedules = availableSchedules.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {step === 'select-day' ? 'Seleccionar Día' : 'Seleccionar Horario'}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {step === 'select-day' && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Sesión actual:
            </Typography>
            <Box sx={{ 
              p: 2, 
              mb: 3, 
              bgcolor: '#f5f5f5', 
              borderRadius: 1,
              border: '1px solid #e0e0e0'
            }}>
              <Typography><strong>Día:</strong> {dayTranslation[session.dayOfWeek] || session.dayOfWeek}</Typography>
              <Typography><strong>Hora:</strong> {session.startTime} - {session.endTime}</Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Seleccione un día:
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TextField
                select
                fullWidth
                margin="normal"
                label="Día de la semana"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                required
                disabled={!hasAvailableSchedules}
              >
                {hasAvailableSchedules ? (
                  availableSchedules.map((s) => (
                    <MenuItem key={s.dayOfWeek} value={s.dayOfWeek}>
                      {dayTranslation[s.dayOfWeek] || s.dayOfWeek}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No hay días disponibles</MenuItem>
                )}
              </TextField>
            )}
          </Box>
        )}

        {step === 'select-slot' && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Horarios disponibles para {dayTranslation[selectedDay] || selectedDay}:
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {Object.entries(groupedSlots).map(([date, slots]) => (
                  <Box key={date} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
                      {date} ({dayTranslation[slots[0]?.dayOfWeek] || slots[0]?.dayOfWeek})
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {slots.map((slot, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            bgcolor: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            '&:hover': {
                              bgcolor: '#f5f5f5',
                            }
                          }}
                        >
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {slot.formattedTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {slot.isSameDay && " • Esta semana"}
                              {slot.isNextWeek && " • Siguiente semana"}
                            </Typography>
                          </Box>
                          
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ bgcolor: "#f5a623", color: "black", height: "45px", padding: "10px 14px", borderRadius: "12px" }}
                            onClick={() => handleConfirmReschedule(slot)}
                            disabled={loading}
                          >
                            {loading ? <CircularProgress size={20} /> : "Seleccionar"}
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            {availableSlots.length === 0 && !loading && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', my: 4 }}>
                No se encontraron horarios disponibles
              </Typography>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {step === 'select-day' && (
          <>
            <Button sx={{ color: "red" }} onClick={onClose}>Cancelar</Button>
            <Button
              onClick={handleDaySelect}
              variant="contained"
              sx={{ bgcolor: "#013c28", color: "white", borderRadius: "11px", '&:hover': { bgcolor: '#025c3f'}, '&:disabled': { bgcolor: '#cccccc' } } }
              disabled={!selectedDay || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Buscar Horarios"}
            </Button>
          </>
        )}

        {step === 'select-slot' && (
          <Button onClick={() => setStep('select-day')}>Volver</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};