import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';

export const ProfileSettings: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>({ name: '', email: '' });
  const [password, setPassword] = useState('');
  const [preferences, setPreferences] = useState<any>({
    homeAirport: '',
    travelStyle: 'LEISURE',
    foodPreference: 'NONE',
    hotelPreference: 'MID_RANGE',
    budgetLevel: 'MODERATE',
  });
  const [savedDestinations, setSavedDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const fetchProfileAndPreferences = async () => {
    try {
      setLoading(true);
      const [profRes, prefRes, savedRes] = await Promise.all([
        profileService.getProfile(),
        profileService.getPreferences(),
        profileService.getSavedDestinations(),
      ]);

      if (profRes.data) {
        setProfile({ name: profRes.data.name || '', email: profRes.data.email || '' });
      }
      if (prefRes.data) {
        setPreferences({
          homeAirport: prefRes.data.homeAirport || '',
          travelStyle: prefRes.data.travelStyle || 'LEISURE',
          foodPreference: prefRes.data.foodPreference || 'NONE',
          hotelPreference: prefRes.data.hotelPreference || 'MID_RANGE',
          budgetLevel: prefRes.data.budgetLevel || 'MODERATE',
        });
      }
      if (savedRes.data) {
        setSavedDestinations(savedRes.data);
      }
    } catch (err: any) {
      setMsg({ text: err?.message || 'Failed to fetch settings', isError: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndPreferences();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      const payload: any = { name: profile.name, email: profile.email };
      if (password) payload.password = password;

      await profileService.updateProfile(payload);
      setMsg({ text: 'Profile details updated successfully!', isError: false });
      setPassword('');
    } catch (err: any) {
      setMsg({ text: err?.message || 'Failed to update profile', isError: true });
    }
  };

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      await profileService.updatePreferences(preferences);
      setMsg({ text: 'Travel preferences updated successfully!', isError: false });
    } catch (err: any) {
      setMsg({ text: err?.message || 'Failed to update preferences', isError: true });
    }
  };

  const handleDeleteSavedDestination = async (savedId: string) => {
    try {
      await profileService.deleteSavedDestination(savedId);
      setSavedDestinations((prev) => prev.filter((d) => d.id !== savedId));
      setMsg({ text: 'Saved destination removed!', isError: false });
    } catch (err: any) {
      setMsg({ text: err?.message || 'Failed to remove destination', isError: true });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        '⚠️ Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.'
      )
    ) {
      try {
        await profileService.deleteAccount();
        logout();
        navigate('/login');
      } catch (err: any) {
        alert(err?.message || 'Failed to delete account');
      }
    }
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
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">⚙️ Settings & Preferences</h2>
          <button
            onClick={handleDeleteAccount}
            className="text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200/50 px-3 py-1.5 rounded-xl transition-all"
          >
            Delete Account
          </button>
        </div>

        {msg && (
          <div
            className={`p-4 border rounded-2xl text-sm font-semibold ${
              msg.isError
                ? 'bg-red-50 border-red-100 text-red-700'
                : 'bg-green-50 border-green-100 text-green-700'
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Form */}
          <section className="bg-white border border-purple-100/60 p-6 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">👤 Profile Details</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-purple-100/70 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-50 border border-purple-100/70 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Leave blank to keep current"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-purple-100/70 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors uppercase tracking-wider"
              >
                Save Profile
              </button>
            </form>
          </section>

          {/* Preferences Form */}
          <section className="bg-white border border-purple-100/60 p-6 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">✈️ Travel Preferences</h3>
            <form onSubmit={handleUpdatePreferences} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Home Airport</label>
                <input
                  type="text"
                  placeholder="e.g. BOM, DEL, CDG"
                  value={preferences.homeAirport}
                  onChange={(e) => setPreferences({ ...preferences, homeAirport: e.target.value })}
                  className="w-full bg-slate-50 border border-purple-100/70 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Travel Style</label>
                <select
                  value={preferences.travelStyle}
                  onChange={(e) => setPreferences({ ...preferences, travelStyle: e.target.value })}
                  className="w-full bg-slate-50 border border-purple-100/70 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                >
                  <option value="LEISURE">Leisure</option>
                  <option value="ADVENTURE">Adventure</option>
                  <option value="BUSINESS">Business</option>
                  <option value="BACKPACKING">Backpacking</option>
                  <option value="FAMILY">Family</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Food Preference</label>
                <select
                  value={preferences.foodPreference}
                  onChange={(e) => setPreferences({ ...preferences, foodPreference: e.target.value })}
                  className="w-full bg-slate-50 border border-purple-100/70 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                >
                  <option value="NONE">No preference</option>
                  <option value="VEGETARIAN">Vegetarian</option>
                  <option value="VEGAN">Vegan</option>
                  <option value="HALAL">Halal</option>
                  <option value="GLUTEN_FREE">Gluten Free</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hotel Preference</label>
                <select
                  value={preferences.hotelPreference}
                  onChange={(e) => setPreferences({ ...preferences, hotelPreference: e.target.value })}
                  className="w-full bg-slate-50 border border-purple-100/70 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                >
                  <option value="BUDGET">Budget / Hostels</option>
                  <option value="MID_RANGE">Mid Range / Hotels</option>
                  <option value="LUXURY">Luxury Resorts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Budget Level</label>
                <select
                  value={preferences.budgetLevel}
                  onChange={(e) => setPreferences({ ...preferences, budgetLevel: e.target.value })}
                  className="w-full bg-slate-50 border border-purple-100/70 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                >
                  <option value="LOW">Low</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors uppercase tracking-wider"
              >
                Save Preferences
              </button>
            </form>
          </section>
        </div>

        {/* Saved Destinations List */}
        <section className="bg-white border border-purple-100/60 p-6 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">📌 Saved Destinations</h3>
          {savedDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {savedDestinations.map((d: any) => (
                <div
                  key={d.id}
                  className="border border-purple-50 p-4 rounded-2xl flex items-center justify-between hover:border-purple-100 transition-colors"
                >
                  <div>
                    <div className="font-extrabold text-sm text-slate-800">{d.city?.name}</div>
                    <div className="text-[10px] text-slate-400">{d.city?.country}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteSavedDestination(d.id)}
                    className="h-8 w-8 text-red-500 hover:bg-red-50 border border-red-50/50 rounded-lg flex items-center justify-center font-bold text-xs"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm italic">
              No saved destinations yet. Save one from the dashboard recommendations!
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
