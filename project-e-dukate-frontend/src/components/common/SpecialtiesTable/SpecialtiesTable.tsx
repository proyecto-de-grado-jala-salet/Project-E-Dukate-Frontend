/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
import { FaRegEdit } from "react-icons/fa";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { fetchSpecialties } from '../../../services/specialtyService';

interface Specialty {
  id: string;
  typeOfSpecialty: string;
}

export const SpecialtiesTable: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const data = await fetchSpecialties();
        setSpecialties(data);
      } catch (err) {
        setError('Error al cargar las especialidades');
      }
    };

    loadSpecialties();
  }, []);

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (specialties.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6">
          No se encuentra ninguna especialidad
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '16px 24px', width: '10%', textAlign: 'center' }}>
                #
              </TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '16px 24px', width: '75%', textAlign: 'center' }}>
                Especialidades
              </TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', padding: '16px 24px', width: '15%', textAlign: 'center' }}>
                Acción
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specialties.map((specialty, index) => (
              <TableRow key={specialty.id}>
                <TableCell sx={{ color: 'black', padding: '16px 24px', textAlign: 'center' }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ color: 'black', padding: '16px 24px', textAlign: 'center' }}>
                  {specialty.typeOfSpecialty}
                </TableCell>
                <TableCell sx={{ color: 'black', padding: '16px 24px', textAlign: 'center' }}>
                  <IconButton>
                    <FaRegEdit />
                  </IconButton>
                  <IconButton>
                    <DeleteOutlineIcon sx={{ color: 'red' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};