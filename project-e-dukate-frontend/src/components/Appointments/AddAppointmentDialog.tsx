import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import { DialogTitle } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogActions } from '@mui/material';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { MenuItem } from '@mui/material';

interface AddAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (appointment: {
    patientId: string;
    specialistId: string;
    startTime: string;
    endTime: string;
    status: string;
  }) => void;
  patientOptions: { value: string; label: string }[];
  specialistOptions: { value: string; label: string }[];
}

export const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({
  open,
  onClose,
  onSave,
  patientOptions,
  specialistOptions
}) => {
  const [form, setForm] = useState({
    patientId: '',
    specialistId: '',
    startTime: '',
    endTime: '',
    status: 'Programada'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave({
      patientId: form.patientId,
      specialistId: form.specialistId,
      startTime: form.startTime,
      endTime: form.endTime,
      status: form.status
    });
    setForm({
      patientId: '',
      specialistId: '',
      startTime: '',
      endTime: '',
      status: 'Programada'
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
          {patientOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
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
        >
          {specialistOptions.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          fullWidth
          margin="normal"
          label="Hora de inicio"
          type="datetime-local"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        
        <TextField
          fullWidth
          margin="normal"
          label="Hora de fin"
          type="datetime-local"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        
        <TextField
          select
          fullWidth
          margin="normal"
          label="Estado"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <MenuItem value="Programada">Programada</MenuItem>
          <MenuItem value="Confirmada">Confirmada</MenuItem>
          <MenuItem value="Cancelada">Cancelada</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!form.patientId || !form.specialistId || !form.startTime || !form.endTime}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};