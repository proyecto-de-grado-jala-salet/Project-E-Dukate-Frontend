/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useEditStore } from "@/stores/editStore";
import { useAuthStore } from "@/stores/authStore";
import { MedicalHistoryDto } from "@/types/medicalHistory";
import { Patient, Specialist } from "@/types/userTypes";
import {
  getMedicalHistoryByPatientId,
  updatePermission,
  deletePermission,
  updateMedicalHistoryStatus,
  getSpecialistConsultations,
} from "@/services/medicalHistoryService";
import { apiRequest } from "@/services/api";
import { showNotification } from "@/services/notificationService";

interface Consultation {
  id: string;
  reason: string;
  consultationDate: string;
  notes: string;
  specialistId: string;
}

interface PaginatedConsultations {
  Items: Consultation[];
  TotalCount: number;
  PageNumber: number;
  PageSize: number;
  TotalPages: number;
}

interface UseMedicalHistoryReturn {
  medicalHistory: MedicalHistoryDto | null;
  patientData: Patient | null;
  specialists: Specialist[] | null;
  specialistsWithPermission: Specialist[];
  selectedSpecialists: string[];
  selectedStatus: string;
  selectedConsultationSpecialist: string;
  isStatusDropdownDisabled: boolean;
  canEditSelectedSpecialist: boolean;
  consultations: PaginatedConsultations | null;
  currentPage: number;
  loadingConsultations: boolean;
  errorConsultations: string | null;
  specialistsLoading: boolean;
  specialistsError: string | null;
  setSelectedSpecialists: (specialists: string[]) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedConsultationSpecialist: (specialistId: string) => void;
  setCurrentPage: (page: number) => void;
  handleAddConsultation: () => Promise<string | null>;
  refreshConsultations: () => void;
}

