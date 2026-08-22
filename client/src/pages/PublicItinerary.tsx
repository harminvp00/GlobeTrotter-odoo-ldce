import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { shareService } from '../services/shareService';

export const PublicItinerary: React.FC = () => {
  const { shareSlug } = useParams<{ shareSlug: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchSharedTrip = async () => {
      if (!shareSlug) return;
      try {
        setLoading(true);
        const res = await shareService.getPublicTrip(shareSlug);
        if (res.data) {
          setTrip(res.data);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load shared trip itinerary');
      } finally {
        setLoading(false);
      }
    };
    fetchSharedTrip();
  }, [shareSlug]);

  const handleCopyTrip = async () => {
    if (!shareSlug) return;
    if (!isLoggedIn) {
      alert('Please log in or sign up first to copy this itinerary to your account!');
      navigate('/login', { state: { from: `/shares/${shareSlug}` } });
      return;
    }

    try {
      setCopying(true);
      await shareService.copyTrip(shareSlug);
      alert('🎉 Trip itinerary copied to your account successfully!');
      navigate('/trips');
    } catch (err: any) {
      alert(err?.message || 'Failed to copy trip');
    } finally {
      setCopying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="text-4xl">🏝️</div>
        <h2 className="text-2xl font-black text-slate-800">Itinerary Not Found</h2>
        <p className="text-slate-500 max-w-md">
          {error || 'This shareable link might be expired, broken, or private.'}
        </p>
        <Link to="/login" className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all">
          Go to GlobeTrotter Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-purple-200">
              GT
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight m-0">GlobeTrotter</h1>
              <p className="text-xs text-slate-500 m-0">Shared Itinerary View</p>
            </div>
          </div>
          <div>
            {isLoggedIn ? (
              <Link to="/dashboard" className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 transition-colors">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 transition-colors">
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Panel */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Banner */}
        <section className="bg-white border border-purple-100 p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              🌍 Shared Trip Plan
            </span>
            <h2 className="text-2xl font-black text-slate-900">{trip.name}</h2>
            <p className="text-sm text-slate-500">
              ✈️ Planned by a fellow globetrotter. Duration: {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </p>
            {trip.description && <p className="text-sm text-slate-400 italic mt-2">{trip.description}</p>}
          </div>

          <button
            onClick={handleCopyTrip}
            disabled={copying}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            {copying ? 'Copying...' : '📥 Copy to My Account'}
          </button>
        </section>

        {/* Stops Timeline */}
        <section className="space-y-6">
          <h3 className="text-lg font-black text-slate-900">📍 Route Itinerary Stops</h3>
          {trip.stops && trip.stops.length > 0 ? (
            <div className="space-y-6">
              {trip.stops.map((stop: any) => (
                <div key={stop.id} className="bg-white border border-purple-100/50 p-6 rounded-2xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base">🏙️ {stop.city?.name || 'Unknown City'}</h4>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{stop.city?.country}</p>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">
                      🗓️ {new Date(stop.startDate).toLocaleDateString()} - {new Date(stop.endDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Stop Activities */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activities</h5>
                    {stop.activities && stop.activities.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {stop.activities.map((stopAct: any) => (
                          <div key={stopAct.id} className="border border-purple-50 p-4 rounded-xl space-y-2 bg-purple-50/20">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-slate-800">
                                {stopAct.activity?.name || 'Local Activity'}
                              </span>
                              <span className="text-[10px] font-bold text-purple-700">
                                {stopAct.customCost !== null ? `${stopAct.customCost} INR` : `${stopAct.activity?.estimatedCost} INR`}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-2">
                              <span>📅 {new Date(stopAct.date).toLocaleDateString()}</span>
                              {(stopAct.startTime || stopAct.endTime) && (
                                <span>
                                  • ⏰ {stopAct.startTime || '00:00'} - {stopAct.endTime || '23:59'}
                                </span>
                              )}
                            </div>
                            {stopAct.notes && (
                              <p className="text-[10px] text-slate-400 italic line-clamp-2 mt-1">
                                Notes: {stopAct.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No activities planned at this stop.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-purple-100 rounded-2xl py-10 text-center text-slate-400 text-sm">
              No stops added to this itinerary yet.
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
