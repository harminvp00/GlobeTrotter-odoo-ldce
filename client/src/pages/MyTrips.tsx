import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import type { Trip } from '../types';

export const MyTrips: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search, Filter, Sort State
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'ALL' | 'PRIVATE' | 'PUBLIC'>('ALL');
  const [sortBy, setSortBy] = useState<'startDate' | 'name' | 'budget'>('startDate');
  const [groupByType, setGroupByType] = useState<'status' | 'none'>('status');

  const fetchTrips = async () => {
    setLoading(true);
    try {
      // Get trips from service (handles pagination/search)
      const res = await tripService.getTrips(
        searchTerm || undefined,
        visibilityFilter === 'ALL' ? undefined : visibilityFilter
      );
      if (res.data) {
        if (Array.isArray(res.data)) {
          setTrips(res.data);
        } else if (res.data.trips) {
          setTrips(res.data.trips);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [searchTerm, visibilityFilter]);

  const handleDeleteTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this trip? All its stops will be deleted.')) {
      return;
    }
    try {
      await tripService.deleteTrip(id);
      setTrips(trips.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err?.message || 'Failed to delete trip');
    }
  };

  const getTripStatus = (trip: Trip) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(trip.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(trip.endDate);
    end.setHours(23, 59, 59, 999);

    if (today >= start && today <= end) {
      return 'ONGOING';
    } else if (today < start) {
      return 'UPCOMING';
    } else {
      return 'COMPLETED';
    }
  };

  // Sort and Filter Logic
  const getProcessedTrips = () => {
    let list = [...trips];

    // Local sorting
    list.sort((a, b) => {
      if (sortBy === 'startDate') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'budget') {
        return (b.budget || 0) - (a.budget || 0);
      }
      return 0;
    });

    return list;
  };

  const sortedTrips = getProcessedTrips();

  // Categorize for grouped view (Ongoing, Upcoming, Completed)
  const ongoingTrips = sortedTrips.filter((t) => getTripStatus(t) === 'ONGOING');
  const upcomingTrips = sortedTrips.filter((t) => getTripStatus(t) === 'UPCOMING');
  const completedTrips = sortedTrips.filter((t) => getTripStatus(t) === 'COMPLETED');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderTripCard = (trip: any) => {
    const status = getTripStatus(trip);
    return (
      <div
        key={trip.id}
        onClick={() => navigate(`/trips/${trip.id}/edit`)}
        className="bg-white rounded-2xl border border-purple-100/80 p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden group"
      >
        {/* Color stripe for branding status */}
        <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
          status === 'ONGOING' ? 'bg-indigo-500' : status === 'UPCOMING' ? 'bg-purple-500' : 'bg-slate-400'
        }`}></div>

        <div className="space-y-2 pl-2">
          <div className="flex items-center gap-2">
            <h4 className="text-xl font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
              {trip.name}
            </h4>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
              trip.visibility === 'PUBLIC'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {trip.visibility}
            </span>
          </div>

          {trip.description && (
            <p className="text-slate-500 text-sm line-clamp-1">{trip.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1 text-slate-500">
              🗓️ {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </span>
            <span>•</span>
            <span>📍 {trip._count?.stops || 0} Stop(s)</span>
            {trip.budget && (
              <>
                <span>•</span>
                <span className="text-purple-600 font-semibold">💳 {trip.budget.toLocaleString()} {trip.currency}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto pl-2 md:pl-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trips/${trip.id}/edit`);
            }}
            className="px-4 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-xl transition-colors"
          >
            Edit Stop Details
          </button>
          <button
            onClick={(e) => handleDeleteTrip(trip.id, e)}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-colors"
            title="Delete Trip"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
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
              onClick={() => navigate('/trips/new')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Plan a New Trip
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

      {/* Toolbar / Subheader (Screen 6 sketch) */}
      <section className="bg-white border-b border-slate-100 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="w-full md:w-96 relative">
            <input
              type="text"
              placeholder="Search bar ......"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm transition-all"
            />
            <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>

          {/* Grouping, Filtering, Sorting toolbar */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Group by */}
            <div className="flex items-center bg-slate-50 border border-purple-50 rounded-xl px-3 py-1.5">
              <span className="text-xs text-slate-500 mr-2 font-bold">Group by:</span>
              <select
                value={groupByType}
                onChange={(e) => setGroupByType(e.target.value as any)}
                className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="status">Trip Status</option>
                <option value="none">None (List All)</option>
              </select>
            </div>

            {/* Filter */}
            <div className="flex items-center bg-slate-50 border border-purple-50 rounded-xl px-3 py-1.5">
              <span className="text-xs text-slate-500 mr-2 font-bold">Filter:</span>
              <select
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value as any)}
                className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Visibilities</option>
                <option value="PRIVATE">Private Only</option>
                <option value="PUBLIC">Public Only</option>
              </select>
            </div>

            {/* Sort by */}
            <div className="flex items-center bg-slate-50 border border-purple-50 rounded-xl px-3 py-1.5">
              <span className="text-xs text-slate-500 mr-2 font-bold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="startDate">Start Date</option>
                <option value="name">Name</option>
                <option value="budget">Budget</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <svg className="animate-spin h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-semibold text-slate-500">Loading trips...</span>
          </div>
        ) : sortedTrips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-12 text-center max-w-xl mx-auto mt-12">
            <div className="text-5xl mb-4">✈️</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No trips found</h3>
            <p className="text-slate-500 text-sm mb-6">Start planning your next adventure today by creating a trip!</p>
            <button
              onClick={() => navigate('/trips/new')}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Plan a New Trip
            </button>
          </div>
        ) : groupByType === 'none' ? (
          /* Plain Un-grouped Listing */
          <div className="space-y-4 max-w-4xl mx-auto">
            {sortedTrips.map(renderTripCard)}
          </div>
        ) : (
          /* Grouped Listing (Screen 6 sketch) */
          <div className="space-y-10 max-w-4xl mx-auto">
            {/* Ongoing Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse"></span>
                <h3 className="text-lg font-black text-slate-900 tracking-wide uppercase">Ongoing</h3>
                <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {ongoingTrips.length}
                </span>
              </div>
              <div className="space-y-4">
                {ongoingTrips.length > 0 ? (
                  ongoingTrips.map(renderTripCard)
                ) : (
                  <p className="text-xs text-slate-400 font-medium italic py-2 pl-4 border-l-2 border-slate-200">
                    No active ongoing trips currently.
                  </p>
                )}
              </div>
            </div>

            {/* Up-coming Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                <h3 className="text-lg font-black text-slate-900 tracking-wide uppercase">Up-coming</h3>
                <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {upcomingTrips.length}
                </span>
              </div>
              <div className="space-y-4">
                {upcomingTrips.length > 0 ? (
                  upcomingTrips.map(renderTripCard)
                ) : (
                  <p className="text-xs text-slate-400 font-medium italic py-2 pl-4 border-l-2 border-slate-200">
                    No upcoming trips scheduled.
                  </p>
                )}
              </div>
            </div>

            {/* Completed Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-3 w-3 rounded-full bg-slate-400"></span>
                <h3 className="text-lg font-black text-slate-900 tracking-wide uppercase">Completed</h3>
                <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {completedTrips.length}
                </span>
              </div>
              <div className="space-y-4">
                {completedTrips.length > 0 ? (
                  completedTrips.map(renderTripCard)
                ) : (
                  <p className="text-xs text-slate-400 font-medium italic py-2 pl-4 border-l-2 border-slate-200">
                    No completed trips.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
