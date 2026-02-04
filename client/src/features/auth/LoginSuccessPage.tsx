import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

export const LoginSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth(); // We need to add this to AuthContext

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const handleLogin = async () => {
      try {
        await loginWithToken(token);
        navigate('/');
      } catch (error) {
        console.error('Failed to login with token', error);
        navigate('/login');
      }
    };

    handleLogin();
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Completing login...
        </h2>
      </div>
    </div>
  );
};

export default LoginSuccessPage;
