import { create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  [key: string]: string | number; // Permitir claves dinámicas
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  exp: number;
}

interface AuthState {
  token: string | null;
  userRole: string | null;
  userName: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
}

type AuthPersist = PersistOptions<AuthState>;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userRole: null,
      userName: null,
      setAuth: (token: string) => {
        const decoded = jwtDecode<DecodedToken>(token);
        set({
          token,
          userRole: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Unknown',
          userName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Usuario',
        });
      },
      clearAuth: () => {
        set({ token: null, userRole: null, userName: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    } as AuthPersist
  )
);