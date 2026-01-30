import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await register(formData);
      navigate('/'); // Navigate to home page after successful registration
    } catch (err) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-primary/5 dark:from-[#0d1419] dark:via-[#192633] dark:to-[#0d1419] px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary text-white mb-4 shadow-lg">
            <span className="material-symbols-outlined text-4xl">school</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-slate-600 dark:text-[#92adc9]">
            Join KnowNet and start sharing knowledge
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white dark:bg-[#192633] rounded-2xl shadow-xl border border-slate-200 dark:border-[#324d67] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-bold mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                  person
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-[#324d67] focus:ring-primary'
                  } bg-white dark:bg-[#0d1419] focus:outline-none focus:ring-2 transition-all`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-[#324d67] focus:ring-primary'
                  } bg-white dark:bg-[#0d1419] focus:outline-none focus:ring-2 transition-all`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold mb-2"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-[#324d67] focus:ring-primary'
                  } bg-white dark:bg-[#0d1419] focus:outline-none focus:ring-2 transition-all`}
                  placeholder="At least 6 characters"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-bold mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                  lock
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    });
                    setErrors({ ...errors, confirmPassword: '' });
                  }}
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-200 dark:border-[#324d67] focus:ring-primary'
                  } bg-white dark:bg-[#0d1419] focus:outline-none focus:ring-2 transition-all`}
                  placeholder="Re-enter your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-[#324d67]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#192633] text-slate-500 dark:text-[#92adc9]">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full text-center py-3 px-6 rounded-lg border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-slate-500 dark:text-[#92adc9]">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
