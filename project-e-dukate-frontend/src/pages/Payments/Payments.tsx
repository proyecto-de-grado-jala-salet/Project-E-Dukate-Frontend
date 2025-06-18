/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  Paper,
  TableContainer,
  Table,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Button } from "../../components/Button";
import { TextField } from "../../components/TextField";
import { Pagination } from "../../components/Pagination";
import { useApi } from "../../hooks/useApi";
import { useDebounce } from "../../hooks/useDebounce";
import { GenericItem } from "../../types/table";
import { apiRequest } from "../../services/api";
import { showNotification } from "../../services/notificationService";
import { HiOutlineFilter } from "react-icons/hi";
import { FilterButton } from "./FilterButton";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";

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
    ? [
        { value: "", label: "Especialistas" },
        ...specialistsData.map((spec) => ({
          value: spec.id,
          label:
            `${spec.names} ${spec.lastNamePaternal} ${spec.lastNameMaternal || ""}`.trim(),
        })),
      ]
    : [{ value: "", label: "Especialistas" }];

  const patients = patientsData
    ? patientsData.map((patient) => ({
        value: patient.id,
        label:
          `${patient.names} ${patient.lastNamePaternal} ${patient.lastNameMaternal || ""}`.trim(),
      }))
    : [];

  const statuses = [
    { value: "Pending", label: "Pendiente" },
    { value: "Completed", label: "Completado" },
  ];

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.value === patientId);
    return patient ? patient.label : patientId;
  };

  useEffect(() => {
    if (payments) {
      const initialValues = payments.reduce(
        (acc, payment) => ({
          ...acc,
          [payment.id]: {
            sessionCost: payment.sessionCost.toString(),
            amountPaid: payment.amountPaid.toString(),
          },
        }),
        {}
      );
      setEditedValues(initialValues);
    }
  }, [payments]);

  const debouncedEditedValues = useDebounce(editedValues, 500);

  useEffect(() => {
    const updatePayment = async (
      id: string,
      sessionCost: string,
      amountPaid: string
    ) => {
      try {
        const sessionCostNum = parseFloat(sessionCost);
        const amountPaidNum = parseFloat(amountPaid);
        if (isNaN(sessionCostNum) || isNaN(amountPaidNum)) {
          throw new Error("Valores inválidos");
        }

        await apiRequest(
          "payments",
          "PUT",
          {
            sessionCost: sessionCostNum,
            amountPaid: amountPaidNum,
          },
          id
        );

        fetchDataWithCurrentFilters();
      } catch (err) {
        const errorMessage = "Error al actualizar el pago";

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
  }, [debouncedEditedValues, payments]);

  const buildQueryParams = (page: number = currentPage) => {
    const params = new URLSearchParams({
      PageNumber: page.toString(),
      PageSize: pageSize.toString(),
    });

    if (specialistId) params.append("SpecialistId", specialistId);
    if (year) params.append("Year", year);
    if (month) params.append("Month", month);
    if (day) params.append("Day", day);
    if (status) params.append("Status", status);

    return params.toString();
  };

  const fetchDataWithCurrentFilters = (page: number = currentPage) => {
    const queryString = buildQueryParams(page);
    fetchData(page, `?${queryString}`);
  };

  useEffect(() => {
    fetchDataWithCurrentFilters();
  }, [specialistId, year, month, day, status, currentPage, pageSize]);

  const handleValueChange = (
    id: string,
    field: "sessionCost" | "amountPaid",
    value: string
  ) => {
    setEditedValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

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
    return (
      <Typography variant="h6" color="error">
        {error || specialistsError || patientsError}
      </Typography>
    );

  return (
    <Box sx={{ p: 3, bgcolor: "#EDEDED", height: "100%" }}>
      <Typography
        variant="h4"
        sx={{ mb: 2, fontWeight: "bold", color: "black" }}
      >
        Pagos
      </Typography>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          bgcolor: "#fff",
          p: 0.5,
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          width: "56%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1,
            py: 0.5,
            borderRight: "1px solid #e0e0e0",
          }}
        >
          <HiOutlineFilter size={20} color="#000" />
          <Typography
            variant="body2"
            sx={{ ml: 2.5, color: "#000", fontWeight: 500 }}
          >
            Filtrar por
          </Typography>
        </Box>

        <FilterButton
          label="Especialista"
          value={specialistId}
          onChange={setSpecialistId}
          options={specialists}
          type="dropdown"
        />

        <FilterButton
          label="Años"
          value={year}
          onChange={setYear}
          type="year"
        />

        <FilterButton
          label="Meses"
          value={month}
          onChange={setMonth}
          type="month"
        />

        <FilterButton
          label="Día"
          value={day}
          onChange={setDay}
          options={[
            { value: "", label: "Días" },
            ...Array.from({ length: 31 }, (_, i) => ({
              value: (i + 1).toString().padStart(2, "0"),
              label: (i + 1).toString().padStart(2, "0"),
            })),
          ]}
          type="dropdown"
        />

        <FilterButton
          label="Estado"
          value={status}
          onChange={setStatus}
          options={statuses}
          type="dropdown"
        />

        <Box
          sx={{
            px: 0.5,
            py: 0.5,
            borderLeft: "1px solid #e0e0e0",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ReplayOutlinedIcon fontSize="small" />}
            sx={{
              borderRadius: "8px",
              minWidth: "100px",
              height: "32px",
              fontSize: "14px",
              textTransform: "none",
              borderColor: "transparent",
              color: "red",
            }}
            onClick={handleResetFilter}
            label={"Restablecer filtro"}
          ></Button>
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
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
            {payments && payments.length > 0 ? (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "6px",
                      textAlign: "center",
                    }}
                  >
                    {getPatientName(payment.patientId)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    {formatDate(payment.firstPaymentDate)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    {formatDate(payment.lastPaymentDate)}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    {payment.sessionCount}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <TextField
                        value={editedValues[payment.id]?.sessionCost || ""}
                        onChange={(value) =>
                          handleValueChange(payment.id, "sessionCost", value)
                        }
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
                    sx={{
                      color: "black",
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <TextField
                        value={editedValues[payment.id]?.amountPaid || ""}
                        onChange={(value) =>
                          handleValueChange(payment.id, "amountPaid", value)
                        }
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
                    sx={{
                      color: "black",
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    {payment.pendingAmount} bs.
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    {payment.specialistAmount} bs.
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    {payment.institutionAmount} bs.
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor:
                          payment.status === "Completed"
                            ? "#d4edda"
                            : "#fff3cd",
                        color:
                          payment.status === "Completed"
                            ? "#155724"
                            : "#856404",
                        borderRadius: "12px",
                        padding: "4px 8px",
                      }}
                    >
                      {payment.status === "Completed"
                        ? "Completado"
                        : "Pendiente"}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "black",
                      padding: "16px 24px",
                      textAlign: "center",
                    }}
                  >
                    {payment.totalAmount} bs.
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
                  sx={{
                    color: "black",
                    padding: "32px 24px",
                    textAlign: "center",
                    fontSize: "1.1rem",
                    fontWeight: "medium",
                  }}
                >
                  No se encontraron elementos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
