import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { activityService } from '../services/activityService';

export const ActivitiesExplore: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const cityIdParam = searchParams.get('cityId') || '';

  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const typeFilter = selectedType === 'ALL' ? undefined : selectedType;
      const res = await activityService.getActivities(cityIdParam || undefined, typeFilter, search || undefined);
      const list = res.data || res.activities || (Array.isArray(res) ? res : []);
      setActivities(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [cityIdParam, selectedType, search]);

  const categories = ['ALL', 'SIGHTSEEING', 'CULTURAL', 'FOOD', 'OUTDOOR', 'RELAXATION', 'NIGHTLIFE'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-purple-100/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-white/20 text-purple-100 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
              Experiences Catalog
            </span>
            <h2 className="text-3xl font-black tracking-tight">🎭 Explore Local Activities</h2>
            <p className="text-purple-100 text-sm max-w-xl">
              Discover top attractions, cultural sights, culinary tours, and hidden local gems for your trips.
            </p>
          </div>
          <button
            onClick={() => navigate('/cities')}
            className="px-6 py-3 bg-white hover:bg-purple-50 text-purple-700 font-extrabold text-sm rounded-xl shadow-lg transition-all"
          >
            🏙️ View Cities
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-purple-100 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-96 relative">
            <input
              type="text"
              placeholder="Search activities or sights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-purple-100 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-all pl-10"
            />
            <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedType(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedType === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Activities Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-purple-100/80 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 uppercase tracking-wider">
                      {act.type || 'Activity'}
                    </span>
                    {act.city?.name && (
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        📍 {act.city.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                    {act.name}
                  </h3>
                  {act.description && (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{act.description}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-500">
                    Est. Cost: <span className="font-extrabold text-purple-700">${act.cost || 0}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-400">
                    ⏱️ {act.durationHours ? `${act.durationHours} hr(s)` : 'Flexible'}
                  </div>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                No activities found for this selection.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
