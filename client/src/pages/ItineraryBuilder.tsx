import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripService } from '../services/tripService';
import { stopService } from '../services/stopService';
import { cityService } from '../services/cityService';
import { activityService } from '../services/activityService';
import type { City } from '../types';

export const ItineraryBuilder: React.FC = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cities for adding new stops
  const [allCities, setAllCities] = useState<City[]>([]);

  // Add Stop Modal State
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [newStopCityId, setNewStopCityId] = useState('');
  const [newStopStartDate, setNewStopStartDate] = useState('');
  const [newStopEndDate, setNewStopEndDate] = useState('');
  const [newStopNotes, setNewStopNotes] = useState('');
  const [addStopError, setAddStopError] = useState<string | null>(null);

  // Edit Stop State
  const [editingStopId, setEditingStopId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

  // Activity Assign Modal State
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState<any>(null);
  const [localActivities, setLocalActivities] = useState<any[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [activityNotes, setActivityNotes] = useState('');
  const [activityError, setActivityError] = useState<string | null>(null);

  const fetchTripDetails = async () => {
    if (!tripId) return;
    try {
      const res = await tripService.getTripById(tripId);
      if (res.data) {
        setTrip(res.data);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch trip details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
    // Load all cities
    const loadCities = async () => {
      try {
        const res = await cityService.getCities();
        if (res.data) {
          setAllCities(res.data);
        }
      } catch (err) {
        console.error('Failed to load cities', err);
      }
    };
    loadCities();
  }, [tripId]);

  const handleAddStopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId || !newStopCityId || !newStopStartDate || !newStopEndDate) {
      setAddStopError('Please fill in City, Start Date, and End Date.');
      return;
    }

    if (new Date(newStopStartDate) > new Date(newStopEndDate)) {
      setAddStopError('Stop start date cannot be after end date.');
      return;
    }

    try {
      await stopService.addStop(tripId, {
        cityId: newStopCityId,
        startDate: new Date(newStopStartDate).toISOString(),
        endDate: new Date(newStopEndDate).toISOString(),
        notes: newStopNotes,
      });

      // Reset form & reload
      setShowAddStopModal(false);
      setNewStopCityId('');
      setNewStopStartDate('');
      setNewStopEndDate('');
      setNewStopNotes('');
      setAddStopError(null);
      fetchTripDetails();
    } catch (err: any) {
      setAddStopError(err?.message || 'Failed to add stop');
    }
  };

  const handleUpdateStopNotes = async (stopId: string) => {
    if (!tripId) return;
    try {
      await stopService.updateStop(tripId, stopId, {
        notes: editNotes,
      });
      setEditingStopId(null);
      fetchTripDetails();
    } catch (err: any) {
      alert(err?.message || 'Failed to update stop notes');
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    if (!tripId || !window.confirm('Are you sure you want to remove this stop from the itinerary?')) return;
    try {
      await stopService.deleteStop(tripId, stopId);
      fetchTripDetails();
    } catch (err: any) {
      alert(err?.message || 'Failed to delete stop');
    }
  };

  const openActivityModal = async (stop: any) => {
    setActiveStopForActivity(stop);
    setSelectedActivityId('');
    setActivityNotes('');
    setActivityError(null);

    // Auto-set the activity date to match stop's start date as default
    const stopStartStr = stop.startDate.split('T')[0];
    setActivityDate(stopStartStr);

    try {
      // Get all activities seeded for the stop's city
      const res = await activityService.getActivities(stop.cityId);
      if (res.data) {
        if (Array.isArray(res.data)) {
          setLocalActivities(res.data);
        } else if (res.data.activities) {
          setLocalActivities(res.data.activities);
        } else {
          setLocalActivities([]);
        }
      } else {
        setLocalActivities([]);
      }
    } catch (err) {
      console.error(err);
      setLocalActivities([]);
    }
    setShowActivityModal(true);
  };

  const handleAssignActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId || !activeStopForActivity || !selectedActivityId || !activityDate) {
      setActivityError('Please select an activity and date.');
      return;
    }

    try {
      await stopService.assignActivity(tripId, activeStopForActivity.id, {
        activityId: selectedActivityId,
        date: new Date(activityDate).toISOString(),
        notes: activityNotes,
      });

      setShowActivityModal(false);
      fetchTripDetails();
    } catch (err: any) {
      setActivityError(err?.message || 'Failed to assign activity');
    }
  };

  const handleUnassignActivity = async (stopId: string, stopActivityId: string) => {
    if (!tripId || !window.confirm('Remove this activity from the stop?')) return;
    try {
      await stopService.unassignActivity(tripId, stopId, stopActivityId);
      fetchTripDetails();
    } catch (err: any) {
      alert(err?.message || 'Failed to unassign activity');
    }
  };

  const calculateStopCost = (stop: any) => {
    if (!stop.activities || stop.activities.length === 0) return 0;
    return stop.activities.reduce((sum: number, sa: any) => {
      const cost = sa.activity?.estimatedCost ? parseFloat(sa.activity.estimatedCost) : 0;
      return sum + cost;
    }, 0);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-purple-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold text-slate-500">Loading your itinerary...</span>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 border border-red-100 max-w-md text-center shadow-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Error Loading Itinerary</h3>
          <p className="text-slate-500 text-sm mb-6">{error || 'Trip not found'}</p>
          <button
            onClick={() => navigate('/trips')}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl"
          >
            Back to My Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
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

      {/* Hero Trip Summary */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-650 text-white py-10 shadow-md">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <h2 className="text-3xl font-extrabold tracking-tight">{trip.name}</h2>
              <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-white/20 border border-white/10">
                {trip.visibility}
              </span>
            </div>
            {trip.description && <p className="text-purple-100/90 text-sm max-w-xl">{trip.description}</p>}
            <p className="text-xs text-purple-200 font-semibold">
              🗓️ {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </p>
          </div>

          {trip.budget && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">Trip Budget</span>
              <span className="text-2xl font-black">{trip.budget.toLocaleString()} {trip.currency}</span>
            </div>
          )}
        </div>
      </section>

      {/* Main Stop List (Screen 5 sketch) */}
      <main className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-wide border-b border-purple-100 pb-2">
          Itinerary Sections
        </h3>

        {trip.stops.length === 0 ? (
          <div className="bg-white rounded-2xl border border-purple-100 p-12 text-center shadow-sm">
            <p className="text-slate-500 text-sm mb-4">You have no stops set up for this trip.</p>
            <button
              onClick={() => setShowAddStopModal(true)}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl"
            >
              Add First Stop Section
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {trip.stops.map((stop: any, index: number) => {
              const stopCost = calculateStopCost(stop);
              const isEditing = editingStopId === stop.id;

              return (
                <div
                  key={stop.id}
                  className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 space-y-4 hover:border-purple-200 transition-colors relative"
                >
                  {/* Section header */}
                  <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-xs font-black text-purple-600 uppercase tracking-wider">
                        Section {index + 1}
                      </span>
                      <h4 className="text-xl font-bold text-slate-900">
                        {stop.city?.name}, {stop.city?.country}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      {/* Date Range info */}
                      <span className="text-xs bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl font-bold">
                        Date Range: {formatDate(stop.startDate)} to {formatDate(stop.endDate)}
                      </span>

                      {/* Section Budget info (sum of activities) */}
                      <span className="text-xs bg-purple-50 border border-purple-100 text-purple-700 px-3 py-1.5 rounded-xl font-bold">
                        Budget of this section: {stopCost.toLocaleString()} {trip.currency}
                      </span>
                    </div>
                  </div>

                  {/* Notes / Section Information */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Section Information (Travel, Hotel, Notes)
                    </label>

                    {isEditing ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2.5 border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl outline-none text-sm resize-none"
                        ></textarea>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingStopId(null)}
                            className="px-4 py-1.5 text-xs bg-slate-100 text-slate-600 font-bold rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdateStopNotes(stop.id)}
                            className="px-4 py-1.5 text-xs bg-purple-600 text-white font-bold rounded-lg"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-sm text-slate-600 min-h-12 leading-relaxed">
                        {stop.notes || 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity.'}
                      </div>
                    )}
                  </div>

                  {/* Stop Activities */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        Activities
                      </span>
                      <button
                        onClick={() => openActivityModal(stop)}
                        className="text-xs font-semibold text-purple-700 hover:text-purple-900 hover:underline"
                      >
                        + Assign local activity
                      </button>
                    </div>

                    {stop.activities && stop.activities.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {stop.activities.map((sa: any) => (
                          <div
                            key={sa.id}
                            className="bg-white border border-purple-50/70 p-4 rounded-xl flex items-center justify-between hover:shadow-sm transition-shadow"
                          >
                            <div>
                              <div className="font-bold text-sm text-slate-800">{sa.activity?.name}</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {sa.activity?.type} • ⏱️ {sa.activity?.durationMinutes} min
                              </div>
                              {sa.notes && (
                                <p className="text-[10px] text-slate-500 italic mt-1">Note: {sa.notes}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-purple-600">
                                {sa.activity?.estimatedCost ? `${parseFloat(sa.activity.estimatedCost).toLocaleString()} ${sa.activity.currency}` : 'Free'}
                              </span>
                              <button
                                onClick={() => handleUnassignActivity(stop.id, sa.id)}
                                className="text-red-500 hover:text-red-700 text-xs p-1"
                                title="Remove Activity"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No activities planned for this stop.</p>
                    )}
                  </div>

                  {/* Section Controls */}
                  {!isEditing && (
                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-100/50">
                      <button
                        onClick={() => {
                          setEditingStopId(stop.id);
                          setEditNotes(stop.notes || '');
                        }}
                        className="px-3.5 py-1.5 text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-lg font-bold transition-colors"
                      >
                        Edit Information
                      </button>
                      <button
                        onClick={() => handleDeleteStop(stop.id)}
                        className="px-3.5 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg font-bold transition-colors"
                      >
                        Delete Section
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Another Section Button (Screen 5 sketch) */}
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setShowAddStopModal(true)}
            className="px-8 py-3.5 bg-white border border-purple-200 hover:border-purple-300 text-purple-700 font-black text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <span className="text-lg">+</span> Add another Section
          </button>
        </div>
      </main>

      {/* Add Stop Modal */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-purple-100 max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">Add Stop Section</h3>
              <button onClick={() => setShowAddStopModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                ✕
              </button>
            </div>

            {addStopError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-semibold">
                {addStopError}
              </div>
            )}

            <form onSubmit={handleAddStopSubmit} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-700 mb-1">City *</label>
                <select
                  required
                  value={newStopCityId}
                  onChange={(e) => setNewStopCityId(e.target.value)}
                  className="px-3 py-2 border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl bg-white text-sm outline-none"
                >
                  <option value="">Select city...</option>
                  {allCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}, {city.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newStopStartDate}
                    onChange={(e) => setNewStopStartDate(e.target.value)}
                    className="px-3 py-2 border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={newStopEndDate}
                    onChange={(e) => setNewStopEndDate(e.target.value)}
                    className="px-3 py-2 border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-700 mb-1">Section Notes (Optional)</label>
                <textarea
                  placeholder="e.g. Travel tickets, hotel booking info..."
                  value={newStopNotes}
                  onChange={(e) => setNewStopNotes(e.target.value)}
                  rows={3}
                  className="px-3 py-2 border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl text-sm outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStopModal(false)}
                  className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow"
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-purple-100 max-w-md w-full shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900">Assign Local Activity</h3>
              <button onClick={() => setShowActivityModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                ✕
              </button>
            </div>

            {activityError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-semibold">
                {activityError}
              </div>
            )}

            {localActivities.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">
                No seeded activities found for this city.
              </div>
            ) : (
              <form onSubmit={handleAssignActivity} className="space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-700 mb-1">Select Activity *</label>
                  <select
                    required
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                    className="px-3 py-2 border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl bg-white text-sm outline-none"
                  >
                    <option value="">Choose activity...</option>
                    {localActivities.map((act) => (
                      <option key={act.id} value={act.id}>
                        {act.name} ({act.estimatedCost ? `${parseFloat(act.estimatedCost)} INR` : 'Free'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-700 mb-1">Activity Date *</label>
                  <input
                    type="date"
                    required
                    value={activityDate}
                    onChange={(e) => setActivityDate(e.target.value)}
                    className="px-3 py-2 border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl text-sm outline-none"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-slate-700 mb-1">Activity Notes (Optional)</label>
                  <textarea
                    placeholder="e.g. Reservation time, ticket confirmation codes..."
                    value={activityNotes}
                    onChange={(e) => setActivityNotes(e.target.value)}
                    rows={2}
                    className="px-3 py-2 border border-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-xl text-sm outline-none resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowActivityModal(false)}
                    className="px-4 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow"
                  >
                    Assign Activity
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
