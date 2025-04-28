"use client";

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Table } from '@/components/Table';
import { useApi } from '@/hooks/useApi';
import { ColumnConfig } from '@/types/table';
import { Specialist, Schedule } from '@/types/userTypes';
import { useRouter } from 'next/navigation';
import { useEditStore } from '@/stores/editStore';
import { TextField } from '../../components/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { dayTranslation, formatTimeSlot } from '@/utils/scheduleUtils';

const getScheduleForDay = (schedules: Schedule[], dayInSpanish: string): string => {
  const dayInEnglish = Object.keys(dayTranslation).find(
    key => dayTranslation[key] === dayInSpanish
  );
  if (!dayInEnglish) return '-';

  const schedule = schedules.find(s => s.dayOfWeek.toLowerCase() === dayInEnglish.toLowerCase());
  if (!schedule || !schedule.attends) return '-';
  return formatTimeSlot(schedule.timeSlots);
};

export const Schedules: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const { setEditData } = useEditStore();
  const { data, error, totalPages, currentPage, loading, fetchData } = useApi<Specialist>('specialists');

  const columns: ColumnConfig<Specialist>[] = [
    {
      header: 'Especialistas',
      key: 'names',
      render: (item) => `${item.names} ${item.lastNamePaternal} ${item.lastNameMaternal || ''}`,
    },
    {
      header: 'Lunes',
      key: 'lunes',
      render: (item) => getScheduleForDay(item.schedules, 'Lunes'),
    },
    {
      header: 'Martes',
      key: 'martes',
      render: (item) => getScheduleForDay(item.schedules, 'Martes'),
    },
    {
      header: 'Miércoles',
      key: 'miercoles',
      render: (item) => getScheduleForDay(item.schedules, 'Miércoles'),
    },
    {
      header: 'Jueves',
      key: 'jueves',
      render: (item) => getScheduleForDay(item.schedules, 'Jueves'),
    },
    {
      header: 'Viernes',
      key: 'viernes',
      render: (item) => getScheduleForDay(item.schedules, 'Viernes'),
    },
    {
      header: 'Sábado',
      key: 'sabado',
      render: (item) => getScheduleForDay(item.schedules, 'Sábado'),
    },
  ];

  const handleEdit = true
    ? (item: Specialist) => {
        setEditData(item.id, 'Specialist', 'user');
        router.push('/dashboard/usuarios/edit');
      }
    : undefined;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'black' }}>
        Horarios
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          placeholder="Buscar especialista"
          value={searchTerm}
          onChange={setSearchTerm}
          startAdornment={<SearchIcon sx={{ color: 'gray' }} />}
          sx={{
            width: '300px',
            '& .MuiInputBase-input': { padding: '10px 14px' },
          }}
        />
        </Box>
      </Box>
      <Table
        items={data}
        columns={columns}
        error={error}
        onEdit={handleEdit}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={(page) => fetchData(page)}
        loading={loading}
        enableEdit={true}
        enableDelete={false}
      />
    </Box>
  );
};

export default Schedules;