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
  const [selectedAvailableSlot, setSelectedAvailableSlot] = useState<AvailableTimeSlot | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    dayOfWeek: session.dayOfWeek || "",
    timeSlotId: session.timeSlotId || "",
    startTime: session.startTime || "",
    endTime: session.endTime || "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        dayOfWeek: session.dayOfWeek || "",
        timeSlotId: session.timeSlotId || "",
        startTime: session.startTime || "",
        endTime: session.endTime || "",
      });
      setError(null);
      setShowPreview(false);
      setAvailableSlots([]);
      setSelectedAvailableSlot(null);
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

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'dayOfWeek' && { 
        timeSlotId: '', 
        startTime: '', 
        endTime: '' 
      })
    }));
  };

  const handleTimeSlotChange = (value: string) => {
    const selectedSchedule = schedules.find(s => s.dayOfWeek === form.dayOfWeek);
    const selectedSlot = selectedSchedule?.timeSlots.find(ts => ts.id === value);
    
    if (selectedSlot) {
      setForm({
        ...form,
        timeSlotId: value,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });
    }
  };

  const handlePreview = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!form.dayOfWeek || !form.timeSlotId) {
        setError("Por favor, seleccione un día y horario");
        setLoading(false);
        return;
      }
      
      const specialistId = session.specialistId;
      
      // Llamar al nuevo endpoint de preview de reprogramación
      const availableSlots = await fetchReschedulePreview(appointment.id, {
        sessionId: session.sessionId || session.id,
        targetDayOfWeek: form.dayOfWeek,
        startTime: form.startTime,
        endTime: form.endTime,
        lookAheadWeeks: 2
      });
      
      if (availableSlots.length === 0) {
        setError("No se encontraron horarios disponibles para la fecha y hora seleccionadas");
        setLoading(false);
        return;
      }
      
      setAvailableSlots(availableSlots);
      setShowPreview(true);
      setLoading(false);
    } catch (err : any) {
      setLoading(false);
      setError(err.message || "Error al buscar horarios disponibles");
      console.error("Error obteniendo preview de reprogramación:", err);
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
      setShowPreview(false);
      onRescheduleSuccess();
      onClose();
    } catch (err : any) {
      setLoading(false);
      setError("Error al reprogramar la sesión. Intente nuevamente.");
      console.error("Error reprogramando sesión:", err);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString('es-ES'),
      time: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      day: dayTranslation[date.toLocaleDateString('es-ES', { weekday: 'long' })] || 
           date.toLocaleDateString('es-ES', { weekday: 'long' })
    };
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
  const hasTimeSlotsForSelectedDay = form.dayOfWeek && schedules.some(s => 
    s.dayOfWeek === form.dayOfWeek && s.timeSlots.length > 0 && s.attends
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Reprogramar Sesión</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        {!showPreview ? (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Información actual de la sesión:
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
              <Typography><strong>Fecha:</strong> {session.formattedDate || 'No especificada'}</Typography>
            </Box>

            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Nueva programación:
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TextField
                  select
                  fullWidth
                  margin="normal"
                  label="Día de la semana"
                  value={form.dayOfWeek}
                  onChange={(e) => handleChange("dayOfWeek", e.target.value)}
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
                
                <TextField
                  select
                  fullWidth
                  margin="normal"
                  label="Horario"
                  value={form.timeSlotId}
                  onChange={(e) => handleTimeSlotChange(e.target.value)}
                  required
                  disabled={!hasTimeSlotsForSelectedDay}
                >
                  {hasTimeSlotsForSelectedDay ? (
                    schedules
                      .find(s => s.dayOfWeek === form.dayOfWeek)!
                      .timeSlots.map((ts) => (
                        <MenuItem key={ts.id} value={ts.id}>
                          {`${ts.startTime} - ${ts.endTime}`}
                        </MenuItem>
                      ))
                  ) : (
                    <MenuItem disabled>
                      {form.dayOfWeek ? "No hay horarios disponibles para este día" : "Seleccione un día primero"}
                    </MenuItem>
                  )}
                </TextField>
              </>
            )}
          </Box>
        ) : (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Horarios disponibles para {dayTranslation[form.dayOfWeek] || form.dayOfWeek} a las {form.startTime} - {form.endTime}:
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
                            border: '1px solid',
                            borderColor: selectedAvailableSlot?.timeSlotId === slot.timeSlotId ? 'primary.main' : '#e0e0e0',
                            borderRadius: 1,
                            bgcolor: selectedAvailableSlot?.timeSlotId === slot.timeSlotId ? '#e3f2fd' : 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {slot.formattedTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {slot.isSameDay && " • Mismo día"}
                              {slot.isNextWeek && " • Siguiente semana"}
                            </Typography>
                          </Box>
                          
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleConfirmReschedule(slot)}
                            disabled={loading}
                          >
                            {loading ? <CircularProgress size={20} /> : "Confirmar"}
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
        {!showPreview ? (
          <>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              onClick={handlePreview}
              variant="contained"
              disabled={!hasTimeSlotsForSelectedDay || !form.dayOfWeek || !form.timeSlotId || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Buscar Horarios Disponibles"}
            </Button>
          </>
        ) : (
          <Button onClick={() => setShowPreview(false)}>Volver a selección</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};