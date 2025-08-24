/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert
} from "@mui/material";
import { fetchSchedules } from "@/services/scheduleService";
import { fetchAppointmentPreview, rescheduleSession } from "@/services/appointmentService";
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
  const [previewData, setPreviewData] = useState<{ start: string; end: string }[]>([]);
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
      setPreviewData([]);
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

  const formatDateTime = (dateTimeString: string) => {
    const [datePart, timePart] = dateTimeString.split("T");
    const cleanTime = timePart.replace("Z", "");
    return `${datePart} - ${cleanTime}`;
  };

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
      
      const preview = await fetchAppointmentPreview({
        patientId: session.patientId,
        specialtyId: session.specialtyId,
        specialistId: specialistId,
        sessionCount: 1,
        sessionCost: session.sessionCost || 65,
        scheduledSessions: [{
          id: session.sessionId || session.id,
          timeSlotId: form.timeSlotId,
          dayOfWeek: form.dayOfWeek,
          startTime: form.startTime,
          endTime: form.endTime,
          status: "Rescheduled"
        }]
      });
      
      setPreviewData(preview);
      setShowPreview(true);
      setLoading(false);
    } catch (err : any) {
      setLoading(false);
      console.error("Error obteniendo vista previa:", err);
    }
  };

  const handleConfirm = async () => {
    try {
      
      setLoading(true);
      
      await rescheduleSession(
        appointment.id,
        session.sessionId || session.id,
        form.dayOfWeek,
        form.startTime,
        form.endTime,
        form.timeSlotId
      );
      
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
          <Alert severity="error" sx={{ mb: 2 }}>
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
              Vista previa de la nueva fecha:
            </Typography>
            {previewData.map((date, index) => (
            <Box key={index} sx={{ 
              p: 2, 
              mb: 2, 
              bgcolor: '#f5f5f5', 
              borderRadius: 1,
              border: '1px solid #e0e0e0'
            }}>
              <Typography>
                {`Sesión reprogramada: ${formatDateTime(date.start)} - ${formatDateTime(date.end)}`}
              </Typography>
            </Box>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        {!showPreview ? (
          <Button
            onClick={handlePreview}
            variant="contained"
            disabled={!hasTimeSlotsForSelectedDay || !form.dayOfWeek || !form.timeSlotId || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Ver vista previa"}
          </Button>
        ) : (
          <>
            <Button onClick={() => setShowPreview(false)}>Atrás</Button>
            <Button
              onClick={handleConfirm}
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Confirmar reprogramación"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};