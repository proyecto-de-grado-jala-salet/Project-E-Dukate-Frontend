/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { useDebounce } from "./useDebounce";
import { apiRequest } from "../services/api";
import { showNotification } from "../services/notificationService";
import { Payment } from "../types/payments";
import { Specialist, Patient } from "../types/userTypes";

export const usePayments = () => {
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
          label: `${spec.names} ${spec.lastNamePaternal} ${spec.lastNameMaternal || ""}`.trim(),
        })),
      ]
    : [{ value: "", label: "Especialistas" }];

  const patients = patientsData
    ? patientsData.map((patient) => ({
        value: patient.id,
        label: `${patient.names} ${patient.lastNamePaternal} ${patient.lastNameMaternal || ""}`.trim(),
      }))
    : [];

  const statuses = [
    { value: "Pending", label: "Pendiente" },
    { value: "Completed", label: "Completado" },
  ];

  const debouncedEditedValues = useDebounce(editedValues, 500);

  useEffect(() => {
    if (payments && payments.length > 0) {
      const initialValues = payments.reduce(
        (acc, payment) => ({
          ...acc,
          [payment.id]: {
            sessionCost: payment.sessionCost.toString(),
            amountPaid: payment.amountPaid.toString(),
          },
        }),
        {} as { [key: string]: { sessionCost: string; amountPaid: string } }
      );
      setEditedValues(initialValues);
    } else {
      setEditedValues({});
    }
  }, [payments]);

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
        showNotification("Error al actualizar el pago", "error");
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

  const buildQueryParams = (page: number = 1) => {
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

  const fetchDataWithCurrentFilters = (page: number = 1) => {
    const queryString = buildQueryParams(page);
    fetchData(page, `?${queryString}`);
  };

  useEffect(() => {
    fetchDataWithCurrentFilters(1);
  }, [specialistId, year, month, day, status]);

  const handleValueChange = (
    id: string,
    field: "sessionCost" | "amountPaid",
    value: string
  ) => {
    setEditedValues((prev) => ({
      ...prev,
      [id]: {
        ...prev[id] || { sessionCost: "", amountPaid: "" },
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

  return {
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
    pageSize,
    loading: loading || specialistsLoading || patientsLoading,
    error: error || specialistsError || patientsError,
    specialists,
    patients,
    statuses,
    fetchDataWithCurrentFilters,
    handleValueChange,
    handleResetFilter,
    editedValues,
  };
};