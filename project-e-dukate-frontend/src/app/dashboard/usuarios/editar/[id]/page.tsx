/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { use } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from 'next/navigation';
import { useUserEdit } from '@/hooks/useUserEdit';
import { UserEdit } from '@/pages/Users';
import { User, UserRole } from '@/types/userTypes';

interface UserEditPageProps {
  params: Promise<{ id: string }>;
}

export default function UserEditPage({ params }: UserEditPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const searchParams = useSearchParams();
  const role = searchParams ? searchParams.get('role') as UserRole : null;

  const { formData, loading, error, handleSubmit, setFormData } = useUserEdit<User>({ role, id });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !formData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {error || 'No se encontraron datos del usuario'}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <UserEdit
        formData={formData}
        role={role}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
      />
      <ToastContainer />
    </>
  );
}