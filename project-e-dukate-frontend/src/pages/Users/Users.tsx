"use client";

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '../../components/Button';
import { TextField } from '../../components/TextField';
import { Table } from '../../components/Table';
import { useApi } from '../../hooks/useApi';
import { ColumnConfig } from '../../types/table';

interface User {
  id: string;
  names: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  mobileNumber: string;
  role: string;
}

export const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
    { header: 'Name', key: 'names', width: '20%' },
    {
      header: 'Last Name',
      key: 'lastName',
      width: '20%',
      render: (item) => `${item.lastNamePaternal} ${item.lastNameMaternal || ''}`.trim(),
    },
    {
      header: 'Role',
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
    { header: 'Mobile', key: 'mobileNumber', width: '20%' },
  ];

  const handlePageChange = (page: number) => {
    fetchUsers(page);
  };

  const handleDelete = async (item: User) => {
    try {
      await deleteUser(item.id, item.role);
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>Users</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search user name"
            value={searchTerm}
            onChange={setSearchTerm}
            startAdornment={<SearchIcon sx={{ color: 'gray' }} />}
            sx={{
              width: '300px',
              '& .MuiInputBase-input': { padding: '10px 14px' },
            }}
          />
          <Button
            label="Add User"
            variant="contained"
            sx={{ bgcolor: '#f5c71a', color: 'black' }}
            onClick={() => alert("Add user functionality not implemented yet")}
          />
        </Box>
      </Box>
      <Table
        items={users ?? []}
        columns={userColumns}
        error={usersError}
        onEdit={(item) => alert(`Edit user (${item.id}) functionality not implemented yet`)}
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