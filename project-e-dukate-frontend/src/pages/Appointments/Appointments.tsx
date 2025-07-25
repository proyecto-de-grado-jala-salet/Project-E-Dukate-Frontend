"use client";

import React, { useState } from "react";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { AppointmentTable } from "@/components/Appointments/AppointmentTable";
import { GenericFilterContainer } from "@/components/GenericFilters/GenericFilterContainer";
import { AddAppointmentDialog } from "@/components/Appointments/AddAppointmentDialog";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useAppointments } from "@/hooks/useAppointments";
import SearchIcon from "@mui/icons-material/Search";
import { Appointment } from "@/types/appointment";

const Appointments: React.FC = () => {
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
    specialtyOptions,
    specialistOptions,
    filterConfig,
    handlePageChange,
    handleResetFilters,
    handlePatientSearchChange,
    addAppointment,
    deleteAppointment,
    reloadWithCurrentFilters,
    fetchAppointmentsData,
    buildQueryParams,
  } = useAppointments();

  const handleEdit = (appointment: Appointment) => {
    if (isAdmin) {
      router.push(`/dashboard/citas/editar/${appointment.id}`);
    }
  };

  const handleDelete = async (appointment: Appointment) => {
    if (isAdmin) {
      try {
        await deleteAppointment(appointment.id);
      } catch (err) {
        console.error("Error eliminando cita:", err);
      }
    }
  };

  const handleAddAppointment = async (appointment: {
    patientId: string;
    specialtyId: string;
    specialistId: string;
    sessionCount: number;
    scheduledSessions: { timeSlotId: string; dayOfWeek: string; startTime: string; endTime: string; status: string }[];
  }) => {
    try {
      const patient = patientOptions.find((p) => p.value === appointment.patientId);
      const specialist = specialistOptions.find((s) => s.value === appointment.specialistId);
      const specialty = specialtyOptions.find((s) => s.value === appointment.specialtyId);

      const newAppointment: Appointment = {
        id: crypto.randomUUID(),
        patientId: appointment.patientId,
        patientName: patient?.label || "",
        specialtyId: appointment.specialtyId,
        specialtyName: specialty?.label || "",
        specialistId: appointment.specialistId,
        specialistName: specialist?.label || "",
        sessionCount: appointment.sessionCount,
        scheduledSessions: appointment.scheduledSessions,
        startTime: appointment.scheduledSessions[0]?.startTime || "",
        endTime: appointment.scheduledSessions[0]?.endTime || "",
        status: "Scheduled",
      };

      await addAppointment(newAppointment);
      console.log("Current filters before reload:", filters);
      await fetchAppointmentsData(1, buildQueryParams(1));
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
            InputProps={{ startAdornment: <SearchIcon sx={{ color: "gray" }} /> }}
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

      <GenericFilterContainer filters={filterConfig} onResetFilters={handleResetFilters} />

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
        specialtyOptions={specialtyOptions}
        reloadAppointments={reloadWithCurrentFilters}
      />
    </Box>
  );
};

export default Appointments;