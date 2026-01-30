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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate consistent ID based on email so same user gets same ID
  // Simple "hash" of email
  const userId =
    'user-' + credentials.email.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  const user = {
    _id: userId,
    email: credentials.email,
    name: credentials.email.split('@')[0],
  };

  try {
    // Ensure user exists in backend DB
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
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newUser = {
    _id: 'user-' + Date.now(),
    email: data.email,
    name: data.name,
  };

  try {
    // Create actual user document in backend so profile page works
    await createUser(newUser);
  } catch (error) {
    console.error('Failed to create user in backend DB:', error);
    // We continue anyway since this is a mock auth flow, but warn
  }

  return {
    user: newUser,
    token: 'mock-jwt-token-' + Date.now(),
  };
};

export const logout = async (): Promise<void> => {
  // Clear any server-side sessions if needed
  return Promise.resolve();
};
