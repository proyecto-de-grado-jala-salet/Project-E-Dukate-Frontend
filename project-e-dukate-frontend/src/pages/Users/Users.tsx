"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Table } from '../../components/Table';
import { useApi } from '../../hooks/useApi';
import { useRouter } from 'next/navigation';
import { ColumnConfig } from '../../types/table';
import { useEditStore } from '../../stores/editStore';
import { useDebounce } from '../../hooks/useDebounce';

interface User {
  id: string;
  names: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  mobileNumber: string;
  role: string;
}

export const Users: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { setEditData } = useEditStore();
  const {
    data: users,
    error: usersError,
    totalPages: usersTotalPages,
    currentPage: usersCurrentPage,
    pageSize: usersPageSize,
    loading: usersLoading,
    fetchData: fetchUsers,
    deleteItem: deleteUser,
  } = useApi<User>("users");

  const userColumns: ColumnConfig<User>[] = [
    { header: "Nombre(s)", key: "names", width: "20%" },
    {
      header: "Apellido",
      key: "lastName",
      width: "20%",
      render: (item) =>
        `${item.lastNamePaternal} ${item.lastNameMaternal || ""}`.trim(),
    },
    {
      header: "Rol",
      key: "role",
      width: "20%",
      render: (item) => {
        const roleInSpanish =
          item.role === "Administrator"
            ? "Administrador"
            : item.role === "Specialist"
              ? "Especialista"
              : item.role;

        return (
          <span
            style={{
              backgroundColor:
                item.role === "Administrator"
                  ? "#d1c4e9"
                  : item.role === "Specialist"
                    ? "#f8bbd0"
                    : "#b3e5fc",
              color: "#000",
              padding: "5px 10px",
              borderRadius: "15px",
              display: "inline-block",
            }}
          >
            {roleInSpanish}
          </span>
        );
      },
    },
    { header: "Celular", key: "mobileNumber", width: "20%" },
  ];

  useEffect(() => {
    fetchUsers(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchUsers]);

  const handleAddUser = () => {
    router.push('/dashboard/usuarios/agregar');
  };

  const handlePageChange = (page: number) => {
    fetchUsers(page, debouncedSearchTerm);
  };

  const handleDelete = async (item: User) => {
    try {
      await deleteUser(item.id, item.role);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleEdit = async (item: User) => {
    try {
      setEditData(item.id, item.role, 'user');
      const userNameSlug = `${item.names}-${item.lastNamePaternal}`
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .trim();
      router.push(`/dashboard/usuarios/editar/${userNameSlug}?role=${item.role}`);
    } catch (err) {
      console.error('Error navigating to edit page:', err);
      alert('Error al navegar a la página de edición');
    }
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>Usuarios</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Buscar usuario"
            value={searchTerm}
            onChange={handleSearchTermChange}
            startAdornment={<SearchIcon sx={{ color: 'gray' }} />}
            sx={{
              width: '300px',
              '& .MuiInputBase-input': { padding: '10px 14px' },
            }}
          />
          <Button
            label="Añadir Usuario"
            variant="contained"
            sx={{ bgcolor: '#f5c71a', color: 'black' }}
            onClick={handleAddUser}
          />
        </Box>
      </Box>
      <Table
        items={users ?? []}
        columns={userColumns}
        error={usersError}
        onEdit={handleEdit}
        onDelete={handleDelete}
        totalPages={usersTotalPages}
        currentPage={usersCurrentPage}
        pageSize={usersPageSize}
        onPageChange={handlePageChange}
        loading={usersLoading}
      />
    </Box>
  );
};

export default Users;