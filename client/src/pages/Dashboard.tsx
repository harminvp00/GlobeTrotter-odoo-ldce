import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { profileService } from '../services/profileService';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getDashboardData();
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSaveDestination = async (cityId: string) => {
    try {
      await profileService.addSavedDestination(cityId, 'Recommended from dashboard');
      alert('Destination saved to your profile preferences!');
      fetchDashboardData();
    } catch (err: any) {
      alert(err?.message || 'Failed to save destination');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-purple-100/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tight">{data?.welcomeMessage || `Welcome back, ${user?.name}!`}</h2>
            <p className="text-purple-100 text-sm max-w-xl">
              Explore your stats, view recent trips, and discover popular destinations recommended just for you.
            </p>
          </div>
          <div>
            <Link
              to="/trips/new"
              className="px-6 py-3 bg-white hover:bg-purple-50 text-purple-700 font-extrabold text-sm rounded-xl shadow-lg transition-all inline-block"
            >
              🚀 Plan New Trip
            </Link>
          </div>
        </section>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-purple-100/60 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold">
              ✈️
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Trips</div>
              <div className="text-2xl font-black text-slate-800 mt-1">{data?.stats?.totalTrips || 0}</div>
            </div>
          </div>

          <div className="bg-white border border-purple-100/60 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl font-bold">
              💰
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Budget</div>
              <div className="text-2xl font-black text-slate-800 mt-1">
                {(data?.stats?.totalPlannedBudget || 0).toLocaleString()} INR
              </div>
            </div>
          </div>

          <div className="bg-white border border-purple-100/60 p-6 rounded-2xl shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
              📌
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saved Places</div>
              <div className="text-2xl font-black text-slate-800 mt-1">{data?.stats?.savedDestinationsCount || 0}</div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Trips Section */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">📅 Recent Itineraries</h3>
              <Link to="/trips" className="text-xs font-bold text-purple-600 hover:text-purple-800 hover:underline">
                View All Trips →
              </Link>
            </div>

            {data?.recentTrips && data.recentTrips.length > 0 ? (
              <div className="space-y-4">
                {data.recentTrips.map((trip: any) => (
                  <div
                    key={trip.id}
                    className="bg-white border border-purple-50/70 p-5 rounded-2xl hover:shadow-md transition-shadow flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="font-extrabold text-slate-800 text-base">{trip.name}</div>
                      <div className="text-xs text-slate-500">
                        🗓️ {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()} • {trip.stopCount} stops
                      </div>
                      {trip.description && (
                        <p className="text-xs text-slate-400 italic line-clamp-1">{trip.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-bold text-purple-600">{trip.budget.toLocaleString()} {trip.currency}</div>
                        <span className="text-[10px] bg-purple-50 border border-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          {trip.visibility}
                        </span>
                      </div>
                      <Link
                        to={`/trips/${trip.id}/edit`}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-purple-100 rounded-2xl py-12 text-center text-slate-400 text-sm">
                No trips planned yet. Click "Plan New Trip" to get started!
              </div>
            )}
          </section>

          {/* Recommendations Sidebar */}
          <section className="space-y-4">
            <h3 className="text-lg font-black text-slate-900">🌍 Recommended Destinations</h3>
            <div className="space-y-4">
              {data?.recommendations && data.recommendations.length > 0 ? (
                data.recommendations.map((city: any) => (
                  <div
                    key={city.id}
                    className="bg-white border border-purple-50/70 p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      {city.imageUrl ? (
                        <img
                          src={city.imageUrl}
                          alt={city.name}
                          className="h-12 w-12 rounded-xl object-cover border border-purple-50"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg font-bold">
                          🏙️
                        </div>
                      )}
                      <div>
                        <div className="font-extrabold text-sm text-slate-800">{city.name}</div>
                        <div className="text-[10px] text-slate-400">{city.region || city.country}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSaveDestination(city.id)}
                      className="text-xs bg-purple-50 hover:bg-purple-100 border border-purple-100/50 text-purple-700 font-bold px-3 py-1.5 rounded-xl transition-all"
                    >
                      Save
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs italic bg-white border border-purple-50 rounded-2xl">
                  No recommendations available.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
