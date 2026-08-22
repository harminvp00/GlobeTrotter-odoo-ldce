import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './pages/Auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function SetupDashboard() {
  const { user, logout } = useAuth();
  const [serverHealth, setServerHealth] = useState<{ status: string; database: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setChecking(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }
      const data = await res.json();
      setServerHealth({ status: data.status, database: data.database });
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to backend server');
      setServerHealth(null);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-purple-200">
              GT
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">GlobeTrotter</h1>
              <p className="text-xs text-slate-500 m-0">Travel Planner Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-semibold text-slate-600">Logged in: {user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto py-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Authentication UI <span className="text-purple-600 font-black">Active</span>
          </h2>
          <p className="text-lg text-slate-600">
            You have successfully logged in! Your user context is persisted and protected by the route middleware.
          </p>
        </section>

        {/* Status Check Panel */}
        <section className="bg-white rounded-2xl shadow-sm border border-purple-100 p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Environment Verification</h3>
              <p className="text-sm text-slate-500">
                Check client-to-server integration and server-to-database connection status.
              </p>
            </div>
            <button
              onClick={checkHealth}
              disabled={checking}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 flex items-center space-x-2 cursor-pointer self-start md:self-auto"
            >
              {checking ? 'Testing Connection...' : 'Re-verify Integration'}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Client Status */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Frontend Client</span>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-800">React + TS</span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                  Online
                </span>
              </div>
            </div>

            {/* Server Status */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Backend Server</span>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-800">Express.js</span>
                {checking ? (
                  <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
                ) : serverHealth ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                    {serverHealth.status}
                  </span>
                ) : error ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
                    Offline
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Unknown</span>
                )}
              </div>
            </div>

            {/* Database Status */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Database Engine</span>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-800">PostgreSQL</span>
                {checking ? (
                  <span className="text-xs text-slate-400 animate-pulse">Checking...</span>
                ) : serverHealth ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                    {serverHealth.database}
                  </span>
                ) : error ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
                    Disconnected
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Unknown</span>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 text-sm text-red-700 font-medium">
              ⚠️ {error}. Ensure backend is running by executing <code className="bg-red-100/50 px-1 py-0.5 rounded text-xs">npm run dev</code> inside <code className="bg-red-100/50 px-1 py-0.5 rounded text-xs">server/</code>.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={<Auth />} />
          <Route path="/reset-password" element={<Auth />} />

          {/* Protected Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <SetupDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Redirections */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
