/* eslint-disable @typescript-eslint/no-explicit-any */
// project-e-dukate-frontend/src/components/Appointments/AppointmentTable.tsx
"use client";

import React, { useState } from 'react';
import { Table } from '../Table';
import { Appointment } from '../../types/appointment';
import { ColumnConfig } from '../../types/table';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { FaRegCalendarCheck } from "react-icons/fa";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ConfirmationDialog } from '../ConfirmationDialog';
import { RescheduleSessionDialog } from './RescheduleSessionDialog';
import { cancelSession } from '@/services/appointmentService';

// Mapeo de días de la semana
const dayTranslation: Record<string, string> = {
  Sunday: "Domingo",
  Monday: "Lunes",
  Tuesday: "Martes",
  Wednesday: "Miércoles",
  Thursday: "Jueves",
  Friday: "Viernes",
  Saturday: "Sábado",
};

const statusMap: Record<string, string> = {
  Scheduled: "Programada",
  Confirmed: "Confirmado",
  Cancelled: "Cancelado",
  Rescheduled: "Reprogramada",
};

const statusColors = {
  Scheduled: '#76CAFF',
  Confirmed: '#009F1D',
  Cancelled: '#F24B4B',
  Rescheduled: '#FFA500',
};

interface AppointmentTableProps {
  appointments: Appointment[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  enableEdit: boolean;
  enableDelete: boolean;
  onRefresh: () => void;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({ 
  appointments, 
  totalPages, 
  currentPage, 
  onPageChange, 
  onRefresh
}) => {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleCancelSession = (session: any) => {
    
    const appointmentForState: Appointment = {
      id: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
      patientId: session.patientId,
      patientName: session.patientName,
      specialistId: session.specialistId,
      specialistName: session.specialistName,
      specialtyId: session.specialtyId,
      specialtyName: session.specialtyName,
      sessionCount: 1,
      status: session.status,
      scheduledSessions: [{
        id: session.sessionId || session.id,
        timeSlotId: session.timeSlotId,
        dayOfWeek: session.dayOfWeek,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.sessionStatus || session.status
      }]
    };
    
    setSelectedAppointment(appointmentForState);
    setSelectedSession(session);
    setOpenCancelDialog(true);
  };
  
  const handleRescheduleSession = (session: any) => {
    
    const appointmentForState: Appointment = {
      id: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
      patientId: session.patientId,
      patientName: session.patientName,
      specialistId: session.specialistId,
      specialistName: session.specialistName,
      specialtyId: session.specialtyId,
      specialtyName: session.specialtyName,
      sessionCount: 1,
      status: session.status,
      scheduledSessions: [{
        id: session.sessionId || session.id,
        timeSlotId: session.timeSlotId,
        dayOfWeek: session.dayOfWeek,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.sessionStatus || session.status
      }]
    };
    
    setSelectedAppointment(appointmentForState);
    setSelectedSession(session);
    setOpenRescheduleDialog(true);
  };
  
  const confirmCancelSession = async () => {
    if (!selectedAppointment || !selectedSession) return;
    
    try {
      await cancelSession(
        selectedAppointment.id, 
        selectedSession.sessionId || selectedSession.id
      );
      onRefresh();
      setOpenCancelDialog(false);
    } catch (error) {
      console.error("Error cancelando sesión:", error);
    }
  };

  const handleRescheduleSuccess = () => {
    onRefresh();
    setOpenRescheduleDialog(false);
  };

  const rows = appointments.map(appointment => {
    return {
      ...appointment,
      specialistId: appointment.specialistId,
      specialtyId: appointment.specialtyId,
      patientId: appointment.patientId,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      dayOfWeek: appointment.dayOfWeek || "",
      status: appointment.sessionStatus || appointment.status,
      sessionId: appointment.sessionId || appointment.id
    };
  });

  const columns: ColumnConfig<Appointment>[] = [
    { 
      header: "Hora de inicio", 
      key: "startTime" 
    },
    { 
      header: "Hora de finalización", 
      key: "endTime" 
    },
    { header: "Paciente", key: "patientName" },
    { header: "Médico", key: "specialistName" },
    {
      header: "Estado",
      key: "status",
      render: (item) => {
        const statusText = statusMap[item.status as keyof typeof statusMap] || item.status;
        
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
              padding: "4px 8px",
              borderRadius: "8px",
              border: "1px solid #D8D8D8",
              width: "150px",
              margin: "0 auto",
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor:
                  statusColors[item.status as keyof typeof statusColors],
              }}
            />
            <Typography variant="body2" sx={{ color: "#000000" }}>
              {statusText}
            </Typography>
          </Box>
        );
      },
    },
    {
      header: "Acciones",
      key: "actions",
      render: (item) => {
        if (item.status === "Cancelled") {
          return (
            <Box sx={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: 1,
              padding: "4px 0"
            }}>
              <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                -
              </Typography>
            </Box>
          );
        }
        
        return (
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: 1,
            padding: "4px 0"
          }}>
            <Tooltip title="Reprogramar sesión" placement="bottom">
              <IconButton 
                onClick={() => handleRescheduleSession(item)}
                disabled={item.status === "Confirmed"}
              >
                <FaRegCalendarCheck />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Cancelar sesión" placement="bottom">
              <IconButton 
                onClick={() => handleCancelSession(item)}
                disabled={item.status === "Confirmed"}
              >
                <DeleteOutlineIcon sx={{ color: "red" }} />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Table
        items={rows}
        columns={columns}
        error={null}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={onPageChange}
        enableEdit={false}
        enableDelete={false}
        keyExtractor={(item) => item.sessionId || item.id}
      />
      
      <ConfirmationDialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        onConfirm={confirmCancelSession}
        title="Cancelar Sesión"
        message={`¿Está seguro de cancelar la sesión programada para ${selectedSession?.startTime} del día ${selectedSession?.dayOfWeek ? dayTranslation[selectedSession.dayOfWeek] : ''}?`}
      />
      
      {selectedAppointment && selectedSession && (
        <RescheduleSessionDialog
          open={openRescheduleDialog}
          onClose={() => setOpenRescheduleDialog(false)}
          appointment={selectedAppointment}
          session={selectedSession}
          onRescheduleSuccess={handleRescheduleSuccess}
        />
      )}
    </>
  );
};