"use client";

import React, { useState } from "react";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { AppointmentTable } from "@/components/Appointments/AppointmentTable";
import { GenericFilterContainer } from "@/components/GenericFilters/GenericFilterContainer";
import { AddAppointmentDialog } from "@/components/Appointments/AddAppointmentDialog";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useAppointments } from "@/hooks/useAppointments";
import SearchIcon from '@mui/icons-material/Search';
import { Appointment } from "@/types/appointment";

const CitasPage: React.FC = () => {
  const router = useRouter();
  const { userRole } = useAuthStore();
  const isAdmin = userRole === "Administrator" || userRole === "Specialist";
  const [openDialog, setOpenDialog] = useState(false);
  
  const {
    filters,
    appointments,
    error,
    totalPages,
    currentPage,
    loading,
    patientOptions,
    specialistOptions,
    filterConfig,
    handlePageChange,
    handleResetFilters,
    handlePatientSearchChange,
    addAppointment,
    deleteAppointment
  } = useAppointments();

  const handleEdit = (appointment: Appointment) => {
    if (isAdmin) {
      router.push(`/dashboard/citas/editar/${appointment.Id}`);
    }
  };

  const handleDelete = async (appointment: Appointment) => {
    if (isAdmin) {
      try {
        await deleteAppointment(appointment.Id);
      } catch (err) {
        console.error("Error eliminando cita:", err);
      }
    }
  };

  const handleAddAppointment = async (appointment: {
    patientId: string;
    specialistId: string;
    startTime: string;
    endTime: string;
    status: string;
  }) => {
    try {
      const patient = patientOptions.find(p => p.value === appointment.patientId);
      const specialist = specialistOptions.find(s => s.value === appointment.specialistId);
      
      const newAppointment = {
        Id: crypto.randomUUID(),
        StartTime: appointment.startTime,
        EndTime: appointment.endTime,
        PatientId: appointment.patientId,
        PatientName: patient?.label || "",
        SpecialistId: appointment.specialistId,
        SpecialistName: specialist?.label || "",
        Status: appointment.status,
      };
      
      await addAppointment(newAppointment);
      setOpenDialog(false);
    } catch (err) {
      console.error("Error agregando cita:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "black" }}>
          Citas
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder="Buscar paciente"
            value={filters.patientSearch}
            onChange={(e) => handlePatientSearchChange(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon sx={{ color: 'gray' }} /> }}
            sx={{
              bgcolor: "#ffffff",
              borderRadius: "12px",
              width: "300px",
              "& .MuiInputBase-root": { 
                height: "45px",
                padding: "10px 14px",
                borderRadius: "12px",
              },
              "& .MuiInputBase-input": {
                padding: "0",
              },
            }}
          />
          {isAdmin && (
            <Button
              variant="contained"
              sx={{ bgcolor: "#f5a623", color: "black", height: "45px", padding: "10px 14px", borderRadius: "12px" }}
              onClick={() => setOpenDialog(true)}
            >
              Añadir Cita
            </Button>
          )}
        </Box>
      </Box>
      
      <GenericFilterContainer
        filters={filterConfig}
        onResetFilters={handleResetFilters}
      />
      
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Typography color="error" sx={{ my: 2 }}>
          {error}
        </Typography>
      )}
      
      {!loading && !error && (
        <AppointmentTable
          appointments={appointments}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onEdit={isAdmin ? handleEdit : undefined}
          onDelete={isAdmin ? handleDelete : undefined}
          enableEdit={isAdmin}
          enableDelete={isAdmin}
        />
      )}
      
      <AddAppointmentDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleAddAppointment}
        patientOptions={patientOptions}
        specialistOptions={specialistOptions}
      />
    </Box>
  );
};

export default CitasPage;