import { create } from "zustand";

interface NavigationStore {
  isNavigating: boolean;
  setNavigating: (isNavigating: boolean) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  isNavigating: false,
  setNavigating: (isNavigating: boolean) => set({ isNavigating }),
}));