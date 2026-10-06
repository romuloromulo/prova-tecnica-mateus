import { create } from 'zustand';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
  simulateLoginAsDonaMarta: () => void;
  simulateLoginAsPedro: () => void;
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

    // Acolhedor: permite testar diretamente a persona Dona Marta
    simulateLoginAsDonaMarta: () => {
      const donaMarta: User = {
        id: 1,
        name: 'Dona Marta',
        email: 'marta.osvaldo@mateus.com.br',
        caderninhoLimit: 450.0,
      };
      const fakeToken = 'mock_jwt_dona_marta_token_1987';
      localStorage.setItem('mateus_auth_token', fakeToken);
      localStorage.setItem('mateus_user', JSON.stringify(donaMarta));
      set({ user: donaMarta, token: fakeToken, isAuthenticated: true, error: null });
    },

    // Acolhedor: permite testar diretamente a persona Pedro (neto)
    simulateLoginAsPedro: () => {
      const pedro: User = {
        id: 2,
        name: 'Pedro (Neto da Dona Marta)',
        email: 'pedro.universitario@mateus.com.br',
        caderninhoLimit: 200.0,
      };
      const fakeToken = 'mock_jwt_pedro_token_2026';
      localStorage.setItem('mateus_auth_token', fakeToken);
      localStorage.setItem('mateus_user', JSON.stringify(pedro));
      set({ user: pedro, token: fakeToken, isAuthenticated: true, error: null });
    },

    // Debita o valor gasto no Caderninho Digital
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
