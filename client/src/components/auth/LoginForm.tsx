import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToRegister,
  onForgotPassword,
  onSuccess,
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const tempErrors: typeof errors = {};
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      tempErrors.email = 'Invalid email format';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(email, password);
      onSuccess();
    } catch (err: any) {
      setErrors({ general: err.message || 'Failed to log in. Please check your credentials.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-purple-50">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-purple-950">Welcome Back</h2>
        <p className="text-purple-600/80 mt-2">Log in to plan your next adventure</p>
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-purple-950 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
              errors.email ? 'border-red-300 bg-red-50/30' : 'border-purple-100'
            }`}
            placeholder="name@example.com"
          />
          {errors.email && <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="text-sm font-semibold text-purple-950">
              Password
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
            >
              Forgot Password?
            </button>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors ${
              errors.password ? 'border-red-300 bg-red-50/30' : 'border-purple-100'
            }`}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-600 text-xs mt-1 font-medium">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold py-3 rounded-lg transition-colors shadow-md shadow-purple-200/50 hover:shadow-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-purple-50 pt-6">
        <p className="text-sm text-purple-600/80">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-purple-700 hover:text-purple-900 transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
