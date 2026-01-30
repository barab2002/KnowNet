import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    email: string;
    name: string;
    profileImageUrl?: string;
  };
  token: string;
}

const API_URL = '/api/auth';

export const login = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  // For now, this is a mock implementation
  // In production, this would call the real backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          _id: 'current-user-id',
          email: credentials.email,
          name: credentials.email.split('@')[0],
        },
        token: 'mock-jwt-token-' + Date.now(),
      });
    }, 500);
  });
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  // For now, this is a mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          _id: 'new-user-' + Date.now(),
          email: data.email,
          name: data.name,
        },
        token: 'mock-jwt-token-' + Date.now(),
      });
    }, 500);
  });
};

export const logout = async (): Promise<void> => {
  // Clear any server-side sessions if needed
  return Promise.resolve();
};
