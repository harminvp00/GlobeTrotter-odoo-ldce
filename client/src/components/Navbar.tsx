import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-purple-700 font-extrabold' : 'text-slate-600 font-semibold hover:text-purple-600';
  };

  // Do not render Navbar on login/register/forgot/reset password or shares pages
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
  if (authPaths.includes(location.pathname) || location.pathname.startsWith('/shares/')) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-purple-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section: Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-purple-200">
                GT
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0 leading-none">GlobeTrotter</h1>
                <span className="text-[10px] text-purple-600 font-bold tracking-widest uppercase">Planner</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user?.role === 'ADMIN' && (
              <Link to="/admin" className={`text-xs uppercase tracking-wider px-2.5 py-1 rounded-full border border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors`}>
                Admin Panel
              </Link>
            )}
            <Link to="/dashboard" className={`text-sm transition-all ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
            <Link to="/trips" className={`text-sm transition-all ${isActive('/trips')}`}>
              My Trips
            </Link>
            <Link to="/cities" className={`text-sm transition-all ${isActive('/cities')}`}>
              Explore Cities
            </Link>
            <Link to="/activities" className={`text-sm transition-all ${isActive('/activities')}`}>
              Activities
            </Link>
            <Link to="/settings" className={`text-sm transition-all ${isActive('/settings')}`}>
              Settings
            </Link>
            <Link to="/trips/new" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-purple-200/50 transition-all">
              🚀 Plan a Trip
            </Link>
            <div className="h-4 w-px bg-slate-200"></div>
            {user && (
              <span className="text-xs font-semibold text-slate-500">
                Hi, <span className="text-slate-800 font-bold">{user.name.split(' ')[0]}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 px-3.5 py-2 rounded-xl border border-purple-100/50 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-purple-50 outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-50 bg-white" id="mobile-menu">
          <div className="px-4 pt-3 pb-4 space-y-2">
            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center text-xs uppercase tracking-wider py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold"
              >
                Admin Panel
              </Link>
            )}
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm ${
                location.pathname === '/dashboard' ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-600 font-semibold'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/trips"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm ${
                location.pathname === '/trips' ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-600 font-semibold'
              }`}
            >
              My Trips
            </Link>
            <Link
              to="/cities"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm ${
                location.pathname === '/cities' ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-600 font-semibold'
              }`}
            >
              Explore Cities
            </Link>
            <Link
              to="/activities"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm ${
                location.pathname === '/activities' ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-600 font-semibold'
              }`}
            >
              Activities
            </Link>
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm ${
                location.pathname === '/settings' ? 'bg-purple-50 text-purple-700 font-extrabold' : 'text-slate-600 font-semibold'
              }`}
            >
              Profile Settings
            </Link>
            <Link
              to="/trips/new"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2.5 bg-purple-600 text-white font-extrabold text-xs rounded-xl shadow-md"
            >
              🚀 Plan a Trip
            </Link>
            <div className="border-t border-slate-100 my-2"></div>
            {user && (
              <div className="px-4 py-1.5 text-xs text-slate-500 font-semibold">
                Logged in as: <span className="text-slate-800 font-bold">{user.name}</span>
              </div>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-center py-2.5 text-xs font-bold bg-purple-50 text-purple-700 rounded-xl border border-purple-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
