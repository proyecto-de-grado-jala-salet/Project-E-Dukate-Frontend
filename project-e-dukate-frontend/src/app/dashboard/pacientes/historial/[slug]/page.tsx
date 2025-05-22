"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Divider, FormControl, Select, MenuItem, Button, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useApi } from '@/hooks/useApi';
import { useEditStore } from '@/stores/editStore';
import { Patient, Specialist } from '@/types/userTypes';
import dayjs from 'dayjs';
import { mapGenderToRadioValue } from '@/utils/formUtils';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MedicalHistoryPage() {
  const router = useRouter();
  const { entityId, entityType } = useEditStore();
  const patientId = entityId;
  
  const { data: patient, loading: patientLoading, error: patientError } = useApi<Patient>('patients');
  const { data: specialists, loading: specialistsLoading, error: specialistsError } = useApi<Specialist>('specialists');

  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const statuses = [
    'ContinuaEnTratamiento',
    'AltaDefinitiva',
    'AltaTemporal',
    'AltaAbandono',
  ];

  const statusColors = {
    ContinuaEnTratamiento: '#76CAFF',
    AltaDefinitiva: '#009F1D',
    AltaTemporal: '#FFA719',
    AltaAbandono: '#F24B4B',
  };

  useEffect(() => {
    if (!patientId || entityType !== 'patient') {
      router.push('/dashboard/pacientes');
      return;
    }

    if (patient && patient.length > 0) {
      const foundPatient = patient.find(p => p.id === patientId);
      if (foundPatient) {
        setPatientData(foundPatient);
      } else {
        router.push('/dashboard/pacientes');
      }
    }
  }, [patientId, entityType, patient, router]);

  const handleAddConsultation = () => {
    console.log('Añadir consulta:', {
      patientId,
      specialistIds: selectedSpecialist,
      status: selectedStatus,
    });
  };

  if (patientLoading || specialistsLoading) return <Typography variant="h6" sx={{ color: '#000000' }}>Cargando...</Typography>;
  if (patientError) return <Typography variant="h6" sx={{ color: '#000000' }} color="error">{patientError}</Typography>;
  if (specialistsError) return <Typography variant="h6" sx={{ color: '#000000' }} color="error">{specialistsError}</Typography>;
  if (!patientData) return <Typography variant="h6" sx={{ color: '#000000' }}>Paciente no encontrado</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ py: 3, px: 0, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2, color: '#000000' }}>
          Identificación del Paciente
        </Typography>
        <Divider sx={{ mb: 2, borderColor: '#D8D8D8' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, px: 0, color: '#000000' }}>
          <Box sx={{ px: 3 }}>
            <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
              <strong style={{ color: '#000000' }}>Nombre y Apellido:</strong> {patientData.names} {patientData.lastNamePaternal} {patientData.lastNameMaternal || ''}
            </Typography>
          </Box>
          <Divider sx={{ mt: 1, borderColor: '#D8D8D8' }} />
          <Box sx={{ px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
                <strong style={{ color: '#000000' }}>Fecha de Nacimiento:</strong> {dayjs(patientData.dateOfBirth).format('YYYY/MM/DD')}
              </Typography>
              <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
                <strong style={{ color: '#000000' }}>Edad:</strong> {patientData.age}
              </Typography>
              <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
                <strong style={{ color: '#000000' }}>Género:</strong> {mapGenderToRadioValue(patientData.gender)}
              </Typography>
              <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
                <strong style={{ color: '#000000' }}>CI:</strong> {patientData.identityCard}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 1, borderColor: '#D8D8D8' }} />
          <Box sx={{ px: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
                <strong style={{ color: '#000000' }}>Domicilio:</strong> {patientData.address}
              </Typography>
              <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
                <strong style={{ color: '#000000' }}>Celular:</strong> {patientData.mobileNumber}
              </Typography>
              <Typography variant="body1" sx={{ py: 0.5, color: '#000000' }}>
                <strong style={{ color: '#000000' }}>Teléfono:</strong> {patientData.phoneNumber || 'No registrado'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ color: '#000000', fontWeight: 'bold' }}>
            Prof. Especialista:
          </Typography>
          <FormControl sx={{ width: 290 }}>
            <Select
              multiple
              value={selectedSpecialist}
              onChange={(e) => {
                const {
                  target: { value },
                } = e;
                setSelectedSpecialist(
                  typeof value === 'string' ? value.split(',') : value
                );
              }}
              sx={{
                textTransform: 'none',
                color: '#000000',
                borderRadius: "10px",
                backgroundColor: 'white',
                '.MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 32px 8px 8px',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D8D8D8',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D8D8D8',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D8D8D8',
                },
              }}
              displayEmpty
              renderValue={(selected) => {
                const displaySpecialists = selected.slice(0, 3);
                const hasMore = selected.length > 3;
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {displaySpecialists.map((value) => {
                      const specialist = specialists?.find(s => s.id === value);
                      return (
                        specialist && (
                          <Chip
                            key={value}
                            label={`${specialist.names} ${specialist.lastNamePaternal}`}
                            sx={{ color: '#fff', backgroundColor: '#013c28' }}
                          />
                        )
                      );
                    })}
                    {hasMore && <Chip label="..." sx={{ color: '#ffffff', backgroundColor: '#013c28' }} />}
                  </Box>
                );
              }}
              MenuProps={MenuProps}
            >
              <MenuItem value="" disabled>
                <Typography sx={{ color: "#000000", fontWeight: 'bold', fontStyle: 'italic' }}>Seleccione un especialista</Typography>
              </MenuItem>
              {specialists?.map((specialist) => (
                <MenuItem
                  key={specialist.id}
                  value={specialist.id}
                  sx={{ color: '#000000' }}
                >
                  {specialist.names} {specialist.lastNamePaternal}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ color: '#000000', fontWeight: 'bold' }}>
              Estado:
            </Typography>
            <FormControl sx={{ width: 250 }}>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                sx={{
                  textTransform: 'none',
                  borderRadius: "10px",
                  backgroundColor: 'white',
                  '.MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 32px 8px 8px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D8D8D8',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D8D8D8',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#D8D8D8',
                  },
                }}
                displayEmpty
                renderValue={(value) =>
                  value ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: statusColors[value as keyof typeof statusColors],
                        }}
                      />
                      <Typography variant="body1" sx={{ color: '#000000' }}>{value}</Typography>
                    </Box>
                  ) : (
                    <em style={{ color: '#000000' }}>Seleccione un estado</em>
                  )
                }
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status} sx={{ color: '#000000' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: statusColors[status as keyof typeof statusColors],
                        }}
                      />
                      <Typography variant="body1" sx={{ color: '#000000' }}>{status}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            onClick={handleAddConsultation} // Corregimos onChange a onClick
            disabled={!selectedSpecialist.length || !selectedStatus}
            sx={{
              bgcolor: '#F4A601',
              color: '#000000',
              textTransform: 'none',
              px: 3,
              py: 1,
            }}
          >
            Añadir Consulta
          </Button>
        </Box>
      </Box>

      <Typography variant="body1" sx={{ mt: 3, color: '#000000' }}>
        Esta es una página placeholder para el historial médico. Puedes expandirla con datos del backend (por ejemplo, consultas médicas) usando el API.
      </Typography>
    </Box>
  );
}