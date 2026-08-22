import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import { cityService } from '../services/cityService';
import type { City } from '../types';

export const CreateTrip: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [visibility, setVisibility] = useState<'PRIVATE' | 'PUBLIC'>('PRIVATE');

  // Search & suggestions state
  const [cities, setCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Suggestions list for the bottom grid (Screen 4 sketch)
  const [suggestedCities, setSuggestedCities] = useState<City[]>([]);

  useEffect(() => {
    // Load initial cities for suggestion and select list
    const loadCities = async () => {
      try {
        const res = await cityService.getCities();
        if (res.data) {
          setCities(res.data);
          // Pick top 6 popular cities for the suggestions grid
          const sorted = [...res.data].sort((a, b) => b.popularity - a.popularity);
          setSuggestedCities(sorted.slice(0, 6));
        }
      } catch (err: any) {
        console.error('Failed to load cities:', err);
      }
    };
    loadCities();
  }, []);

  const handleCitySearch = async (query: string) => {
    setSearchQuery(query);
    setShowDropdown(true);
    if (!query.trim()) {
      const res = await cityService.getCities();
      setCities(res.data || []);
      return;
    }
    try {
      const res = await cityService.searchCities(query);
      setCities(res.data || []);
    } catch (err) {
      console.error('Error searching cities:', err);
    }
  };

  const handleSelectCity = (city: City) => {
    setSelectedCityId(city.id);
    setSearchQuery(`${city.name}, ${city.country}`);
    setShowDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedCityId || !startDate || !endDate) {
      setError('Please fill in all required fields (Trip Name, City, Start Date, End Date).');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Create Trip
      const tripRes = await tripService.createTrip({
        name,
        description,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        budget: budget ? parseFloat(budget) : undefined,
        currency,
        visibility,
      });

      if (tripRes.data && tripRes.data.id) {
        const newTripId = tripRes.data.id;

        // 2. Automatically add the selected city as the first stop
        // Wait, stops require a start & end date which fit within the trip dates
        await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api/trips/${newTripId}/stops`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            cityId: selectedCityId,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
            order: 1,
            notes: 'First stop of the journey',
          }),
        });

        navigate(`/trips/${newTripId}/edit`);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create trip. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Modern UI presets for gradient cards
  const gradientPresets = [
    'from-pink-500 to-rose-400',
    'from-purple-600 to-indigo-500',
    'from-blue-500 to-cyan-400',
    'from-teal-500 to-emerald-400',
    'from-amber-500 to-orange-400',
    'from-fuchsia-600 to-pink-500',
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-purple-200">
              GT
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">GlobeTrotter</h1>
              <p className="text-xs text-slate-500 m-0">Travel Planner</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/trips')}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900"
            >
              My Trips
            </button>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-2">
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

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Plan a new trip</h2>
          <p className="text-slate-500 text-sm mb-8">Define your destination, dates, and budget to build your customizable itinerary.</p>

          {error && (
            <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trip Name */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">Trip Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer in Europe, Goa Getaway"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
              </div>

              {/* Select a Place (Search bar) */}
              <div className="flex flex-col relative">
                <label className="text-sm font-semibold text-slate-700 mb-1">Select a Place *</label>
                <input
                  type="text"
                  placeholder="Search city or country..."
                  value={searchQuery}
                  onChange={(e) => handleCitySearch(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  className="px-4 py-2.5 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
                {showDropdown && cities.length > 0 && (
                  <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-purple-100 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
                    {cities.map((city) => (
                      <li
                        key={city.id}
                        onClick={() => handleSelectCity(city)}
                        className="px-4 py-3 hover:bg-purple-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
                      >
                        <div className="font-semibold text-slate-800">{city.name}</div>
                        <div className="text-xs text-slate-400">{city.country} • {city.region}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Start Date */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">End Date *</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
              </div>

              {/* Budget */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">Total Budget (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
              </div>

              {/* Currency */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              {/* Visibility */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1">Trip Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="px-4 py-2.5 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                >
                  <option value="PRIVATE">🔒 Private (Only me)</option>
                  <option value="PUBLIC">🌍 Public (Community Shared)</option>
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  placeholder="Briefly describe your dream travel plan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="px-4 py-2.5 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/trips')}
                className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Trip...' : 'Create & Build Itinerary'}
              </button>
            </div>
          </form>
        </div>

        {/* Suggestion for Places to Visit / Activities to perform (Screen 4 sketch) */}
        <section className="bg-white rounded-2xl border border-purple-100 shadow-sm p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Suggestion for Places to Visit</h3>
          <p className="text-slate-500 text-xs mb-6">Click a suggested place card to automatically select it as your trip destination.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {suggestedCities.map((city, idx) => (
              <div
                key={city.id}
                onClick={() => handleSelectCity(city)}
                className={`relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-sm border border-purple-50/50 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
              >
                {/* Visual Gradient Background Card */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${gradientPresets[idx % gradientPresets.length]} opacity-90 group-hover:scale-105 transition-transform duration-500`}></div>
                
                {/* Glassy detail overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-white/10 backdrop-blur-md border-t border-white/20 p-4 flex flex-col justify-end text-white">
                  <span className="text-sm font-black tracking-wide">{city.name}</span>
                  <span className="text-[10px] opacity-80">{city.country} • Popularity: {city.popularity}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
