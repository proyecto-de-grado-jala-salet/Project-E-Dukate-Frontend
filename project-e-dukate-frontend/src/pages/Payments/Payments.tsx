"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, TableCell, TableRow, TableHead, TableBody, Paper, TableContainer } from "@mui/material";
import { Button } from "../../components/Button";
import { Dropdown } from "../../components/Dropdown";
import { TextField } from "../../components/TextField";
import { Pagination } from "../../components/Pagination";
import { useApi } from "../../hooks/useApi";
import { useDebounce } from "../../hooks/useDebounce";
import { GenericItem } from "../../types/table";
import { apiRequest } from "../../services/api";
import { showNotification } from "../../services/notificationService";

const formatDate = (date: string | null): string => {
  if (!date) return "-";
  const parsedDate = new Date(date);
  return parsedDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

interface Payment extends GenericItem {
  id: string;
  patientId: string;
  firstPaymentDate: string | null;
  lastPaymentDate: string | null;
  sessionCount: number;
  sessionCost: number;
  amountPaid: number;
  pendingAmount: number;
  specialistAmount: number;
  institutionAmount: number;
  status: string;
  totalAmount: number;
}

interface Specialist extends GenericItem {
  id: string;
  names: string;
  lastNamePaternal: string;
  lastNameMaternal?: string;
}

interface Patient extends GenericItem {
  id: string;
  names: string;
  lastNamePaternal: string;
  lastNameMaternal?: string;
}

const Payments: React.FC = () => {
  const [specialistId, setSpecialistId] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [status, setStatus] = useState("");
  const [editedValues, setEditedValues] = useState<{
    [key: string]: { sessionCost: string; amountPaid: string };
  }>({});

  const {
    data: payments,
    totalPages,
    currentPage,
    pageSize,
    loading,
    error,
    fetchData,
  } = useApi<Payment>("paymentsFilter");

  const {
    data: specialistsData,
    loading: specialistsLoading,
    error: specialistsError,
  } = useApi<Specialist>("specialists");

  const {
    data: patientsData,
    loading: patientsLoading,
    error: patientsError,
  } = useApi<Patient>("patients");

  const specialists = specialistsData
    ? specialistsData.map((spec) => ({
        value: spec.id,
        label: `${spec.names} ${spec.lastNamePaternal} ${spec.lastNameMaternal || ""}`.trim(),
      }))
    : [];

  const patients = patientsData
    ? patientsData.map((patient) => ({
        value: patient.id,
        label: `${patient.names} ${patient.lastNamePaternal} ${patient.lastNameMaternal || ""}`.trim(),
      }))
    : [];

  const years = Array.from({ length: 10 }, (_, i) => ({
    value: (new Date().getFullYear() - i).toString(),
    label: (new Date().getFullYear() - i).toString(),
  }));
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, "0"),
    label: (i + 1).toString().padStart(2, "0"),
  }));
  const days = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, "0"),
    label: (i + 1).toString().padStart(2, "0"),
  }));
  const statuses = [
    { value: "", label: "Seleccione una opción" },
    { value: "Pending", label: "Pendiente" },
    { value: "Completed", label: "Completado" },
  ];

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.value === patientId);
    return patient ? patient.label : patientId;
  };

  useEffect(() => {
    if (payments) {
      const initialValues = payments.reduce((acc, payment) => ({
        ...acc,
        [payment.id]: {
          sessionCost: payment.sessionCost.toString(),
          amountPaid: payment.amountPaid.toString(),
        },
      }), {});
      setEditedValues(initialValues);
    }
  }, [payments]);

  const debouncedEditedValues = useDebounce(editedValues, 500);

  useEffect(() => {
    const updatePayment = async (id: string, sessionCost: string, amountPaid: string) => {
      try {
        const sessionCostNum = parseFloat(sessionCost);
        const amountPaidNum = parseFloat(amountPaid);
        if (isNaN(sessionCostNum) || isNaN(amountPaidNum)) {
          throw new Error("Valores inválidos");
        }

        await apiRequest("payments", "PUT", {
          sessionCost: sessionCostNum,
          amountPaid: amountPaidNum,
        }, id);

        const queryParams = new URLSearchParams({
          SpecialistId: specialistId,
          Year: year,
          Month: month,
          Day: day,
          Status: status,
          PageNumber: currentPage.toString(),
          PageSize: pageSize.toString(),
        }).toString();
        fetchData(currentPage, `?${queryParams}`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al actualizar el pago";
        showNotification(errorMessage, "error");
      }
    };

    Object.entries(debouncedEditedValues).forEach(([id, values]) => {
      const payment = payments?.find((p) => p.id === id);
      if (
        payment &&
        (parseFloat(values.sessionCost) !== payment.sessionCost ||
          parseFloat(values.amountPaid) !== payment.amountPaid)
      ) {
        updatePayment(id, values.sessionCost, values.amountPaid);
      }
    });
  }, [debouncedEditedValues, payments, specialistId, year, month, day, status, currentPage, pageSize, fetchData]);

  const handleValueChange = (id: string, field: "sessionCost" | "amountPaid", value: string) => {
    setEditedValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    const queryParams = new URLSearchParams({
      SpecialistId: specialistId,
      Year: year,
      Month: month,
      Day: day,
      Status: status,
      PageNumber: currentPage.toString(),
      PageSize: pageSize.toString(),
    }).toString();
    fetchData(currentPage, `?${queryParams}`);
  }, [specialistId, year, month, day, status, currentPage, fetchData, pageSize]);

  const handleResetFilter = () => {
    setSpecialistId("");
    setYear("");
    setMonth("");
    setDay("");
    setStatus("");
    fetchData(1, "?PageNumber=1&PageSize=10");
  };

  if (loading || specialistsLoading || patientsLoading)
    return <Typography variant="h6">Cargando...</Typography>;
  if (error || specialistsError || patientsError)
    return <Typography variant="h6" color="error">{error || specialistsError || patientsError}</Typography>;
  if (!payments || payments.length === 0)
    return <Typography variant="h6">No se encontraron elementos</Typography>;

  return (
    <Box sx={{ p: 3, bgcolor: "#EDEDED", height: "100%" }}>
      <Typography variant="h5" sx={{ mb: 2, color: "#013c28" }}>
        Pagos
      </Typography>
      <Box sx={{ mb: 2, display: "flex", gap: 1, alignItems: "center" }}>
        <Typography variant="body2">Filter By</Typography>
        <Dropdown
          label="Especialista"
          value={specialistId}
          onChange={setSpecialistId}
          options={specialists}
        />
        <Dropdown
          label="Año"
          value={year}
          onChange={setYear}
          options={years}
        />
        <Dropdown
          label="Mes"
          value={month}
          onChange={setMonth}
          options={months}
        />
        <Dropdown
          label="Día"
          value={day}
          onChange={setDay}
          options={days}
        />
        <Dropdown
          label="Estado"
          value={status}
          onChange={setStatus}
          options={statuses}
        />
        <Button
          label="Reset Filter"
          color="error"
          variant="outlined"
          sx={{ borderRadius: "12px" }}
          onClick={handleResetFilter}
        />
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #e0e0e0", borderRadius: "12px", overflow: "hidden" }}>
        <Box sx={{ display: "table", width: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "15%",
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Paciente
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "10%",
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Fecha de inicio
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "10%",
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Fecha de finalización
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "5%",
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Sesiones
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "10%",
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Costo
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "10%",
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Monto pagado
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "10%",
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Monto pendiente
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "10%",
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Terapia
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "10%",
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Institución
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "5%",
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Estado
              </TableCell>
              <TableCell
                sx={{
                  color: "black",
                  fontWeight: "bold",
                  padding: "16px 24px",
                  width: "5%",
                  textAlign: "center",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell
                  sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                >
                  {getPatientName(payment.patientId)}
                </TableCell>
                <TableCell
                  sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                >
                  {formatDate(payment.firstPaymentDate)}
                </TableCell>
                <TableCell
                  sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                >
                  {formatDate(payment.lastPaymentDate)}
                </TableCell>
                <TableCell
                  sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                >
                  {payment.sessionCount}
                </TableCell>
                <TableCell
                  sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <TextField
                      value={editedValues[payment.id]?.sessionCost || ""}
                      onChange={(value) => handleValueChange(payment.id, "sessionCost", value)}
                      sx={{
                        "& .MuiInputBase-root": { height: "auto" },
                        width: "70px",
                      }}
                      type="number"
                      placeholder="0"
                    />
                    <Typography sx={{ color: "black" }}>bs.</Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <TextField
                      value={editedValues[payment.id]?.amountPaid || ""}
                      onChange={(value) => handleValueChange(payment.id, "amountPaid", value)}
                      sx={{
                        "& .MuiInputBase-root": { height: "auto" },
                        width: "70px",
                      }}
                      type="number"
                      placeholder="0"
                    />
                    <Typography sx={{ color: "black" }}>bs.</Typography>
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                >
                  {payment.pendingAmount} bs.
                </TableCell>
                <TableCell
                  sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                >
                  {payment.specialistAmount} bs.
                </TableCell>
                <TableCell
                  sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                >
                  {payment.institutionAmount} bs.
                </TableCell>
                <TableCell
                  sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                >
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: payment.status === "Completed" ? "#d4edda" : "#fff3cd",
                      color: payment.status === "Completed" ? "#155724" : "#856404",
                      borderRadius: "12px",
                      padding: "4px 8px",
                    }}
                  >
                    {payment.status === "Completed" ? "Completado" : "Pendiente"}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{ color: "black", padding: "16px 24px", textAlign: "center" }}
                >
                  {payment.totalAmount} bs.
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Box>
      </TableContainer>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => fetchData(page, `?PageNumber=${page}&PageSize=${pageSize}`)}
      />
    </Box>
  );
};

export default Payments;