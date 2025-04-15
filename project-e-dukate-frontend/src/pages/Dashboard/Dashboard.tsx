"use client";

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { useApi } from '../../hooks/useApi';
import { Specialty, ColumnConfig } from '../../types/table';

interface User {
  id: string;
  names: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  mobileNumber: string;
  role: string;
}

const tabMessages: { [key: string]: string } = {
  usuarios: 'Este es el botón de Usuarios',
  pagos: 'Este es el botón de Pagos',
  horarios: 'Este es el botón de Horarios',
  metricas: 'Este es el botón de Métricas',
};

export const Dashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('especialidades');
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Specialty | null>(null);
  const [newItem, setNewItem] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const { 
    data: specialties, 
    error: specialtiesError, 
    totalPages: specialtiesTotalPages, 
    currentPage: specialtiesCurrentPage, 
    pageSize: specialtiesPageSize, 
    loading: specialtiesLoading, 
    fetchData: fetchSpecialties, 
    addItem: addSpecialty, 
    updateItem: updateSpecialty, 
    deleteItem: deleteSpecialty 
  } = useApi<Specialty>("specialties");
  const { 
    data: users, 
    error: usersError, 
    totalPages: usersTotalPages, 
    currentPage: usersCurrentPage, 
    pageSize: usersPageSize, 
    loading: usersLoading, 
    fetchData: fetchUsers, 
    deleteItem: deleteUser 
  } = useApi<User>("users");

  const specialtyColumns: ColumnConfig<Specialty>[] = [
    { header: '', key: 'spacerLeft', width: '5%' },
    { header: 'Especialidades', key: 'typeOfSpecialty', width: '5%' },
    { header: '', key: 'spacerRight', width: '65%' },
  ];

  const userColumns: ColumnConfig<User>[] = [
    { header: 'Nombre', key: 'names', width: '20%' },
    {
      header: 'Apellido',
      key: 'lastName',
      width: '20%',
      render: (item) => `${item.lastNamePaternal} ${item.lastNameMaternal || ''}`.trim(),
    },
    {
      header: 'Rol',
      key: 'role',
      width: '20%',
      render: (item) => (
        <span
          style={{
            backgroundColor:
              item.role === 'Administrator' ? '#d1c4e9' :
              item.role === 'Specialist' ? '#f8bbd0' : '#b3e5fc',
            color: '#000',
            padding: '5px 10px',
            borderRadius: '15px',
            display: 'inline-block',
          }}
        >
          {item.role}
        </span>
      ),
    },
    { header: 'Celular', key: 'mobileNumber', width: '20%' },
  ];

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    if (tab === 'usuarios') {
      fetchUsers();
    } else if (tab === 'especialidades') {
      fetchSpecialties();
    }
  };

  const handleOpenAddModal = () => setOpenAddModal(true);

  const handleCloseAddModal = () => {
    setNewItem('');
    setAddError(null);
    setOpenAddModal(false);
  };

  const handleOpenEditModal = (item: Specialty) => {
    setSelectedItem(item);
    setNewItem(item.typeOfSpecialty);
    setEditError(null);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setNewItem('');
    setEditError(null);
    setOpenEditModal(false);
  };

  const handleAddSubmit = async () => {
    if (!newItem.trim()) return;
    try {
      await addSpecialty({ typeOfSpecialty: newItem });
      handleCloseAddModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setAddError(errorMessage);
    }
  };

  const handleEditSubmit = async () => {
    if (!newItem.trim() || !selectedItem) return;
    try {
      await updateSpecialty(selectedItem.id, { typeOfSpecialty: newItem });
      handleCloseEditModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setEditError(errorMessage);
    }
  };

  const handleSpecialtyPageChange = (page: number) => {
    fetchSpecialties(page);
  };

  const handleUserPageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleDeleteSpecialty = async (item: Specialty) => {
    try {
      await deleteSpecialty(item.id);
    } catch (err) {
      console.error("Error al eliminar especialidad:", err);
    }
  };

  const handleDeleteUser = async (item: User) => {
    try {
      await deleteUser(item.id, item.role);
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  const renderContent = () => {
    if (selectedTab === 'especialidades') {
      return (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>Especialidades</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search product name"
                value={searchTerm}
                onChange={setSearchTerm}
                startAdornment={<SearchIcon sx={{ color: 'gray' }} />}
                sx={{
                  width: '300px',
                  '& .MuiInputBase-input': {
                    padding: '10px 14px',
                  },
                }}
              />
              <Button label="Añadir Especialidad" variant="contained" sx={{ bgcolor: '#f5c71a', color: 'black' }} onClick={handleOpenAddModal} />
            </Box>
          </Box>
          <Table
            items={specialties ?? []}
            columns={specialtyColumns}
            error={specialtiesError}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteSpecialty}
            totalPages={specialtiesTotalPages}
            currentPage={specialtiesCurrentPage}
            pageSize={specialtiesPageSize}
            onPageChange={handleSpecialtyPageChange}
            loading={specialtiesLoading}
          />
          <Modal open={openAddModal} onClose={handleCloseAddModal} title="Añadir Nueva Especialidad" onSubmit={handleAddSubmit}>
            <TextField
              label="Nombre de la Especialidad"
              value={newItem}
              onChange={setNewItem}
              autoComplete="off"
              required
              error={!!addError}
              helperText={addError}
            />
          </Modal>
          <Modal open={openEditModal} onClose={handleCloseEditModal} title="Editar Especialidad" onSubmit={handleEditSubmit}>
            <TextField
              label="Nombre de la Especialidad"
              value={newItem}
              onChange={setNewItem}
              autoComplete="off"
              required
              error={!!editError}
              helperText={editError}
            />
          </Modal>
        </Box>
      );
    }

    if (selectedTab === 'usuarios') {
      return (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>Usuarios</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search product name"
                value={searchTerm}
                onChange={setSearchTerm}
                startAdornment={<SearchIcon sx={{ color: 'gray' }} />}
                sx={{
                  width: '300px',
                  '& .MuiInputBase-input': {
                    padding: '10px 14px',
                  },
                }}
              />
              <Button label="Añadir Usuario" variant="contained" sx={{ bgcolor: '#f5c71a', color: 'black' }} onClick={() => alert("Funcionalidad de añadir usuario no implementada aún")} />
            </Box>
          </Box>
          <Table
            items={users ?? []}
            columns={userColumns}
            error={usersError}
            onEdit={(item) => alert(`Funcionalidad de editar usuario (${item.id}) no implementada aún`)}
            onDelete={handleDeleteUser}
            totalPages={usersTotalPages}
            currentPage={usersCurrentPage}
            pageSize={usersPageSize}
            onPageChange={handleUserPageChange}
            loading={usersLoading}
          />
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h5">{tabMessages[selectedTab]}</Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar selectedTab={selectedTab} onTabChange={handleTabChange} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header userName="Cara Martinez" userRole="Administrador" />
        <Box sx={{ flex: 1, bgcolor: '#f5f5f5', p: 3, overflow: 'auto' }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;