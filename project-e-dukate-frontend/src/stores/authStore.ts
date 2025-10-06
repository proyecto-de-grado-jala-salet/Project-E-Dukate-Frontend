import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import { PersistOptions } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

interface DecodedToken {
  sub: string;
  [key: string]: string | number;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
  exp: number;
}

interface AuthState {
  token: string | null;
  userRole: string | null;
  userName: string | null;
  userId: string | null;
  setAuth: (token: string) => void;
  clearAuth: () => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

type AuthPersist = PersistOptions<AuthState>;

const safeJwtDecode = (token: string) => {
  if (typeof window === 'undefined') return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userRole: null,
      userName: null,
      userId: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setAuth: (token: string) => {
        const decoded = safeJwtDecode(token);
        if (!decoded) return;
        
        set({
          token,
          userRole: decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Unknown',
          userName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Usuario',
          userId: decoded.sub || null,
        });
      },
      clearAuth: () => {
        set({ token: null, userRole: null, userName: null, userId: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return sessionStorage;
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    } as AuthPersist
  )
);

export const useAuth = () => {
  const store = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getDefaultRoute = () => {
    if (store.userRole === 'Specialist') {
      return '/dashboard/pacientes';
    }
    return '/dashboard/especialidades';
  };

  return {
    ...store,
    token: isClient ? store.token : null,
    userRole: isClient ? store.userRole : null,
    userName: isClient ? store.userName : null,
    userId: isClient ? store.userId : null,
    isHydrated: store._hasHydrated,
    defaultRoute: getDefaultRoute(),
  };
};