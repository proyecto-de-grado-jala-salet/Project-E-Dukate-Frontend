import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem, Button, Chip } from '@mui/material';
import { Specialist } from '@/types/userTypes';
import { MenuProps, statuses, statusColors } from '@/utils/medicalHistoryConstants';

interface SpecialistStatusFormProps {
  specialists: Specialist[];
  selectedSpecialists: string[];
  setSelectedSpecialists: (specialists: string[]) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  onAddConsultation: () => void;
  specialistsWithPermission: Specialist[];
  selectedConsultationSpecialist: string;
  setSelectedConsultationSpecialist: (specialistId: string) => void;
}

export const SpecialistStatusForm: React.FC<SpecialistStatusFormProps> = ({
  specialists,
  selectedSpecialists,
  setSelectedSpecialists,
  selectedStatus,
  setSelectedStatus,
  onAddConsultation,
  specialistsWithPermission,
  selectedConsultationSpecialist,
  setSelectedConsultationSpecialist,
}) => {
  return (
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Dropdown para permisos de edición */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ color: '#000000', fontWeight: 'bold' }}>
            Permisos para editar:
          </Typography>
          <FormControl sx={{ width: 290 }}>
            <Select
              multiple
              value={selectedSpecialists}
              onChange={(e) => {
                const { target: { value } } = e;
                setSelectedSpecialists(typeof value === 'string' ? value.split(',') : value as string[]);
              }}
              sx={{
                textTransform: 'none',
                color: '#000000',
                borderRadius: '10px',
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
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const specialist = specialists.find(s => s.id === value);
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
                  {selected.length > 3 && <Chip label="..." sx={{ color: '#ffffff', backgroundColor: '#013c28' }} />}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              <MenuItem value="" disabled>
                <Typography sx={{ color: '#000000', fontWeight: 'bold', fontStyle: 'italic' }}>
                  Seleccione un especialista
                </Typography>
              </MenuItem>
              {specialists.map((specialist) => (
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
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ color: '#000000', fontWeight: 'bold' }}>
            Ver consulta del Prof. Especialista:
          </Typography>
          <FormControl sx={{ width: 290 }}>
            <Select
              value={selectedConsultationSpecialist}
              onChange={(e) => {
                const specialistId = e.target.value as string;
                setSelectedConsultationSpecialist(specialistId);
              }}
              sx={{
                textTransform: 'none',
                color: '#000000',
                borderRadius: '10px',
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
              renderValue={(value) => {
                const specialist = specialistsWithPermission.find(s => s.id === value);
                return specialist ? (
                  <Typography sx={{ color: '#000000' }}>
                    {specialist.names} {specialist.lastNamePaternal}
                  </Typography>
                ) : (
                  <Typography sx={{ color: '#000000', fontStyle: 'italic' }}>
                    Seleccione un especialista
                  </Typography>
                );
              }}
            >
              <MenuItem value="" disabled>
                <Typography sx={{ color: '#000000', fontWeight: 'bold', fontStyle: 'italic' }}>
                  Seleccione un especialista
                </Typography>
              </MenuItem>
              {specialistsWithPermission.map((specialist) => (
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
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" sx={{ color: '#000000', fontWeight: 'bold' }}>
            Estado:
          </Typography>
          <FormControl sx={{ width: 250 }}>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as string)}
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
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
          onClick={onAddConsultation}
          disabled={!selectedSpecialists.length || !selectedStatus}
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
  );
};