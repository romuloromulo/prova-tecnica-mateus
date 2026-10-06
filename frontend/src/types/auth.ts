export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: 'ROLE_USER' | 'ROLE_ADMIN';
  caderninhoLimit?: number; // Limite de crédito do caderninho digital
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
