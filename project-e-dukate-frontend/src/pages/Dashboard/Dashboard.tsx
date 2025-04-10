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
  const [addError, setAddError] = useState<string | null>(null); // Nuevo estado para el error de añadir
  const { data: specialties, error, totalPages, currentPage, pageSize, loading, fetchData, addItem, updateItem, deleteItem } = useApi<Specialty>("specialties");

  const columns: ColumnConfig<Specialty>[] = [
    {
      header: '#',
      key: 'index',
      width: '10%',
      render: (_, index, pagination) => {
        if (!pagination) return index + 1;
        const { currentPage, pageSize } = pagination;
        return (currentPage - 1) * pageSize + (index + 1);
      },
    },
    { header: 'Especialidades', key: 'typeOfSpecialty', width: '75%' },
  ];

  const handleTabChange = (tab: string) => setSelectedTab(tab);
  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setNewItem('');
    setAddError(null); // Limpiar el error al cerrar
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
      await addItem({ typeOfSpecialty: newItem });
      handleCloseAddModal(); // Solo cerramos si el añadido es exitoso
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setAddError(errorMessage); // Mostramos el error y mantenemos el modal abierto
    }
  };

  const handleEditSubmit = async () => {
    if (!newItem.trim() || !selectedItem) return;
    try {
      await updateItem(selectedItem.id, { typeOfSpecialty: newItem });
      handleCloseEditModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      setEditError(errorMessage);
    }
  };

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar selectedTab={selectedTab} onTabChange={handleTabChange} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header userName="Cara Martinez" userRole="Administrador" />
        <Box sx={{ flex: 1, bgcolor: '#f5f5f5', p: 3, overflow: 'auto' }}>
          {selectedTab === 'especialidades' ? (
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
                columns={columns}
                error={error}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                totalPages={totalPages}
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                loading={loading}
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
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="h5">{tabMessages[selectedTab]}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;