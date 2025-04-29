/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { fetchSpecialistName } from "@/services/scheduleService";
import { useEditStore } from "@/stores/editStore";

export const useSpecialist = () => {
  const { entityId } = useEditStore();
  const [specialistName, setSpecialistName] = useState<string>("");

  useEffect(() => {
    const loadSpecialist = async () => {
      if (!entityId) return;
      try {
        const name = await fetchSpecialistName(entityId);
        setSpecialistName(name);
      } catch (error) {
      }
    };

    loadSpecialist();
  }, [entityId]);

  return { specialistName };
};