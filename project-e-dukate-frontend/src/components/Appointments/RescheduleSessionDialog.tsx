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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { fetchReschedulePreview, rescheduleSession, AvailableTimeSlot, RescheduleSessionPayload } from "@/services/appointmentService";
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
  const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableTimeSlot | null>(null);
  const [searchOption, setSearchOption] = useState<'sameDay' | 'nextWeek' | 'specific'>('sameDay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'options' | 'preview' | 'confirmation'>('options');

  useEffect(() => {
    if (open) {
      setError(null);
      setAvailableSlots([]);
      setSelectedSlot(null);
      setStep('options');
      setSearchOption('sameDay');
    }
  }, [open]);

  const handleSearchOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchOption(event.target.value as 'sameDay' | 'nextWeek' | 'specific');
  };

  const handleFindAvailableSlots = async () => {
    try {
      setLoading(true);
      setError(null);

      const request = {
        sessionId: session.sessionId || session.id,
        targetDayOfWeek: session.dayOfWeek, // Mismo día de la semana
        lookAheadWeeks: searchOption === 'sameDay' ? 1 : 2
      };

      const slots = await fetchReschedulePreview(appointment.id, request);
      
      if (slots.length === 0) {
        setError("No se encontraron horarios disponibles para la fecha seleccionada");
        return;
      }

      setAvailableSlots(slots);
      setStep('preview');
    } catch (err: any) {
      setError(err.message || "Error al buscar horarios disponibles");
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot: AvailableTimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleConfirmSelection = () => {
    if (selectedSlot) {
      setStep('confirmation');
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedSlot) return;

    try {
      setLoading(true);
      
      const payload: RescheduleSessionPayload = {
        sessionId: session.sessionId || session.id,
        newTimeSlotId: selectedSlot.timeSlotId,
        newStartDateTime: selectedSlot.startDateTime,
        newEndDateTime: selectedSlot.endDateTime
      };

      await rescheduleSession(appointment.id, payload);
      
      setLoading(false);
      onRescheduleSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError("Error al confirmar la reprogramación. Intente nuevamente.");
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {step === 'options' && 'Opciones de Reprogramación'}
        {step === 'preview' && 'Horarios Disponibles'}
        {step === 'confirmation' && 'Confirmar Reprogramación'}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Paso 1: Opciones de búsqueda */}
        {step === 'options' && (
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
              <Typography><strong>Fecha:</strong> {session.formattedDate || 'No especificada'}</Typography>
            </Box>

            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
                Buscar horarios disponibles para:
              </FormLabel>
              <RadioGroup
                value={searchOption}
                onChange={handleSearchOptionChange}
              >
                <FormControlLabel 
                  value="sameDay" 
                  control={<Radio />} 
                  label="Mismo día de la semana (esta semana o siguiente)" 
                />
                <FormControlLabel 
                  value="nextWeek" 
                  control={<Radio />} 
                  label="Siguiente semana del mismo día" 
                />
              </RadioGroup>
            </FormControl>
          </Box>
        )}

        {/* Paso 2: Vista previa de horarios disponibles */}
        {step === 'preview' && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Seleccione un nuevo horario:
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
                      {date}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {slots.map((slot, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: selectedSlot?.timeSlotId === slot.timeSlotId ? 'primary.main' : '#e0e0e0',
                            borderRadius: 1,
                            bgcolor: selectedSlot?.timeSlotId === slot.timeSlotId ? '#e3f2fd' : 'white',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: '#f5f5f5',
                            }
                          }}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          <Typography variant="body1" fontWeight="medium">
                            {slot.formattedTime}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dayTranslation[slot.dayOfWeek] || slot.dayOfWeek}
                            {slot.isSameDay && " • Mismo día"}
                            {slot.isNextWeek && " • Siguiente semana"}
                          </Typography>
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

        {/* Paso 3: Confirmación */}
        {step === 'confirmation' && selectedSlot && (
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
              Confirmar reprogramación:
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Sesión actual:
              </Typography>
              <Box sx={{ p: 2, bgcolor: '#fff3cd', borderRadius: 1, mb: 2 }}>
                <Typography><strong>Día:</strong> {dayTranslation[session.dayOfWeek] || session.dayOfWeek}</Typography>
                <Typography><strong>Hora:</strong> {session.startTime} - {session.endTime}</Typography>
                <Typography><strong>Fecha:</strong> {session.formattedDate || 'No especificada'}</Typography>
              </Box>

              <Typography variant="subtitle2" color="text.secondary">
                Nueva sesión:
              </Typography>
              <Box sx={{ p: 2, bgcolor: '#d1edff', borderRadius: 1 }}>
                <Typography><strong>Día:</strong> {dayTranslation[selectedSlot.dayOfWeek] || selectedSlot.dayOfWeek}</Typography>
                <Typography><strong>Fecha:</strong> {selectedSlot.formattedDate}</Typography>
                <Typography><strong>Hora:</strong> {selectedSlot.formattedTime}</Typography>
              </Box>
            </Box>

            <Alert severity="info" sx={{ mb: 2 }}>
              ¿Está seguro de que desea reprogramar esta sesión?
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        {step === 'options' && (
          <>
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              onClick={handleFindAvailableSlots}
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Buscar Horarios"}
            </Button>
          </>
        )}

        {step === 'preview' && (
          <>
            <Button onClick={() => setStep('options')}>Atrás</Button>
            <Button
              onClick={handleConfirmSelection}
              variant="contained"
              disabled={!selectedSlot || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Seleccionar"}
            </Button>
          </>
        )}

        {step === 'confirmation' && (
          <>
            <Button onClick={() => setStep('preview')}>Atrás</Button>
            <Button
              onClick={handleConfirmReschedule}
              variant="contained"
              disabled={loading}
              color="primary"
            >
              {loading ? <CircularProgress size={24} /> : "Confirmar Reprogramación"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};