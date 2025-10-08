/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { use } from "react";
import { Box } from "@mui/material";
import { Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams } from "next/navigation";
import { useUserEdit } from "@/hooks/useUserEdit";
import { UserEdit } from "@/pages/Users/UserEdit";
import { User } from "@/types/userTypes";
import { UserRole } from "@/types/userTypes";
import { useEditStore } from "@/stores/editStore";

interface UserEditPageProps {
  params: Promise<{ slug: string }>;
}

export default function UserEditPage({ params }: UserEditPageProps) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const searchParams = useSearchParams();
  const role = searchParams ? (searchParams.get("role") as UserRole) : null;
  const { entityId, entityType } = useEditStore();
  const {
    formData,
    loading,
    isSubmitting,
    isUpdateSuccessful,
    error,
    handleSubmit,
    setFormData,
  } = useUserEdit<User>({ role, id: entityId || "" });

  if (isSubmitting || isUpdateSuccessful) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!entityId || entityType !== 'user') {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          No se proporcionó un ID de usuario válido
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !formData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {error || "No se encontraron datos del usuario"}
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
        isSubmitting={isSubmitting}
      />
      <ToastContainer />
    </>
  );
}