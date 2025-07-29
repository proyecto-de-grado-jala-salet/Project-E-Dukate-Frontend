/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { useEditStore } from "@/stores/editStore";
import { useAuthStore } from "@/stores/authStore";
import { MedicalHistoryDto } from "@/types/medicalHistory";
import { Patient } from "@/types/userTypes";
import { Specialist } from "@/types/userTypes";
import { getMedicalHistoryByPatientId, getSpecialistConsultations, uploadDocument, deleteDocument, updatePermission, deletePermission, updateMedicalHistoryStatus } from "@/services/medicalHistoryService";
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
  loadingDocuments: boolean;
  setSelectedSpecialists: (specialists: string[]) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedConsultationSpecialist: (specialistId: string) => void;
  setCurrentPage: (page: number) => void;
  handleAddConsultation: () => Promise<string | null>;
  handleUploadDocument: (file: File) => Promise<void>;
  handleDeleteDocument: (documentId: string) => Promise<void>;
  refreshConsultations: () => void;
  refreshDocuments: () => void;
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
  const [loadingDocuments, setLoadingDocuments] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const pageSize = 10;
  const {
    data: specialists,
    loading: specialistsLoading,
    error: specialistsError,
  } = useApi<Specialist>("specialists");

  const specialistsWithPermission =
    specialists?.filter((specialist) =>
      medicalHistory?.permissions.some(
        (permission) =>
          permission.specialistId === specialist.id && permission.canEdit
      )
    ) || [];

  useEffect(() => {
    if (!patientId || entityType !== "patient") {
      showNotification("Paciente o tipo de entidad inválido", "error");
      router.push("/dashboard/pacientes");
      return;
    }

    const fetchMedicalHistory = async () => {
      setLoadingDocuments(true);
      try {
        const history = await getMedicalHistoryByPatientId(patientId);
        if (history) {
          setMedicalHistory(history);
          const initialSpecialists = history.permissions
            .filter((p) => p.canEdit)
            .map((p) => p.specialistId);
          setSelectedSpecialists(initialSpecialists);
          const userPermission = history.permissions.find(
            (p) => p.specialistId === userId && p.canEdit
          );
          const firstSpecialist =
            userPermission?.specialistId ||
            history.permissions.find((p) => p.canEdit)?.specialistId ||
            "";
          setSelectedConsultationSpecialist(firstSpecialist);
          setConsultations(null);
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
      } catch (error) {
        showNotification("Error al cargar el historial médico", "error");
      } finally {
        setLoadingDocuments(false);
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
        showNotification("Error al cargar los datos del paciente", "error");
        router.push("/dashboard/pacientes");
      }
    };

    fetchMedicalHistory();
    fetchPatientData();
  }, [patientId, entityType, router, userId]);

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
      setErrorConsultations("No se encontraron permisos válidos para este especialista");
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

  

  const refreshDocuments = async () => {
    if (!patientId) {
      showNotification(
        "No se puede refrescar los documentos: paciente no encontrado",
        "error"
      );
      return;
    }
    setLoadingDocuments(true);
    try {
      const updatedHistory = await getMedicalHistoryByPatientId(patientId);
      if (updatedHistory) {
        setMedicalHistory(updatedHistory);
        setForceUpdate((prev) => prev + 1);
      } else {
        showNotification("No se encontraron datos del historial médico", "error");
      }
    } catch (error) {
      showNotification("Error al refrescar documentos", "error");
    } finally {
      setLoadingDocuments(false);
    }
  };

  useEffect(() => {
  fetchConsultations();
}, [selectedConsultationSpecialist, medicalHistory, currentPage, patientId, forceUpdate]);

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

  const handleUploadDocument = async (file: File): Promise<void> => {
    if (!medicalHistory || !selectedConsultationSpecialist || !userId) {
      showNotification(
        `No se puede subir el documento: ${
          !medicalHistory
            ? "Historial médico no encontrado"
            : !selectedConsultationSpecialist
              ? "Selecciona un especialista"
              : "Usuario no autenticado"
        }`,
        "error"
      );
      return;
    }

    const permission = medicalHistory.permissions.find((p) => {
      return p.specialistId === selectedConsultationSpecialist;
    });
    if (!permission) {
      showNotification("No tienes permisos para subir documentos", "error");
      return;
    }

    if (permission.specialistId !== userId) {
      showNotification(
        "No tienes permisos para subir documentos para este especialista",
        "error"
      );
      return;
    }
    if (!permission.canEdit) {
      showNotification("No tienes permisos de edición para este especialista", "error");
      return;
    }
    try {
      const result = await uploadDocument(permission.id, file);
      if (result) {
        await refreshDocuments();
      }
    } catch (error) {
      showNotification("Error al subir el documento", "error");
    }
  };

  const handleDeleteDocument = async (documentId: string): Promise<void> => {
    try {
      const success = await deleteDocument(documentId);
      if (success) {
        await refreshDocuments();
      }
    } catch (error) {
      showNotification("Error al eliminar el documento", "error");
    }
  };

  const handleSpecialistChange = async (newSpecialists: string[]) => {
    if (!medicalHistory || !patientId) return;

    try {
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

      await refreshDocuments();
      setSelectedSpecialists(newSpecialists);
    } catch (error) {
      showNotification("Error al cambiar especialistas", "error");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!medicalHistory || !patientId || !selectedConsultationSpecialist) {
      showNotification("No se puede actualizar el estado", "error");
      return;
    }

    try {
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
      await refreshDocuments();
    } catch (error) {
      showNotification("Error al cambiar el estado", "error");
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
    loadingDocuments,
    setSelectedSpecialists: handleSpecialistChange,
    setSelectedStatus: handleStatusChange,
    setSelectedConsultationSpecialist,
    setCurrentPage,
    handleAddConsultation,
    handleUploadDocument,
    handleDeleteDocument,
    refreshConsultations,
    refreshDocuments,
  };
};