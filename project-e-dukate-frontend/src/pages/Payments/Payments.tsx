"use client";

import React from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { PaymentTable } from "../../components/Payments/PaymentTable";
import { PaymentFilters } from "../../components/Payments/PaymentFilters";
import { Pagination } from "../../components/Pagination";
import { usePayments } from "../../hooks/usePayments";

dayjs.locale("es");

const formatDate = (date: string | null): string => {
  if (!date) return "-";
  const parsedDate = new Date(date);
  return parsedDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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

  if (loading) return <Typography variant="h6">Cargando...</Typography>;
  if (error) return <Typography variant="h6" color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3, bgcolor: "#EDEDED", height: "100%" }}>
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: "bold", color: "black" }}
      >
        Pagos
      </Typography>
      <PaymentFilters
        specialistId={specialistId}
        year={year}
        month={month}
        day={day}
        status={status}
        setSpecialistId={setSpecialistId}
        setYear={setYear}
        setMonth={setMonth}
        setDay={setDay}
        setStatus={setStatus}
        specialists={specialists}
        statuses={statuses}
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
