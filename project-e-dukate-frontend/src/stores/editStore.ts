import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";

interface EditStore {
  entityId: string | null;
  entityRole: string | null;
  entityType: "user" | "patient" | null;
  setEditData: (id: string, role: string, type: "user" | "patient") => void;
  clearEditData: () => void;
}

type EditStorePersist = PersistOptions<EditStore>;

export const useEditStore = create<EditStore>()(
  persist(
    (set) => ({
      entityId: null,
      entityRole: null,
      entityType: null,
      setEditData: (id: string, role: string, type: "user" | "patient") =>
        set({ entityId: id, entityRole: role, entityType: type }),
      clearEditData: () =>
        set({ entityId: null, entityRole: null, entityType: null }),
    }),
    {
      name: "edit-storage",
      storage: createJSONStorage(() => sessionStorage),
    } as EditStorePersist
  )
);
