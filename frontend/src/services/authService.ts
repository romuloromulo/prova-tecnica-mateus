import api from './api';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthSession,
  User,
  UserProfileResponse,
} from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    const data = response.data;
    const user: User = {
      id: data.userId ?? data.id ?? 1,
      name: data.name,
      email: data.email,
      caderninhoLimit: Number(data.caderninhoLimit ?? 800),
    };
    return {
      token: data.token,
      user,
    };
  },

  async register(data: RegisterData): Promise<AuthSession> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    const resData = response.data;
    const user: User = {
      id: resData.userId ?? resData.id ?? Date.now(),
      name: resData.name,
      email: resData.email,
      caderninhoLimit: Number(resData.caderninhoLimit ?? 800),
    };
    return {
      token: resData.token,
      user,
    };
  },

  async getProfile(): Promise<User> {
    const response = await api.get<UserProfileResponse>('/auth/me');
    const data = response.data;
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      caderninhoLimit: Number(data.caderninhoLimit ?? 800),
    };
  },
};

export default authService;
