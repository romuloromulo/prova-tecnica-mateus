export interface User {
  id: string | number;
  name: string;
  email: string;
  role?: 'ROLE_USER' | 'ROLE_ADMIN';
  caderninhoLimit?: number;
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
  tokenType?: string;
  userId?: number;
  id?: number;
  name: string;
  email: string;
  caderninhoLimit?: number;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  caderninhoLimit?: number;
  role?: string;
  createdAt?: string;
}
