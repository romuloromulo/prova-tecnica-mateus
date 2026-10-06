import axios from 'axios';

// Base URL configurável por variável de ambiente Vite ou fallback para /api
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para injeção automática de Bearer Token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mateus_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de resposta e expiração de sessão
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('mateus_auth_token');
      localStorage.removeItem('mateus_user');
      // Dispara evento para sincronização de estado se necessário
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
