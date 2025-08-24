/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from 'react';
import { Table } from '../Table';
import { Appointment } from '../../types/appointment';
import { ColumnConfig } from '../../types/table';
import { Box, Typography } from '@mui/material';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { RescheduleSessionDialog } from './RescheduleSessionDialog';
import { cancelSession } from '@/services/appointmentService';
import { dayTranslation } from "@/utils/scheduleUtils";
import { showNotification } from "@/services/notificationService";

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
  enableReschedule: boolean;
  onRefresh: () => void;
  selectedDate?: Date | null;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({ 
  appointments, 
  totalPages, 
  currentPage, 
  onPageChange, 
  enableEdit,
  enableReschedule,
  onRefresh,
  selectedDate
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
      showNotification("Error al cancelar la sesión", "error");
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
        enableEdit={enableEdit}
        enableDelete={false}
        enableReschedule={enableReschedule}
        onReschedule={handleRescheduleSession}
        enableCancel={true}
        onCancel={handleCancelSession}
        keyExtractor={(item) => item.sessionId || item.id}
        selectedDate={selectedDate}
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