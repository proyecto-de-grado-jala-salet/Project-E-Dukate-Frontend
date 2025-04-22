import { create } from 'zustand';

interface UserEditStore {
  userId: string | null;
  userRole: string | null;
  setUserEditData: (id: string, role: string) => void;
  clearUserEditData: () => void;
}

export const useUserEditStore = create<UserEditStore>((set) => ({
  userId: null,
  userRole: null,
  setUserEditData: (id: string, role: string) => set({ userId: id, userRole: role }),
  clearUserEditData: () => set({ userId: null, userRole: null }),
}));