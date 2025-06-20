"use client";

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { useApi } from '../../hooks/useApi';
import { Specialty } from '../../types/table';
import { ColumnConfig } from '../../types/table';
import { useDebounce } from '../../hooks/useDebounce';

export const Specialties: React.FC = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Specialty | null>(null);
  const [newItem, setNewItem] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
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
    deleteItem: deleteSpecialty,
  } = useApi<Specialty>("specialties");

  const specialtyColumns: ColumnConfig<Specialty>[] = [
    { header: '', key: 'spacerLeft', width: '5%' },
    { header: 'Especialidad', key: 'typeOfSpecialty', width: '5%' },
    { header: '', key: 'spacerRight', width: '65%' },
  ];

  useEffect(() => {
    fetchSpecialties(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchSpecialties]);

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
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setAddError(errorMessage);
    }
  };

  const handleEditSubmit = async () => {
    if (!newItem.trim() || !selectedItem) return;
    try {
      await updateSpecialty(selectedItem.id, { typeOfSpecialty: newItem });
      handleCloseEditModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setEditError(errorMessage);
    }
  };

  const handlePageChange = (page: number) => {
    fetchSpecialties(page, debouncedSearchTerm);
  };

  const handleDelete = async (item: Specialty) => {
    try {
      await deleteSpecialty(item.id);
    } catch (err) {
      console.error("Error deleting specialty:", err);
    }
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "black" }}>
          Especialidades
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder="Buscar especialidad"
            value={searchTerm}
            onChange={handleSearchTermChange}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "gray" }} />,
            }}
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
          <Button
            label="Añadir Especialidad"
            variant="contained"
            sx={{
              bgcolor: "#f5a623",
              color: "black",
              height: "45px",
              padding: "10px 14px",
            }}
            onClick={handleOpenAddModal}
          />
        </Box>
      </Box>
      <Table
        items={specialties ?? []}
        columns={specialtyColumns}
        error={specialtiesError}
        onEdit={handleOpenEditModal}
        onDelete={handleDelete}
        totalPages={specialtiesTotalPages}
        currentPage={specialtiesCurrentPage}
        pageSize={specialtiesPageSize}
        onPageChange={handlePageChange}
        loading={specialtiesLoading}
      />
      <Modal
        open={openAddModal}
        onClose={handleCloseAddModal}
        title="Añadir Nueva Especialidad"
        onSubmit={handleAddSubmit}
      >
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
      <Modal
        open={openEditModal}
        onClose={handleCloseEditModal}
        title="Editar Especialidad"
        onSubmit={handleEditSubmit}
      >
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
};

export default Specialties;