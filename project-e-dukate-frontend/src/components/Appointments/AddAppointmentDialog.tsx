/* eslint-disable @typescript-eslint/no-explicit-any */
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
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { fetchSchedules } from "@/services/scheduleService";
import { fetchSpecialistsBySpecialty, fetchAppointmentPreview } from "@/services/appointmentService";
import { BackendSchedule, ScheduleDto } from "@/types/schedule";
import { mapBackendSchedules } from "@/utils/scheduleUtils";
import { dayTranslation } from "@/utils/scheduleUtils";
import { Appointment } from "@/types/appointment";

const formatDateTime = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const day = startDate.getUTCDate();
  const month = startDate.getUTCMonth() + 1;
  const year = startDate.getUTCFullYear();
  const startHours = startDate.getUTCHours().toString().padStart(2, "0");
  const startMinutes = startDate.getUTCMinutes().toString().padStart(2, "0");
  const endHours = endDate.getUTCHours().toString().padStart(2, "0");
  const endMinutes = endDate.getUTCMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year}, ${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
};

const normalizeTime = (time: string): string => {
  if (!time) return "";
  const parts = time.split(":");
  return `${parts[0]}:${parts[1]}`;
};

interface AddAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (appointment: {
    patientId: string;
    specialtyId: string;
    specialistId: string;
    sessionCount: number;
    sessionCost: number;
    scheduledSessions: { timeSlotId: string; dayOfWeek: string; startTime: string; endTime: string; status: string }[];
  }) => void;
  patientOptions: { value: string; label: string }[];
  specialtyOptions: { value: string; label: string }[];
  reloadAppointments: () => void;
}

