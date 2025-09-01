"use client";

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Table } from '@/components/Table';
import { useApi } from '@/hooks/useApi';
import { ColumnConfig } from '@/types/table';
import { Specialist } from '@/types/userTypes';
import { Schedule } from '@/types/userTypes';
import { useRouter } from 'next/navigation';
import { useEditStore } from '@/stores/editStore';
import { TextField } from '@/components/TextField';
import SearchIcon from '@mui/icons-material/Search';
import { dayTranslation } from '@/utils/scheduleUtils';
import { formatTimeSlot } from '@/utils/scheduleUtils';
import slugify from 'slugify';
import { useDebounce } from '@/hooks/useDebounce';

const getScheduleForDay = (schedules: Schedule[], dayInSpanish: string): string => {
  const dayInEnglish = Object.keys(dayTranslation).find(
    key => dayTranslation[key] === dayInSpanish
  );
  if (!dayInEnglish) return '-';
  if (!Array.isArray(schedules)) return '-';

  const schedule = schedules.find(s => s.dayOfWeek.toLowerCase() === dayInEnglish.toLowerCase());
  if (!schedule || !schedule.attends) return '-';
  return formatTimeSlot(schedule.timeSlots);
};

export const Schedules: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
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

  useEffect(() => {
      fetchData(1, debouncedSearchTerm);
    }, [debouncedSearchTerm, fetchData]);

  const handlePageChange = (page: number) => {
    fetchData(page, debouncedSearchTerm);
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleEdit = true
    ? (item: Specialist) => {
        setEditData(item.id, 'Specialist', 'user');
        const specialistName = `${item.names} ${item.lastNamePaternal} ${item.lastNameMaternal || ''}`.toLowerCase();
        const slug = slugify(specialistName, { lower: true, strict: true });
        router.push(`/dashboard/horarios/${slug}`);
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
          onChange={handleSearchTermChange}
          startAdornment={<SearchIcon sx={{ color: 'gray' }} />}
          sx={{
              bgcolor: "#ffffff",
              borderRadius: "10px",
              width: "300px",
              "& .MuiInputBase-root": {
                height: "45px",
                padding: "10px 14px",
              },
              "& .MuiInputBase-input": {
                padding: "0",
              },
            }}
        />
        </Box>
      </Box>
      <Table
        items={loading ? [] : data}
        columns={columns}
        error={error}
        onEdit={handleEdit}
        totalPages={totalPages}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={handlePageChange}
        loading={loading}
        enableEdit={true}
        enableDelete={false}
      />
    </Box>
  );
};

export default Schedules;