import { create } from 'zustand';
import type { User } from '../types/auth';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  simulateLoginAsDonaMarta: () => Promise<void>;
  simulateLoginAsPedro: () => Promise<void>;
  debitCaderninhoLimit: (amount: number) => void;
}

const getStoredToken = () => localStorage.getItem('mateus_auth_token');
const getStoredUser = (): User | null => {
  const item = localStorage.getItem('mateus_user');
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set, get) => {
  const initialToken = getStoredToken();
  const initialUser = getStoredUser();

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: Boolean(initialToken && initialUser),
    isLoading: false,
    error: null,

    setAuth: (user: User, token: string) => {
      localStorage.setItem('mateus_auth_token', token);
      localStorage.setItem('mateus_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, error: null });
    },

    logout: () => {
      localStorage.removeItem('mateus_auth_token');
      localStorage.removeItem('mateus_user');
      set({ user: null, token: null, isAuthenticated: false, error: null });
    },

    clearError: () => set({ error: null }),

    simulateLoginAsDonaMarta: async () => {
      try {
        const res = await authService.login({ email: 'marta@mateus.com.br', password: 'marta123' });
        get().setAuth(res.user, res.token);
      } catch (err) {
        console.error('Falha ao autenticar Dona Marta na API:', err);
      }
    },

    simulateLoginAsPedro: async () => {
      try {
        const res = await authService.login({ email: 'pedro@mateus.com.br', password: 'pedro123' });
        get().setAuth(res.user, res.token);
      } catch (err) {
        console.error('Falha ao autenticar Pedro na API:', err);
      }
    },

    debitCaderninhoLimit: (amount: number) => {
      const currentUser = get().user;
      if (!currentUser) return;
      const currentLimit = currentUser.caderninhoLimit ?? 0;
      const newLimit = Math.max(0, currentLimit - amount);
      const updatedUser: User = {
        ...currentUser,
        caderninhoLimit: Number(newLimit.toFixed(2)),
      };
      localStorage.setItem('mateus_user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    },
  };
});
