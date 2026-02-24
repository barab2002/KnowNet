import axios from 'axios';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
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

const exchangeFirebaseToken = async (idToken: string): Promise<AuthResponse> => {
  const response = await axios.post<{ accessToken: string; user: AuthResponse['user'] }>(
    `${API_URL}/firebase`,
    { idToken },
  );
  return { token: response.data.accessToken, user: response.data.user };
};

export const loginWithGoogle = async (): Promise<AuthResponse> => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return exchangeFirebaseToken(idToken);
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
  const idToken = await result.user.getIdToken();
  return exchangeFirebaseToken(idToken);
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
  await updateProfile(result.user, { displayName: data.name });
  // Force-refresh so the token includes the updated displayName
  const idToken = await result.user.getIdToken(true);
  return exchangeFirebaseToken(idToken);
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
};

export const getProfile = async (token: string): Promise<AuthResponse['user']> => {
  const response = await axios.get<AuthResponse['user']>(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
