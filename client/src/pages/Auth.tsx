import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '../components/auth/ResetPasswordForm';

export const Auth: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const path = location.pathname;

  const renderForm = () => {
    switch (path) {
      case '/register':
        return (
          <RegisterForm
            onSwitchToLogin={() => navigate('/login')}
            onSuccess={() => {
              // Successfully registered: redirect to login with a query parameter or just show a message.
              // We'll redirect to login.
              navigate('/login?registered=true');
            }}
          />
        );
      case '/forgot-password':
        return <ForgotPasswordForm onBackToLogin={() => navigate('/login')} />;
      case '/reset-password':
        const token = searchParams.get('token') || '';
        if (!token) {
          return (
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-purple-50 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-900 mb-2">Invalid Reset Link</h2>
              <p className="text-purple-600/80 mb-6">No reset token was found in the URL. Please request a new link.</p>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Go to Forgot Password
              </button>
            </div>
          );
        }
        return <ResetPasswordForm token={token} onSuccess={() => navigate('/login')} />;
      case '/login':
      default:
        // Check if there's a registered success message flag
        const isRegistered = searchParams.get('registered') === 'true';
        return (
          <div className="space-y-4 w-full max-w-md">
            {isRegistered && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Registration successful! Please log in to your account.</span>
              </div>
            )}
            <LoginForm
              onSwitchToRegister={() => navigate('/register')}
              onForgotPassword={() => navigate('/forgot-password')}
              onSuccess={() => navigate('/dashboard')}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-purple-50/40 flex flex-col lg:flex-row">
      {/* Visual Left Section - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-purple-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract Travel Graphic Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-purple-900 flex items-center justify-center font-black text-xl shadow-md">
              GT
            </div>
            <span className="font-extrabold text-2xl tracking-wide">GlobeTrotter</span>
          </div>
        </div>

        <div className="z-10 max-w-lg my-auto space-y-6">
          <h1 className="text-5xl font-black leading-tight tracking-tight">
            Dream. Design. <br />
            <span className="text-purple-300">Organize your stops.</span>
          </h1>
          <p className="text-lg text-purple-100/90 leading-relaxed font-medium">
            Plan multi-city travel itineraries, control budgets, discover activities, and share your journeys within the GlobeTrotter community.
          </p>
          
          <div className="pt-6 grid grid-cols-2 gap-6 border-t border-purple-800">
            <div>
              <h3 className="font-extrabold text-2xl text-purple-300">100%</h3>
              <p className="text-sm text-purple-200">Customized itineraries</p>
            </div>
            <div>
              <h3 className="font-extrabold text-2xl text-purple-300">Real-time</h3>
              <p className="text-sm text-purple-200">Budget breakdowns</p>
            </div>
          </div>
        </div>

        <div className="z-10 text-xs text-purple-300/80">
          &copy; 2026 GlobeTrotter. All rights reserved.
        </div>
      </div>

      {/* Form Right Section */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Logo for mobile only */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
              GT
            </div>
            <span className="font-extrabold text-xl tracking-tight text-purple-950">GlobeTrotter</span>
          </div>

          {renderForm()}
        </div>
      </div>
    </div>
  );
};
