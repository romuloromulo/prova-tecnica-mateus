import api from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<any>('/auth/login', credentials);
    const data = response.data;
    const user: User = data.user || {
      id: data.userId || data.id,
      name: data.name,
      email: data.email,
      caderninhoLimit: Number(data.caderninhoLimit ?? 800),
    };
    return {
      token: data.token,
      user,
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<any>('/auth/register', data);
    const resData = response.data;
    const user: User = resData.user || {
      id: resData.userId || resData.id,
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
    const response = await api.get<any>('/auth/me');
    const data = response.data;
    return {
      id: data.userId || data.id,
      name: data.name,
      email: data.email,
      caderninhoLimit: Number(data.caderninhoLimit ?? 800),
    };
  },
};

export default authService;
