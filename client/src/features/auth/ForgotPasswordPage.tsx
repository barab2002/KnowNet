import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      const code = err?.code;
      if (code === 'auth/user-not-found') {
        // Don't reveal whether the email exists
        setSent(true);
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-primary/5 dark:from-[#0d1419] dark:via-[#192633] dark:to-[#0d1419] px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary text-white mb-4 shadow-lg">
            <span className="material-symbols-outlined text-4xl">lock_reset</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Reset password</h1>
          <p className="text-slate-600 dark:text-[#92adc9]">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="bg-white dark:bg-[#192633] rounded-2xl shadow-xl border border-slate-200 dark:border-[#324d67] p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center size-14 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <span className="material-symbols-outlined text-3xl">mark_email_read</span>
              </div>
              <p className="text-slate-700 dark:text-slate-200 font-medium">
                If an account exists for <span className="font-bold">{email}</span>, a reset link has been sent.
              </p>
              <p className="text-sm text-slate-500 dark:text-[#92adc9]">
                Check your inbox and follow the instructions.
              </p>
              <Link
                to="/login"
                className="block w-full text-center py-3 px-6 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all mt-4"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-[#324d67] bg-white dark:bg-[#0d1419] focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-lg bg-primary text-white font-bold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <Link
                to="/login"
                className="block w-full text-center py-3 px-6 rounded-lg border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
