import { useState } from "react";
import { useEffect } from "react";
import { useApi } from "./useApi";
import { AppointmentFilter } from "@/types/appointment";
import { Appointment } from "@/types/appointment";
import { Specialist } from '@/types/userTypes';
import { Filter } from "@/types/filterOption";
import { useDebounce } from "./useDebounce";

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
    date: new Date(),
    status: "",
    patientSearch: "",
  });

  const debouncedPatientSearch = useDebounce(filters.patientSearch, 500);
  const { data: patients } = useApi<Patient>("patients");
  const { data: specialists } = useApi<Specialist>("specialists");

  const {
    data: appointments,
    error,
    totalPages,
    currentPage,
    pageSize,
    loading,
    fetchData: fetchAppointments,
    addItem: addAppointment,
    deleteItem: deleteAppointment,
  } = useApi<Appointment>("appointments");

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.names} ${p.lastNamePaternal} ${p.lastNameMaternal ? p.lastNameMaternal : ""}`
  }));

  const specialistOptions = specialists.map(s => ({
    value: s.id,
    label: `${s.names} ${s.lastNamePaternal} ${s.lastNameMaternal ? s.lastNameMaternal : ""}`
  }));

  const statusOptions = [
    { value: "Scheduled", label: "Programada" },
    { value: "Confirmed", label: "Confirmada" },
    { value: "Cancelled", label: "Cancelada" },
  ];

  const filterConfig: Filter[] = [
    {
      label: "Paciente",
      value: filters.patientId || '',
      onChange: (value: string) => setFilters(prev => ({ ...prev, patientId: value })),
      options: [...patientOptions],
      type: "dropdown"
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
      value: filters.date ? filters.date.toISOString().split('T')[0] : "",
      onChange: (value: string) => setFilters(prev => ({ ...prev, date: value ? new Date(value) : null })),
      type: "date"
    },
    {
      label: "Estado",
      value: filters.status || '',
      onChange: (value: string) => setFilters(prev => ({ ...prev, status: value })),
      options: [...statusOptions],
      type: "dropdown"
    }
  ];

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (filters.patientId) queryParams.append("patientId", filters.patientId);
    if (filters.specialistId)
      queryParams.append("specialistId", filters.specialistId);
    if (filters.date)
      queryParams.append("date", filters.date.toISOString().split("T")[0]);
    if (filters.status) queryParams.append("status", filters.status);
    if (debouncedPatientSearch)
      queryParams.append("patientSearch", debouncedPatientSearch);
    
    queryParams.append("PageNumber", "1");
    queryParams.append("PageSize", pageSize.toString());
    
    fetchAppointments(1, queryParams.toString());
  }, [filters.patientId, filters.specialistId, filters.date, filters.status, debouncedPatientSearch, fetchAppointments, pageSize]);

  const handlePageChange = (page: number) => {
    const queryParams = new URLSearchParams();
    
    if (filters.patientId) queryParams.append("patientId", filters.patientId);
    if (filters.specialistId) queryParams.append("specialistId", filters.specialistId);
    if (filters.date) queryParams.append("date", filters.date.toISOString().split("T")[0]);
    if (filters.status) queryParams.append("status", filters.status);
    if (debouncedPatientSearch) queryParams.append("patientSearch", debouncedPatientSearch);
    
    queryParams.append("PageNumber", page.toString());
    queryParams.append("PageSize", pageSize.toString());
    
    fetchAppointments(page, queryParams.toString());
  };

  const handleResetFilters = () => {
    setFilters({
      patientId: "",
      specialistId: "",
      date: new Date(),
      status: "",
      patientSearch: "",
    });
  };

  const handlePatientSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, patientSearch: value }));
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
    specialistOptions,
    statusOptions,
    filterConfig,
    handlePageChange,
    handleResetFilters,
    handlePatientSearchChange,
    addAppointment,
    deleteAppointment
  };
};