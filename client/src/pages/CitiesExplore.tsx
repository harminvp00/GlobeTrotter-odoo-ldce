import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cityService } from '../services/cityService';
import { profileService } from '../services/profileService';

export const CitiesExplore: React.FC = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');

  const fetchCities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = search ? await cityService.searchCities(search) : await cityService.getCities();
      const list = res.data || res.cities || (Array.isArray(res) ? res : []);
      setCities(list);
    } catch (err: any) {
      setError(err?.message || 'Failed to load cities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [search]);

  const handleSaveCity = async (cityId: string) => {
    try {
      await profileService.addSavedDestination(cityId, 'Saved from Cities Explorer');
      alert('City saved to your profile preferences!');
    } catch (err: any) {
      alert(err?.message || 'Failed to save city');
    }
  };

  const regions = ['ALL', ...Array.from(new Set(cities.map((c) => c.region).filter(Boolean)))];

  const filteredCities = cities.filter((c) => {
    if (selectedRegion !== 'ALL' && c.region !== selectedRegion) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Title Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-xl shadow-purple-100/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-white/20 text-purple-100 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
              Destinations Catalog
            </span>
            <h2 className="text-3xl font-black tracking-tight">🏙️ Explore World Cities</h2>
            <p className="text-purple-100 text-sm max-w-xl">
              Browse top travel destinations, check cost indices, and add cities straight to your itinerary.
            </p>
          </div>
          <button
            onClick={() => navigate('/trips/new')}
            className="px-6 py-3 bg-white hover:bg-purple-50 text-purple-700 font-extrabold text-sm rounded-xl shadow-lg transition-all"
          >
            🚀 Start New Trip
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-purple-100 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-96 relative">
            <input
              type="text"
              placeholder="Search city, country, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-purple-100 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-all pl-10"
            />
            <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedRegion === region
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Cities Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <div
                key={city.id}
                className="bg-white rounded-2xl border border-purple-100/80 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between space-y-4 relative group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                      {city.countryCode} • {city.region || 'Global'}
                    </span>
                    {city.popularity && (
                      <span className="text-xs font-semibold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md">
                        ⭐ {city.popularity}/100
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">
                    {city.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">{city.country}</p>
                  {city.description && (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 pt-1">{city.description}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-500">
                    Cost Index: <span className="font-extrabold text-slate-800">${city.costIndex || 50}</span>/day
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveCity(city.id)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl border border-purple-100 transition-colors"
                      title="Save Destination to Profile"
                    >
                      ❤️
                    </button>
                    <button
                      onClick={() => navigate(`/activities?cityId=${city.id}`)}
                      className="px-3.5 py-2 text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 rounded-xl shadow-md transition-all"
                    >
                      Activities →
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredCities.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                No cities found matching your criteria.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
