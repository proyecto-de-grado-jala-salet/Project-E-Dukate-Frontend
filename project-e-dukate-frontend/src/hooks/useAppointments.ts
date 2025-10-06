/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { AppointmentFilter, Appointment } from "@/types/appointment";
import { Specialist } from "@/types/userTypes";
import { Specialty } from "@/types/specialty";
import { Filter } from "@/types/filterOption";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useAuthStore } from "@/stores/authStore";

interface Patient {
  id: string;
  names: string;
  lastNamePaternal: string;
  lastNameMaternal: string;
  mobileNumber: string;
  identityCard: number;
  age: number;
}

export const useAppointments = () => {
  const initialDate = dayjs().startOf("day").toDate();
  const { userRole, userId } = useAuthStore();
  const isAdmin = userRole === "Administrator";
  const [filters, setFilters] = useState<AppointmentFilter>({
    patientId: "",
    specialistId: "",
    specialtyId: "",
    date: initialDate,
    status: "",
  });

  const { data: patients } = useApi<Patient>("patients");
  const { data: specialties } = useApi<Specialty>("specialties");
  const { data: specialists } = useApi<Specialist>("specialists");

  const {
    data: appointments,
    error,
    totalPages,
    currentPage,
    pageSize,
    loading,
    fetchData: fetchAppointmentsData,
    addItem: addAppointment,
    deleteItem: deleteAppointment,
  } = useApi<Appointment>("appointments", { useSearchEndpoint: false });

  const reloadWithCurrentFilters = () => {
    fetchAppointmentsData(currentPage, buildQueryParams());
  };

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.names} ${p.lastNamePaternal} ${p.lastNameMaternal ? p.lastNameMaternal : ""}`,
  }));

  const specialtyOptions = specialties.map((s) => ({
    value: s.id,
    label: s.typeOfSpecialty,
  }));

  const specialistOptions = isAdmin 
    ? specialists.map((s) => ({
        value: s.id,
        label: `${s.names} ${s.lastNamePaternal} ${s.lastNameMaternal ? s.lastNameMaternal : ""}`,
      }))
    : [
        { value: userId || "", label: "Mi perfil" },
      ];

  const statusOptions = [
    { value: "Scheduled", label: "Programada" },
    { value: "Confirmed", label: "Confirmada" },
    { value: "Cancelled", label: "Cancelada" },
    { value: "Rescheduled", label: "Reprogramada" },
  ];

  const filterConfig: Filter[] = [
    {
      label: "Paciente",
      value: filters.patientId || "",
      onChange: (value: string) => setFilters((prev) => ({ ...prev, patientId: value })),
      options: [...patientOptions],
      type: "dropdown" as const,
    },
    ...(isAdmin ? [{
      label: "Especialista",
      value: filters.specialistId || '',
      onChange: (value: string) => setFilters(prev => ({ ...prev, specialistId: value })),
      options: [...specialistOptions],
      type: "dropdown" as const
    }] : []),
    {
      label: "Fecha",
      value: filters.date ? dayjs(filters.date).format("YYYY-MM-DD") : "",
      onChange: (value: string) => {
        setFilters((prev) => ({
          ...prev,
          date: value ? dayjs(value).startOf("day").toDate() : null,
        }));
      },
      type: "date" as const,
    },
    {
      label: "Estado",
      value: filters.status || "",
      onChange: (value: string) => setFilters((prev) => ({ ...prev, status: value })),
      options: [...statusOptions],
      type: "dropdown" as const,
    },
  ];

  const buildQueryParams = () => {
    const queryParams = new URLSearchParams();
    if (filters.patientId) queryParams.append("patientId", filters.patientId);
    if (!isAdmin && userId) {
      queryParams.append("specialistId", userId);
    } else if (filters.specialistId) {
      queryParams.append("specialistId", filters.specialistId);
    }
    
    if (filters.specialtyId) queryParams.append("specialtyId", filters.specialtyId);
    if (filters.date) {
      const dateStr = dayjs(filters.date).format("YYYY-MM-DD");
      queryParams.append("date", dateStr);
    }
    if (filters.status) queryParams.append("status", filters.status);
    return queryParams.toString();
  };

  const fetchAppointmentsWithFilters = async (page: number = 1) => {
    const queryParams = buildQueryParams();
    await fetchAppointmentsData(page, queryParams);
  };

  useEffect(() => {
    fetchAppointmentsWithFilters(1);
  }, [
    filters.patientId,
    filters.specialistId,
    filters.specialtyId,
    filters.date,
    filters.status,
    pageSize,
    isAdmin,
    userId,
  ]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAppointmentsWithFilters(currentPage);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentPage, buildQueryParams]);

  const handlePageChange = (page: number) => {
    fetchAppointmentsWithFilters(page);
  };

  const handleResetFilters = () => {
    const newDate = dayjs().startOf("day").toDate();
    setFilters({
      patientId: "",
      specialistId: "",
      specialtyId: "",
      date: newDate,
      status: "",
    });
  };

  return {
    filters,
    appointments,
    error,
    totalPages,
    currentPage,
    pageSize,
    loading,
    patientOptions,
    specialtyOptions,
    specialistOptions,
    statusOptions,
    filterConfig,
    handlePageChange,
    handleResetFilters,
    addAppointment,
    deleteAppointment,
    reloadWithCurrentFilters,
    fetchAppointmentsData: fetchAppointmentsWithFilters,
    buildQueryParams,
    isAdmin,
  };
};