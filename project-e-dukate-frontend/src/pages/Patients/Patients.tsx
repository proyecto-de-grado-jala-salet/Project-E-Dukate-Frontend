"use client";

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { Table } from '@/components/Table';
import { useApi } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { ColumnConfig } from '@/types/table';
import { useEditStore } from '@/stores/editStore';
import { useAuthStore } from '@/stores/authStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigation } from '@/contexts/NavigationContext';

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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { setEditData } = useEditStore();
  const { userRole } = useAuthStore();
  const { setIsNavigating } = useNavigation();
  const isAdmin = userRole === 'Administrator';

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

  useEffect(() => {
    fetchPatients(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchPatients]);

  useEffect(() => {
    if (!patientsLoading) {
      setIsNavigating(false);
    }
  }, [patientsLoading, setIsNavigating]);

  const handlePageChange = (page: number) => {
    fetchPatients(page, debouncedSearchTerm);
  };

  const handleDelete = async (item: Patient) => {
    try {
      await deletePatient(item.id);
    } catch (err) {
      console.error('Error deleting patient:', err);
    }
  };

  const handleAddPatient = () => {
    setIsNavigating(true);
    router.push('/dashboard/pacientes/agregar');
  };

  const handleEdit = async (item: Patient) => {
    try {
      setIsNavigating(true);
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

  const handleMedicalHistory = (item: Patient) => {
    try {
      setIsNavigating(true);
      setEditData(item.id, '', 'patient');
      const patientNameSlug = `${item.names}-${item.lastNamePaternal}`
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .trim();
      router.push(`/dashboard/pacientes/historial/${patientNameSlug}`);
    } catch (err) {
      console.error('Error navigating to medical history page:', err);
      alert('Error al navegar a la página de historial médico');
    }
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
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
            onChange={handleSearchTermChange}
            startAdornment={<SearchIcon sx={{ color: 'gray' }} />}
            sx={{
              bgcolor: "#ffffff",
              borderRadius: "10px",
              width: "300px",
              "& .MuiInputBase-root": {
                height: "45px",
                padding: "10px 14px",
              },
              "& .MuiInputBase-input": {
                padding: "0",
              },
            }}
          />
          {isAdmin && (
            <Button
              label="Añadir Paciente"
              variant="contained"
              sx={{
              bgcolor: "#f5a623",
              color: "black",
              height: "45px",
              padding: "10px 14px",
            }}
              onClick={handleAddPatient}
            />
          )}
        </Box>
      </Box>
      <Table
        items={patients ?? []}
        columns={patientColumns}
        error={patientsError}
        onEdit={isAdmin ? handleEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
        onMedicalHistory={handleMedicalHistory}
        totalPages={patientsTotalPages}
        currentPage={patientsCurrentPage}
        pageSize={patientsPageSize}
        onPageChange={handlePageChange}
        loading={patientsLoading}
        enableEdit={isAdmin}
        enableDelete={isAdmin}
        enableMedicalHistory={true}
      />
    </Box>
  );
};

export default Patients;