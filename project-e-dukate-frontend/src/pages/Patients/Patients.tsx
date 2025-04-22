"use client";

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Table } from '../../components/Table';
import { useApi } from '../../hooks/useApi';
import { useRouter } from 'next/navigation';
import { ColumnConfig } from '../../types/table';
import { useEditStore } from '../../stores/editStore';

interface Patient {
  id: string;
  names: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  mobileNumber: string;
  identityCard: number;
  age: number;
}

export const Patients: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { setEditData } = useEditStore();
  const {
    data: patients,
    error: patientsError,
    totalPages: patientsTotalPages,
    currentPage: patientsCurrentPage,
    pageSize: patientsPageSize,
    loading: patientsLoading,
    fetchData: fetchPatients,
    deleteItem: deletePatient,
  } = useApi<Patient>('patients');

  const patientColumns: ColumnConfig<Patient>[] = [
    { header: 'Nombre', key: 'names', width: '20%' },
    {
      header: 'Apellido',
      key: 'lastName',
      width: '20%',
      render: (item) => `${item.lastNamePaternal} ${item.lastNameMaternal || ''}`.trim(),
    },
    { header: 'Celular', key: 'mobileNumber', width: '20%' },
    { header: 'CI', key: 'identityCard', width: '20%' },
    { header: 'Edad', key: 'age', width: '10%' },
  ];

  const handlePageChange = (page: number) => {
    fetchPatients(page);
  };

  const handleDelete = async (item: Patient) => {
    try {
      await deletePatient(item.id);
    } catch (err) {
      console.error('Error deleting patient:', err);
    }
  };

  const handleAddPatient = () => {
    router.push('/dashboard/pacientes/agregar');
  };

  const handleEdit = async (item: Patient) => {
    try {
      setEditData(item.id, '', 'patient');
      const patientNameSlug = `${item.names}-${item.lastNamePaternal}`
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .trim();
      router.push(`/dashboard/pacientes/editar/${patientNameSlug}`);
    } catch (err) {
      console.error('Error navigating to edit page:', err);
      alert('Error al navegar a la página de edición');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
          Pacientes
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Buscar paciente"
            value={searchTerm}
            onChange={setSearchTerm}
            startAdornment={<SearchIcon sx={{ color: 'gray' }} />}
            sx={{
              width: '300px',
              '& .MuiInputBase-input': { padding: '10px 14px' },
            }}
          />
          <Button
            label="Añadir Paciente"
            variant="contained"
            sx={{ bgcolor: '#f5c71a', color: 'black' }}
            onClick={handleAddPatient}
          />
        </Box>
      </Box>
      <Table
        items={patients ?? []}
        columns={patientColumns}
        error={patientsError}
        onEdit={handleEdit}
        onDelete={handleDelete}
        totalPages={patientsTotalPages}
        currentPage={patientsCurrentPage}
        pageSize={patientsPageSize}
        onPageChange={handlePageChange}
        loading={patientsLoading}
      />
    </Box>
  );
};

export default Patients;