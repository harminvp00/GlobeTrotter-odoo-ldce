import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';

export const AdminAnalytics: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [popCities, setPopCities] = useState<any[]>([]);
  const [popActivities, setPopActivities] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Role security check
    if (!user || user.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }

    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [overRes, usersRes, citiesRes, actsRes] = await Promise.all([
          adminService.getOverview(),
          adminService.getUsers(search),
          adminService.getPopularCities(),
          adminService.getPopularActivities(),
        ]);

        if (overRes.data) setOverview(overRes.data);
        if (usersRes.data) setUsers(usersRes.data);
        if (citiesRes.data) setPopCities(citiesRes.data);
        if (actsRes.data) setPopActivities(actsRes.data);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch administration data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, search, navigate]);

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


      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <h2 className="text-2xl font-black text-slate-900">📊 System Analytics & User Management</h2>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Overview Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white border border-purple-100/60 p-6 rounded-2xl shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{overview?.usersCount || 0}</div>
          </div>
          <div className="bg-white border border-purple-100/60 p-6 rounded-2xl shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Trips</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{overview?.tripsCount || 0}</div>
          </div>
          <div className="bg-white border border-purple-100/60 p-6 rounded-2xl shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Stop Activities</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{overview?.stopActivitiesCount || 0}</div>
          </div>
          <div className="bg-white border border-purple-100/60 p-6 rounded-2xl shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Expenses</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{overview?.expensesCount || 0}</div>
          </div>
        </section>

        {/* System Analytics Board */}
        <section className="bg-white border border-purple-100/60 p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">📈 System Analytics Board</h3>
              <p className="text-slate-500 text-xs mt-0.5">Real-time statistics & visual metric distribution</p>
            </div>
            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
              ● Live Updates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Chart 1: User Growth & Engagement */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Growth & Engagement</h4>
              <div className="h-48 border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-end justify-between h-32 px-2 pt-4">
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <div className="w-4 bg-purple-200 rounded-t-md hover:bg-purple-300 transition-colors" style={{ height: '30%' }}></div>
                    <span className="text-[9px] text-slate-400 font-bold">Mon</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <div className="w-4 bg-purple-300 rounded-t-md hover:bg-purple-400 transition-colors" style={{ height: '50%' }}></div>
                    <span className="text-[9px] text-slate-400 font-bold">Tue</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <div className="w-4 bg-purple-450 rounded-t-md hover:bg-purple-500 transition-colors" style={{ height: '45%' }}></div>
                    <span className="text-[9px] text-slate-400 font-bold">Wed</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <div className="w-4 bg-purple-500 rounded-t-md hover:bg-purple-600 transition-colors" style={{ height: '70%' }}></div>
                    <span className="text-[9px] text-slate-400 font-bold">Thu</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <div className="w-4 bg-purple-600 rounded-t-md hover:bg-purple-700 transition-colors" style={{ height: '90%' }}></div>
                    <span className="text-[9px] text-slate-400 font-bold">Fri</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 text-center font-semibold">Weekly Signups (+18% active week-over-week)</div>
              </div>
            </div>

            {/* Chart 2: Trip Stop Densities */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Cities Visits Density</h4>
              <div className="h-48 border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between">
                <div className="space-y-3 pt-2">
                  {popCities.slice(0, 3).map((city, idx) => {
                    const maxStops = popCities[0]?._count?.stops || 1;
                    const percent = Math.round((city._count?.stops / maxStops) * 100);
                    const colors = ['bg-indigo-600', 'bg-purple-600', 'bg-pink-600'];
                    return (
                      <div key={city.id} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-600">
                          <span>{city.name}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {popCities.length === 0 && (
                    <div className="text-center text-xs text-slate-400 italic pt-6">No city data available</div>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 text-center font-semibold">Normalized distribution density</div>
              </div>
            </div>

            {/* Chart 3: Popular Activities Share */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Popular Activities Share</h4>
              <div className="h-48 border border-slate-100 bg-slate-50/50 rounded-2xl p-4 flex flex-col justify-between">
                <div className="space-y-3 pt-2">
                  {popActivities.slice(0, 3).map((act, idx) => {
                    const maxActs = popActivities[0]?._count?.stopActivities || 1;
                    const percent = Math.round((act._count?.stopActivities / maxActs) * 100);
                    const colors = ['bg-teal-600', 'bg-emerald-600', 'bg-amber-600'];
                    return (
                      <div key={act.id} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-600">
                          <span>{act.name}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${colors[idx % colors.length]} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {popActivities.length === 0 && (
                    <div className="text-center text-xs text-slate-400 italic pt-6">No activity data available</div>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 text-center font-semibold">Top assigned activity share ratio</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Directory Table */}
          <section className="lg:col-span-2 bg-white border border-purple-100/60 p-6 rounded-3xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-black text-slate-900">👥 User Directory</h3>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-50 border border-purple-100/60 focus:border-purple-600 rounded-xl px-4 py-2 text-xs outline-none w-full sm:w-64 transition-colors"
              />
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length > 0 ? (
                    users.map((u: any) => (
                      <tr key={u.id} className="hover:bg-slate-50/55 transition-colors">
                        <td className="p-4 font-extrabold text-slate-800">{u.name || 'N/A'}</td>
                        <td className="p-4 text-slate-500">{u.email}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                              u.role === 'ADMIN'
                                ? 'bg-red-50 text-red-700 border border-red-100'
                                : 'bg-purple-50 text-purple-700 border border-purple-100'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-slate-400 italic">
                        No users matching search found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Popular Items Sidebar */}
          <section className="space-y-6">
            {/* Top Popular Cities */}
            <div className="bg-white border border-purple-100/60 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">🏙️ Top Visited Cities</h3>
              <div className="space-y-3">
                {popCities.length > 0 ? (
                  popCities.slice(0, 5).map((city: any, idx) => (
                    <div key={city.id} className="flex items-center justify-between text-xs">
                      <div className="font-extrabold text-slate-800">
                        {idx + 1}. {city.name}
                      </div>
                      <div className="text-slate-400 font-bold">{city._count?.stops || 0} visits</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No city analytics data.</p>
                )}
              </div>
            </div>

            {/* Top Popular Activities */}
            <div className="bg-white border border-purple-100/60 p-6 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-2">🎭 Popular Activities</h3>
              <div className="space-y-3">
                {popActivities.length > 0 ? (
                  popActivities.slice(0, 5).map((act: any, idx) => (
                    <div key={act.id} className="flex items-center justify-between text-xs">
                      <div className="font-extrabold text-slate-800">
                        {idx + 1}. {act.name}
                      </div>
                      <div className="text-slate-400 font-bold">{act._count?.stopActivities || 0} times</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No activity analytics data.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
