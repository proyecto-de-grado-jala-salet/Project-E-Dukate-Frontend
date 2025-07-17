"use client";

import React from 'react';
import { Table } from '../Table';
import { Appointment } from '../../types/appointment';
import { ColumnConfig } from '../../types/table';
import { Box, Typography } from '@mui/material';

interface AppointmentTableProps {
  appointments: Appointment[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  enableEdit: boolean;
  enableDelete: boolean;
}

const statusMap: Record<string, string> = {
  Scheduled: "Programada",
  Confirmed: "Confirmado",
  Cancelled: "Cancelado",
};

const statusColors = {
  Scheduled: '#76CAFF',
  Confirmed: '#009F1D',
  Cancelled: '#F24B4B',
};

export const AppointmentTable: React.FC<AppointmentTableProps> = ({ 
  appointments, 
  totalPages, 
  currentPage, 
  onPageChange, 
  onEdit, 
  onDelete,
  enableEdit,
  enableDelete 
}) => {
  const columns: ColumnConfig<Appointment>[] = [
    { header: "Hora de inicio", key: "startTime" },
    { header: "Hora de finalización", key: "endTime" },
    { header: "Paciente", key: "patientName" },
    { header: "Médico", key: "specialistName" },
    {
      header: "Estado",
      key: "status",
      render: (item) => {        
        const statusText =
          statusMap[item.status as keyof typeof statusMap] || item.status;

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
              width: "120px",
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
    <Table
      items={appointments}
      columns={columns}
      error={null}
      totalPages={totalPages}
      currentPage={currentPage}
      pageSize={10}
      onPageChange={onPageChange}
      onEdit={onEdit}
      onDelete={onDelete}
      enableEdit={enableEdit}
      enableDelete={enableDelete}
    />
  );
};