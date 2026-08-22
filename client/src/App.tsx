import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './pages/Auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MyTrips } from './pages/MyTrips';
import { CreateTrip } from './pages/CreateTrip';
import { ItineraryBuilder } from './pages/ItineraryBuilder';
import { Dashboard } from './pages/Dashboard';
import { ProfileSettings } from './pages/ProfileSettings';
import { PublicItinerary } from './pages/PublicItinerary';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { CitiesExplore } from './pages/CitiesExplore';
import { ActivitiesExplore } from './pages/ActivitiesExplore';
import { Navbar } from './components/Navbar';

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
            <Link to="/trips" className="text-xs font-semibold text-purple-700 hover:text-purple-900">
              My Trips
            </Link>
            <Link to="/trips/new" className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg shadow-md transition-all">
              Plan a Trip
            </Link>
            <div className="h-4 w-px bg-slate-200"></div>
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


        {/* Quick Access Trip Planner */}
        <section className="bg-white rounded-2xl border border-purple-100 p-8 max-w-4xl mx-auto shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">✈️ Plan Your Next Adventure</h3>
            <p className="text-sm text-slate-500">
              Create a multi-city travel itinerary, organize stops, and discover suggestions for local activities.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/trips"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all"
            >
              View My Trips
            </Link>
            <Link
              to="/trips/new"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
            >
              Create Trip Plan
            </Link>
          </div>
        </section>

        
      </main>
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/forgot-password" element={<Auth />} />
          <Route path="/reset-password" element={<Auth />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <ProfileSettings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cities"
            element={
              <ProtectedRoute>
                <CitiesExplore />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activities"
            element={
              <ProtectedRoute>
                <ActivitiesExplore />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shares/:shareSlug"
            element={<PublicItinerary />}
          />

          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <MyTrips />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips/new"
            element={
              <ProtectedRoute>
                <CreateTrip />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips/:tripId/edit"
            element={
              <ProtectedRoute>
                <ItineraryBuilder />
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
