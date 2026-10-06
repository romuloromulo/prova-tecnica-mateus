import axios from 'axios';

// Base URL configurável por variável de ambiente Vite ou fallback para /api
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
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

// Interceptor para tratamento de resposta, expiração de sessão e proteção contra fallback SPA (HTML)
api.interceptors.response.use(
  (response) => {
    // Se a resposta for HTML (ex: Vite servindo index.html na rota /api quando o Spring Boot está offline),
    // rejeitamos para acionar com segurança o fallback mock sem quebrar o estado do React
    const contentType = String(response.headers['content-type'] || '');
    if (
      typeof response.data === 'string' &&
      (response.data.trim().startsWith('<!doctype') ||
        response.data.trim().startsWith('<html') ||
        contentType.includes('text/html'))
    ) {
      return Promise.reject(new Error('Backend offline: Vite serviu index.html na rota da API.'));
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('mateus_auth_token');
      localStorage.removeItem('mateus_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
