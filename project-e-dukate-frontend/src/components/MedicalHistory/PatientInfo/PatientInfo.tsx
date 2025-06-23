import React from 'react';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import { Paper } from '@mui/material';
import { Divider } from '@mui/material';
import dayjs from 'dayjs';
import { Patient } from '@/types/userTypes';
import { mapGenderToRadioValue } from '@/utils/formUtils';

interface PatientInfoProps {
  patient: Patient;
}

export const PatientInfo: React.FC<PatientInfoProps> = ({ patient }) => {
  return (
    <Paper elevation={3} sx={{ py: 3, px: 0, bgcolor: '#f9f9f9', borderRadius: 2 }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2, color: '#000000' }}>
        Identificación del Paciente
      </Typography>
      <Divider sx={{ mb: 2, borderColor: '#D8D8D8' }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, px: 0, color: '#000000' }}>
        <Box sx={{ px: 3 }}>
          <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
            <strong style={{ color: '#000000' }}>Nombre y Apellido:</strong> {patient.names} {patient.lastNamePaternal} {patient.lastNameMaternal || ''}
          </Typography>
        </Box>
        <Divider sx={{ mt: 1, borderColor: '#D8D8D8' }} />
        <Box sx={{ px: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Fecha de Nacimiento:</strong> {dayjs(patient.dateOfBirth).format('YYYY/MM/DD')}
            </Typography>
            <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Edad:</strong> {patient.age}
            </Typography>
            <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Género:</strong> {mapGenderToRadioValue(patient.gender)}
            </Typography>
            <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
              <strong style={{ color: '#000000' }}>CI:</strong> {patient.identityCard}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mt: 1, borderColor: '#D8D8D8' }} />
        <Box sx={{ px: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Domicilio:</strong> {patient.address}
            </Typography>
            <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Celular:</strong> {patient.mobileNumber}
            </Typography>
            <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Teléfono:</strong> {patient.phoneNumber || 'No registrado'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};