const PreviewDialog: React.FC<{
  open: boolean;
  previewData: { start: string; end: string }[];
  onBack: () => void;
  onConfirm: () => void;
}> = ({ open, previewData, onBack, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onBack}>
      <DialogTitle>Estos son los horarios, ¿está seguro de guardar los horarios de esta manera?</DialogTitle>
      <DialogContent>
        <List>
          {previewData.map((date, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Cita ${index + 1}`}
                secondary={formatDateTime(date.start, date.end)}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onBack}>Atrás</Button>
        <Button onClick={onConfirm} variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({
  open,
  onClose,
  onSave,
  patientOptions,
  specialtyOptions,
  reloadAppointments,
}) => {
  const [form, setForm] = useState({
    patientId: "",
    specialtyId: "",
    specialistId: "",
    sessionCount: 1,
    sessionCost: 65,
    scheduledSessions: [] as { timeSlotId: string; dayOfWeek: string; startTime: string; endTime: string; status: string }[],
  });
  const [specialists, setSpecialists] = useState<{ value: string; label: string }[]>([]);
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [previewData, setPreviewData] = useState<{ start: string; end: string }[]>([]);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  useEffect(() => {
    if (form.specialtyId) {
      fetchSpecialistsBySpecialty(form.specialtyId)
        .then((data) => {
          setSpecialists(
            data.map((s) => ({
              value: s.id,
              label: `${s.names} ${s.lastNamePaternal} ${s.lastNameMaternal || ""}`,
            }))
          );
        })
        .catch(() => setSpecialists([]));
    } else {
      setSpecialists([]);
      setSchedules([]);
      setForm((prev) => ({ ...prev, specialistId: "", scheduledSessions: [] }));
    }
  }, [form.specialtyId]);

  useEffect(() => {
    if (form.specialistId) {
      fetchSchedules(form.specialistId)
        .then((backendSchedules: BackendSchedule[]) => {
          const mappedSchedules = mapBackendSchedules(backendSchedules);
          setSchedules(mappedSchedules);
          console.log("Horarios cargados:", mappedSchedules);
        })
        .catch(() => setSchedules([]));
    } else {
      setSchedules([]);
      setForm((prev) => ({ ...prev, scheduledSessions: [] }));
    }
  }, [form.specialistId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'sessionCount' || e.target.name === 'sessionCost' 
      ? parseInt(e.target.value) || 0 
      : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSessionChange = (index: number, field: string, value: string) => {
    const newSessions = [...form.scheduledSessions];
    newSessions[index] = { ...newSessions[index], [field]: value };

    if (field === "dayOfWeek") {
      newSessions[index].timeSlotId = "";
      newSessions[index].startTime = "";
      newSessions[index].endTime = "";
    } else if (field === "timeSlotId") {
      const selectedSchedule = schedules.find((s) => s.dayOfWeek === newSessions[index].dayOfWeek);
      const selectedSlot = selectedSchedule?.timeSlots.find((ts) => ts.id === value);
      newSessions[index].startTime = normalizeTime(selectedSlot?.startTime || "");
      newSessions[index].endTime = normalizeTime(selectedSlot?.endTime || "");
      console.log(`Sesión ${index + 1} actualizada:`, newSessions[index]);
    }

    setForm({ ...form, scheduledSessions: newSessions });
  };

  const addSession = () => {
    setForm({
      ...form,
      scheduledSessions: [
        ...form.scheduledSessions,
        { timeSlotId: "", dayOfWeek: "", startTime: "", endTime: "", status: "Scheduled" },
      ],
    });
  };

  const removeSession = (index: number) => {
    const newSessions = form.scheduledSessions.filter((_, i) => i !== index);
    setForm({ ...form, scheduledSessions: newSessions });
  };

  const handleSave = async () => {
    console.log("Formulario antes de guardar:", form);
    try {
      const appointment: Partial<Appointment> = {
        patientId: form.patientId,
        specialtyId: form.specialtyId,
        specialistId: form.specialistId,
        sessionCount: form.sessionCount,
        sessionCost: parseFloat(form.sessionCost.toString()),
        scheduledSessions: form.scheduledSessions,
      };
      console.log("Payload enviado a /api/Appointments/preview:", JSON.stringify(appointment, null, 2));
      const data = await fetchAppointmentPreview(appointment);
      console.log("Respuesta de /api/Appointments/preview:", data);
      setPreviewData(data);
      setShowPreviewDialog(true);
    } catch (err: any) {
      console.error("Error obteniendo vista previa:", err);
      console.log("Respuesta del servidor:", err.response?.data);
    }
  };

  const handleConfirm = () => {
    onSave({
      patientId: form.patientId,
      specialtyId: form.specialtyId,
      specialistId: form.specialistId,
      sessionCount: form.sessionCount,
      sessionCost: form.sessionCost,
      scheduledSessions: form.scheduledSessions,
    });
    reloadAppointments();
    setForm({
      patientId: "",
      specialtyId: "",
      specialistId: "",
      sessionCount: 1,
      sessionCost: 65,
      scheduledSessions: [],
    });
    setShowPreviewDialog(false);
    onClose();
  };

  const handleBack = () => {
    console.log("Regresando al formulario");
    setShowPreviewDialog(false);
  };

  const availableSchedules = schedules.filter((s) => s.attends && s.timeSlots.length > 0);

  const handleCloseDialog = () => {
    setForm({
      patientId: "",
      specialtyId: "",
      specialistId: "",
      sessionCount: 1,
      sessionCost: 65,
      scheduledSessions: [],
    });
    setSpecialists([]);
    setSchedules([]);
    setPreviewData([]);
    setShowPreviewDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleCloseDialog} key={open ? "dialog-open" : "dialog-closed"}>
        <DialogTitle>Añadir Nueva Cita</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Paciente"
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            required
          >
            {patientOptions.length > 0 ? (
              patientOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay pacientes disponibles</MenuItem>
            )}
          </TextField>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Especialidad"
            name="specialtyId"
            value={form.specialtyId}
            onChange={handleChange}
            required
          >
            {specialtyOptions.length > 0 ? (
              specialtyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay especialidades disponibles</MenuItem>
            )}
          </TextField>

          <TextField
            select
            fullWidth
            margin="normal"
            label="Especialista"
            name="specialistId"
            value={form.specialistId}
            onChange={handleChange}
            required
            disabled={!form.specialtyId || specialists.length === 0}
          >
            {specialists.length > 0 ? (
              specialists.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay especialistas disponibles</MenuItem>
            )}
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Número de sesiones"
            type="number"
            name="sessionCount"
            value={form.sessionCount}
            onChange={handleChange}
            inputProps={{ min: 1 }}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Costo por sesión (Bs.)"
            type="number"
            name="sessionCost"
            value={form.sessionCost}
            onChange={handleChange}
            inputProps={{ min: 1, step: 0.01 }}
            required
          />

          {form.scheduledSessions.map((session, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Sesión {index + 1}</Typography>
              <TextField
                select
                fullWidth
                margin="normal"
                label="Día de la semana"
                value={session.dayOfWeek}
                onChange={(e) => handleSessionChange(index, "dayOfWeek", e.target.value)}
                required
                disabled={availableSchedules.length === 0}
              >
                {availableSchedules.length > 0 ? (
                  availableSchedules.map((s) => (
                    <MenuItem key={s.dayOfWeek} value={s.dayOfWeek}>
                      {dayTranslation[s.dayOfWeek]}
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
                value={session.timeSlotId}
                onChange={(e) => handleSessionChange(index, "timeSlotId", e.target.value)}
                required
                disabled={!session.dayOfWeek || !schedules.some((s) => s.dayOfWeek === session.dayOfWeek && s.timeSlots.length > 0)}
              >
                {session.dayOfWeek && schedules.some((s) => s.dayOfWeek === session.dayOfWeek && s.timeSlots.length > 0) ? (
                  schedules
                    .find((s) => s.dayOfWeek === session.dayOfWeek)!
                    .timeSlots.map((ts) => (
                      <MenuItem key={ts.id} value={ts.id}>
                        {`${normalizeTime(ts.startTime)} - ${normalizeTime(ts.endTime)}`}
                      </MenuItem>
                    ))
                ) : (
                  <MenuItem disabled>No hay horarios disponibles</MenuItem>
                )}
              </TextField>

              <Button onClick={() => removeSession(index)} color="error">
                Eliminar Sesión
              </Button>
            </Box>
          ))}

          <Button
            onClick={addSession}
            disabled={!form.specialistId || form.scheduledSessions.length >= form.sessionCount || availableSchedules.length === 0}
          >
            Añadir Sesión
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={
              !form.patientId ||
              !form.specialtyId ||
              !form.specialistId ||
              !form.sessionCost ||
              form.scheduledSessions.length === 0 ||
              form.scheduledSessions.some((s) => !s.timeSlotId || !s.dayOfWeek || !s.startTime || !s.endTime)
            }
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <PreviewDialog
        open={showPreviewDialog}
        previewData={previewData}
        onBack={handleBack}
        onConfirm={handleConfirm}
      />
    </>
  );
};