import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

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

export const loginWithGoogle = async (): Promise<AuthResponse> => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  const response = await axios.post<{ access_token: string; user: AuthResponse['user'] }>(`${API_URL}/firebase`, {
    idToken,
  });
  return { token: response.data.access_token, user: response.data.user };
};

export const login = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const userId =
    'user-' + credentials.email.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  const user = {
    _id: userId,
    email: credentials.email,
    name: credentials.email.split('@')[0],
  };

  try {
    await createUser(user);
  } catch (error) {
    console.error('Failed to sync user to backend:', error);
  }

  return {
    user,
    token: 'mock-jwt-token-' + Date.now(),
  };
};

import { createUser } from './users';

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newUser = {
    _id: 'user-' + Date.now(),
    email: data.email,
    name: data.name,
  };

  try {
    await createUser(newUser);
  } catch (error) {
    console.error('Failed to create user in backend DB:', error);
  }

  return {
    user: newUser,
    token: 'mock-jwt-token-' + Date.now(),
  };
};

export const logout = async (): Promise<void> => {
  return Promise.resolve();
};

export const getProfile = async (
  token: string,
): Promise<AuthResponse['user']> => {
  const response = await axios.get<AuthResponse['user']>(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
