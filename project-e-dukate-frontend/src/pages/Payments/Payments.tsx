"use client";

import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { Pagination } from '@/components/Pagination';
import { usePayments } from '@/hooks/usePayments';
import CircularProgress from '@mui/material/CircularProgress';
import dynamic from 'next/dynamic';
import { useNavigation } from '@/contexts/NavigationContext';

dayjs.locale('es');

const PaymentTable = dynamic(() => 
  import('@/components/Payments/PaymentTable').then(mod => mod.PaymentTable), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

const GenericFilterContainer = dynamic(() => 
  import('@/components/GenericFilters').then(mod => mod.GenericFilterContainer), 
  {
    loading: () => <>
      <CircularProgress /> 
      <br/>
    </>,
    ssr: false
  }
);

const formatDate = (date: string | null): string => {
  if (!date) return '-';
  const parsedDate = new Date(date);
  return parsedDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const Payments: React.FC = () => {
  const {
    specialistId,
    setSpecialistId,
    year,
    setYear,
    month,
    setMonth,
    day,
    setDay,
    status,
    setStatus,
    payments,
    totalPages,
    currentPage,
    loading,
    error,
    specialists,
    patients,
    statuses,
    fetchDataWithCurrentFilters,
    handleValueChange,
    handleResetFilter,
    editedValues,
  } = usePayments();

  const { setIsNavigating } = useNavigation();
  
  useEffect(() => {
    if (!loading) {
      setIsNavigating(false);
    }
  }, [loading, setIsNavigating]);

  const filterConfig = [
    {
      type: 'dropdown' as const,
      label: 'Especialista',
      value: specialistId,
      onChange: setSpecialistId,
      options: specialists,
    },
    {
      type: 'year' as const,
      label: 'Años',
      value: year,
      onChange: setYear,
    },
    {
      type: 'month' as const,
      label: 'Meses',
      value: month,
      onChange: setMonth,
    },
    {
      type: 'dropdown' as const,
      label: 'Día',
      value: day,
      onChange: setDay,
      options: [
        { value: '', label: 'Días' },
        ...Array.from({ length: 31 }, (_, i) => ({
          value: (i + 1).toString().padStart(2, '0'),
          label: (i + 1).toString().padStart(2, '0'),
        })),
      ],
    },
    {
      type: 'dropdown' as const,
      label: 'Estado',
      value: status,
      onChange: setStatus,
      options: statuses,
    },
  ];

  if (loading) return <Typography variant="h6">Cargando...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3, bgcolor: '#EDEDED', height: '100%' }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'black' }}>
        Pagos
      </Typography>
      <GenericFilterContainer
        filters={filterConfig}
        onResetFilters={handleResetFilter}
      />
      <PaymentTable
        payments={payments}
        editedValues={editedValues}
        onValueChange={handleValueChange}
        getPatientName={(patientId) =>
          patients.find((p) => p.value === patientId)?.label || patientId
        }
        formatDate={formatDate}
      />
      {payments && payments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => fetchDataWithCurrentFilters(page)}
        />
      )}
    </Box>
  );
};

export default Payments;