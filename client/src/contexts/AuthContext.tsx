import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  LoginCredentials,
  RegisterData,
  AuthResponse,
} from '../api/auth';

interface User {
  _id: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  bio?: string;
  major?: string;
  graduationYear?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUserData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'knownet_auth';
const REMEMBER_ME_KEY = 'knownet_remember_me';

interface AuthStorage {
  user: User;
  token: string;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const getInitialAuth = (): { user: User | null; token: string | null } => {
    try {
      const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
      const raw = rememberMe
        ? localStorage.getItem(AUTH_STORAGE_KEY)
        : sessionStorage.getItem(AUTH_STORAGE_KEY);

      if (!raw) return { user: null, token: null };
      const parsed: AuthStorage = JSON.parse(raw);
      return { user: parsed.user, token: parsed.token };
    } catch (error) {
      console.error('Failed to load auth state:', error);
      return { user: null, token: null };
    }
  };

  const initialAuth = getInitialAuth();
  const [user, setUser] = useState<User | null>(initialAuth.user);
  const [token, setToken] = useState<string | null>(initialAuth.token);
  const [isLoading] = useState(false);

  // Update Axios default header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const saveAuthState = (authData: AuthResponse, rememberMe: boolean) => {
    const storage: AuthStorage = {
      user: authData.user,
      token: authData.token,
    };

    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storage));
      localStorage.setItem(REMEMBER_ME_KEY, 'true');
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storage));
      localStorage.setItem(REMEMBER_ME_KEY, 'false');
    }

    setUser(authData.user);
    setToken(authData.token);
  };

  const clearAuthState = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setToken(null);
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiLogin(credentials);
      saveAuthState(response, credentials.rememberMe || false);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await apiRegister(data);
      saveAuthState(response, true); // Auto remember after registration
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const loginWithToken = async (token: string) => {
    try {
      // Import getProfile dynamically to avoid circular dependencies if any, or just import at top if fine.
      // Already imported at top? No.
      const { getProfile } = await import('../api/auth');
      const user = await getProfile(token);

      const authResponse: AuthResponse = { user, token };
      saveAuthState(authResponse, true); // Auto remember for Google Auth
    } catch (error) {
      console.error('Login with token failed:', error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    clearAuthState();
  };

  const updateUser = (updatedUserData: Partial<User>) => {
    if (!user || !token) return;

    const newUser = { ...user, ...updatedUserData };
    const authData = { user: newUser, token };
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';

    saveAuthState(authData, rememberMe);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    loginWithToken,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
