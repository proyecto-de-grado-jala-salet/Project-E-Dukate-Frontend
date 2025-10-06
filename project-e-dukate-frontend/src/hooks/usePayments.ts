/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from "react";
import { useApi } from "./useApi";
import { useDebounce } from "./useDebounce";
import { apiRequest } from "@/services/api";
import { showNotification } from "@/services/notificationService";
import { Payment } from "@/types/payments";
import { Specialist } from "@/types/userTypes";
import { Patient } from "@/types/userTypes";
import { useAuthStore } from "@/stores/authStore";

interface QRResponse {
  QRId?: string;
  Message?: string;
}

export const usePayments = () => {
  const [specialistId, setSpecialistId] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [status, setStatus] = useState("");
  const [editedValues, setEditedValues] = useState<{
    [key: string]: { sessionCost: string; amountPaid: string };
  }>({});
  const [qrExists, setQrExists] = useState<boolean>(false);
  const { userRole, userId } = useAuthStore();
  const isAdmin = userRole === 'Administrator';

  const {
    data: payments,
    totalPages,
    currentPage,
    pageSize,
    loading,
    error,
    fetchData,
  } = useApi<Payment>("paymentsFilter", { useSearchEndpoint: false });

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

  const specialists = isAdmin 
    ? [
        { value: "", label: "Especialistas" },
        ...(specialistsData?.map((spec) => ({
          value: spec.id,
          label: `${spec.names} ${spec.lastNamePaternal} ${spec.lastNameMaternal || ""}`.trim(),
        })) || []),
      ]
    : [
        { value: userId || "", label: "Mi perfil" },
      ];

  const patients = patientsData
    ? patientsData.map((patient) => ({
        value: patient.id,
        label: `${patient.names} ${patient.lastNamePaternal} ${patient.lastNameMaternal || ""}`.trim(),
      }))
    : [];

  const statuses = [
    { value: "", label: "Estados" },
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
        if (!isAdmin) {
          showNotification("No tiene permisos para editar pagos", "error");
          return;
        }

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
  }, [debouncedEditedValues, payments, isAdmin]);

  const buildQueryParams = (page: number = 1) => {
    const params = new URLSearchParams({
      PageNumber: page.toString(),
      PageSize: pageSize.toString(),
    });

    if (!isAdmin && userId) {
      params.append("SpecialistId", userId);
    } else if (specialistId) {
      params.append("SpecialistId", specialistId);
    }

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
  }, [specialistId, year, month, day, status, isAdmin, userId]);

  const handleValueChange = (
    id: string,
    field: "sessionCost" | "amountPaid",
    value: string
  ) => {
    if (!isAdmin) {
      showNotification("No tiene permisos para editar pagos", "error");
      return;
    }

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
    fetchDataWithCurrentFilters(1);
  };

  const checkQRExists = useCallback(async () => {
    try {
      await apiRequest("paymentQRs", "GET");
      setQrExists(true);
    } catch (err) {
      setQrExists(false);
    }
  }, []);

  useEffect(() => {
    checkQRExists();
  }, [checkQRExists]);

  const uploadQR = useCallback(async (file: File) => {
    try {
      if (!isAdmin) {
        showNotification("No tiene permisos para realizar esta acción", "error");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      const response = await apiRequest<QRResponse>("paymentQRs", "POST", formData);
      showNotification(response.Message || "QR subido exitosamente", "success");
      setQrExists(true);
      return response;
    } catch (err) {
      showNotification("Error al subir el QR", "error");
      throw err;
    }
  }, [isAdmin]);

  const updateQR = useCallback(async (file: File) => {
    try {
      if (!isAdmin) {
        showNotification("No tiene permisos para realizar esta acción", "error");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      await apiRequest<QRResponse>("paymentQRs", "PUT", formData);
      showNotification("QR actualizado exitosamente", "success");
      return { success: true };
    } catch (err) {
      showNotification("Error al actualizar el QR", "error");
      throw err;
    }
  }, [isAdmin]);

  const deleteQR = useCallback(async () => {
    try {
      if (!isAdmin) {
        showNotification("No tiene permisos para realizar esta acción", "error");
        return;
      }

      await apiRequest("paymentQRs", "DELETE");
      showNotification("QR eliminado exitosamente", "success");
      setQrExists(false);
      return { success: true };
    } catch (err) {
      showNotification("Error al eliminar el QR", "error");
      throw err;
    }
  }, [isAdmin]);

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
    qrExists,
    uploadQR,
    updateQR,
    deleteQR,
    isAdmin,
  };
};