export const useMedicalHistory = (): UseMedicalHistoryReturn => {
  const router = useRouter();
  const { entityId: patientId, entityType } = useEditStore();
  const { userId } = useAuthStore();
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryDto | null>(null);
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [selectedSpecialists, setSelectedSpecialists] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedConsultationSpecialist, setSelectedConsultationSpecialist] = useState<string>("");
  const [isStatusDropdownDisabled, setIsStatusDropdownDisabled] = useState<boolean>(true);
  const [canEditSelectedSpecialist, setCanEditSelectedSpecialist] = useState<boolean>(false);
  const [consultations, setConsultations] = useState<PaginatedConsultations | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [errorConsultations, setErrorConsultations] = useState<string | null>(null);
  const pageSize = 10;
  const {
    data: specialists,
    loading: specialistsLoading,
    error: specialistsError,
  } = useApi<Specialist>("specialists");

  useEffect(() => {
    if (!patientId || entityType !== "patient") {
      showNotification("Invalid patient or entityType", "error");
      router.push("/dashboard/pacientes");
      return;
    }

    const fetchMedicalHistory = async () => {
      const history = await getMedicalHistoryByPatientId(patientId);
      if (history) {
        setMedicalHistory(history);
        const initialSpecialists = history.permissions
          .filter((p) => p.canEdit)
          .map((p) => p.specialistId);
        setSelectedSpecialists(initialSpecialists);
        setConsultations(null);
        setSelectedConsultationSpecialist("");
        setSelectedStatus("");
        setIsStatusDropdownDisabled(true);
        setCurrentPage(1);
      } else {
        setMedicalHistory(null);
        setConsultations(null);
        setSelectedConsultationSpecialist("");
        setSelectedStatus("");
        setIsStatusDropdownDisabled(true);
      }
    };

    const fetchPatientData = async () => {
      try {
        const patient = await apiRequest<Patient>(
          "patients",
          "GET",
          undefined,
          patientId
        );
        setPatientData(patient);
      } catch (error) {
        showNotification("Error fetching patient data", "error");
        router.push("/dashboard/pacientes");
      }
    };

    fetchMedicalHistory();
    fetchPatientData();
  }, [patientId, entityType, router]);

  const specialistsWithPermission =
    specialists?.filter((specialist) =>
      medicalHistory?.permissions.some(
        (permission) =>
          permission.specialistId === specialist.id && permission.canEdit
      )
    ) || [];

  const fetchConsultations = async () => {
    if (!selectedConsultationSpecialist || !medicalHistory) {
      setConsultations(null);
      setSelectedStatus("");
      setIsStatusDropdownDisabled(true);
      setCanEditSelectedSpecialist(false);
      setErrorConsultations(null);
      setCurrentPage(1);
      return;
    }

    setLoadingConsultations(true);
    setErrorConsultations(null);
    setConsultations(null);

    const permission = medicalHistory.permissions.find(
      (p) => p.specialistId === selectedConsultationSpecialist && p.canEdit
    );
    if (!permission) {
      setConsultations(null);
      setSelectedStatus("");
      setIsStatusDropdownDisabled(true);
      setCanEditSelectedSpecialist(false);
      setErrorConsultations(
        "No se encontraron permisos válidos para este especialista"
      );
      setLoadingConsultations(false);
      return;
    }

    const canEdit = userId === selectedConsultationSpecialist && permission.canEdit;
    setCanEditSelectedSpecialist(canEdit);
    setSelectedStatus(permission.status);
    setIsStatusDropdownDisabled(false);

    const response = await getSpecialistConsultations(
      medicalHistory.id,
      selectedConsultationSpecialist,
      permission.id,
      currentPage,
      pageSize
    );
    if (!response) {
      setErrorConsultations("No se pudieron cargar las consultas");
      setConsultations(null);
    } else {
      setConsultations(response);
    }
    setLoadingConsultations(false);
  };

  useEffect(() => {
    fetchConsultations();
  }, [selectedConsultationSpecialist, medicalHistory, currentPage, patientId]);

  const refreshConsultations = () => {
    fetchConsultations();
  };

  const handleAddConsultation = async (): Promise<string | null> => {
    if (!medicalHistory || !selectedConsultationSpecialist || !userId) {
      showNotification("No se puede añadir la consulta", "error");
      return null;
    }

    const permission = medicalHistory.permissions.find(
      (p) => p.specialistId === selectedConsultationSpecialist && p.canEdit
    );
    if (!permission) {
      showNotification("No tienes permisos para añadir consultas", "error");
      return null;
    }

    try {
      const response = await apiRequest<{ id: string }>(
        "medicalconsultations",
        "POST",
        {
          reason: "Nueva consulta",
          consultationDate: new Date().toISOString(),
          notes: "",
        },
        `histories/${medicalHistory.id}/specialists/${selectedConsultationSpecialist}/permissions/${permission.id}/consultation`
      );

      await refreshConsultations();
      return response.id;
    } catch (error) {
      showNotification("Error al añadir la consulta", "error");
      return null;
    }
  };

  const handleSpecialistChange = async (newSpecialists: string[]) => {
    if (!medicalHistory || !patientId) return;

    const addedSpecialists = newSpecialists.filter(
      (s) => !selectedSpecialists.includes(s)
    );
    const removedSpecialists = selectedSpecialists.filter(
      (s) => !newSpecialists.includes(s)
    );

    for (const specialistId of addedSpecialists) {
      await updatePermission({
        medicalHistoryId: medicalHistory.id,
        specialistId,
        canEdit: true,
      });
    }

    for (const specialistId of removedSpecialists) {
      const permission = medicalHistory.permissions.find(
        (p) => p.specialistId === specialistId
      );
      if (permission) {
        await deletePermission(permission.id);
      }
    }

    const updatedHistory = await getMedicalHistoryByPatientId(patientId);
    if (updatedHistory) {
      setMedicalHistory(updatedHistory);
    }

    setSelectedSpecialists(newSpecialists);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!medicalHistory || !patientId || !selectedConsultationSpecialist) {
      showNotification("Cannot update status", "error");
      return;
    }

    await updateMedicalHistoryStatus(
      medicalHistory.id,
      selectedConsultationSpecialist,
      newStatus
    );
    setSelectedStatus(newStatus);

    const updatedHistory = await getMedicalHistoryByPatientId(patientId);
    if (updatedHistory) {
      setMedicalHistory(updatedHistory);
    }
  };

  return {
    medicalHistory,
    patientData,
    specialists,
    specialistsWithPermission,
    selectedSpecialists,
    selectedStatus,
    selectedConsultationSpecialist,
    isStatusDropdownDisabled,
    canEditSelectedSpecialist,
    consultations,
    currentPage,
    loadingConsultations,
    errorConsultations,
    specialistsLoading,
    specialistsError,
    setSelectedSpecialists: handleSpecialistChange,
    setSelectedStatus: handleStatusChange,
    setSelectedConsultationSpecialist,
    setCurrentPage,
    handleAddConsultation,
    refreshConsultations,
  };
};
