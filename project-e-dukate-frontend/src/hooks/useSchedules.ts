import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchSchedules, updateSchedules } from "@/services/scheduleService";
import { mapBackendSchedules, initializeSchedules } from "@/utils/scheduleUtils";
import { ScheduleDto } from "@/types/schedule";
import { useEditStore } from "@/stores/editStore";

export const useSchedules = () => {
  const router = useRouter();
  const { entityId } = useEditStore();
  const [schedules, setSchedules] = useState<ScheduleDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadSchedules = async () => {
      if (!entityId) return;
      setLoading(true);
      try {
        const backendSchedules = await fetchSchedules(entityId);
        const mappedSchedules = mapBackendSchedules(backendSchedules);
        const initializedSchedules = initializeSchedules(mappedSchedules);
        setSchedules(initializedSchedules);
      } catch (error) {
        console.error('Error fetching Schedules details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, [entityId]);

  const handleSubmit = async () => {
    if (!entityId) return;
    try {
      await updateSchedules(entityId, schedules);
      router.push("/dashboard/horarios");
    } catch (error) {
      console.error('Error submit details:', error);
    }
  };

  return {
    schedules,
    setSchedules,
    loading,
    handleSubmit,
  };
};