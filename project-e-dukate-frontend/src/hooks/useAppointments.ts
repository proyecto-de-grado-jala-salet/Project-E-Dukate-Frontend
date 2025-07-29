/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useApi } from "./useApi";
import { AppointmentFilter, Appointment } from "@/types/appointment";
import { Specialist } from "@/types/userTypes";
import { Specialty } from "@/types/specialty";
import { Filter } from "@/types/filterOption";
import { useDebounce } from "./useDebounce";
import dayjs from "dayjs";
import "dayjs/locale/es";

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
  const [filters, setFilters] = useState<AppointmentFilter>({
    patientId: "",
    specialistId: "",
    specialtyId: "",
    date: dayjs().startOf("day").toDate(),
    status: "",
    patientSearch: "",
  });

  const debouncedPatientSearch = useDebounce(filters.patientSearch, 500);
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
  } = useApi<Appointment>("appointments");

  const reloadWithCurrentFilters = () => {
    fetchAppointmentsData(currentPage, buildQueryParams(currentPage));
  };

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.names} ${p.lastNamePaternal} ${p.lastNameMaternal ? p.lastNameMaternal : ""}`,
  }));

  const specialtyOptions = specialties.map((s) => ({
    value: s.id,
    label: s.typeOfSpecialty,
  }));

  const specialistOptions = specialists.map((s) => ({
    value: s.id,
    label: `${s.names} ${s.lastNamePaternal} ${s.lastNameMaternal ? s.lastNameMaternal : ""}`,
  }));

  const statusOptions = [
    { value: "Scheduled", label: "Programada" },
    { value: "Confirmed", label: "Confirmada" },
    { value: "Cancelled", label: "Cancelada" },
  ];

  const filterConfig: Filter[] = [
    {
      label: "Paciente",
      value: filters.patientId || "",
      onChange: (value: string) => setFilters((prev) => ({ ...prev, patientId: value })),
      options: [...patientOptions],
      type: "dropdown",
    },
    {
      label: "Especialista",
      value: filters.specialistId || '',
      onChange: (value: string) => setFilters(prev => ({ ...prev, specialistId: value })),
      options: [...specialistOptions],
      type: "dropdown"
    },
    {
      label: "Fecha",
      value: filters.date ? dayjs(filters.date).format("YYYY-MM-DD") : "",
      onChange: (value: string) => {
        setFilters((prev) => ({
          ...prev,
          date: value ? dayjs(value).startOf("day").toDate() : null,
        }));
      },
      type: "date",
    },
    {
      label: "Estado",
      value: filters.status || "",
      onChange: (value: string) => setFilters((prev) => ({ ...prev, status: value })),
      options: [...statusOptions],
      type: "dropdown",
    },
  ];

  const buildQueryParams = (page: number) => {
    const queryParams = new URLSearchParams();
    if (filters.patientId) queryParams.append("patientId", filters.patientId);
    if (filters.specialistId) queryParams.append("specialistId", filters.specialistId);
    if (filters.date) queryParams.append("date", dayjs(filters.date).format("YYYY-MM-DD"));
    if (filters.status) queryParams.append("status", filters.status);
    if (debouncedPatientSearch) queryParams.append("patientSearch", debouncedPatientSearch);
    queryParams.append("PageNumber", page.toString());
    queryParams.append("PageSize", pageSize.toString());
    return queryParams.toString();
  };

  useEffect(() => {
    fetchAppointmentsData(1, buildQueryParams(1));
  }, [
    filters.patientId,
    filters.specialistId,
    filters.date,
    filters.status,
    debouncedPatientSearch,
    fetchAppointmentsData,
    pageSize,
  ]);

  const handlePageChange = (page: number) => {
    fetchAppointmentsData(page, buildQueryParams(page));
  };

  const handleResetFilters = () => {
    setFilters({
      patientId: "",
      specialistId: "",
      specialtyId: "",
      date: dayjs().startOf("day").toDate(),
      status: "",
      patientSearch: "",
    });
  };

  const handlePatientSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, patientSearch: value }));
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
    handlePatientSearchChange,
    addAppointment,
    deleteAppointment,
    reloadWithCurrentFilters,
    fetchAppointmentsData,
    buildQueryParams,
  };
};