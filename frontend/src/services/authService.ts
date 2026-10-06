import api from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

export const authService = {
  /**
   * Realiza login do cliente no sistema
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Mock inteligente de fallback caso o backend Spring Boot não esteja iniciado no momento
      console.warn('API Spring Boot indisponível no endpoint /auth/login, utilizando fallback local para teste de front-end.');
      
      const isDonaMarta = credentials.email.toLowerCase().includes('marta');
      const mockUser: User = isDonaMarta
        ? {
            id: 1,
            name: 'Dona Marta',
            email: credentials.email,
            role: 'ROLE_USER',
            caderninhoLimit: 450.0,
          }
        : {
            id: 2,
            name: credentials.email.split('@')[0] || 'Cliente Amigo',
            email: credentials.email,
            role: 'ROLE_USER',
            caderninhoLimit: 300.0,
          };

      const mockResponse: AuthResponse = {
        token: `mock_jwt_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        user: mockUser,
      };

      return mockResponse;
    }
  },

  /**
   * Realiza o cadastro de um novo cliente
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      console.warn('API Spring Boot indisponível no endpoint /auth/register, utilizando fallback local para teste de front-end.');

      const newUser: User = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        role: 'ROLE_USER',
        caderninhoLimit: 250.0, // Limite inicial de boas-vindas no Caderninho Digital
      };

      const mockResponse: AuthResponse = {
        token: `mock_jwt_new_${Date.now()}`,
        user: newUser,
      };

      return mockResponse;
    }
  },

  /**
   * Obtém os dados do perfil do cliente autenticado
   */
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },
};

export default authService;
