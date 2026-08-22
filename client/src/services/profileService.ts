const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }
  return data;
};

export const profileService = {
  async getProfile() {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateProfile(profileData: { name?: string; email?: string; password?: string }) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },

  async deleteAccount() {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getPreferences() {
    const res = await fetch(`${API_BASE}/profile/preferences`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updatePreferences(preferencesData: {
    homeAirport?: string;
    travelStyle?: string;
    foodPreference?: string;
    hotelPreference?: string;
    budgetLevel?: string;
  }) {
    const res = await fetch(`${API_BASE}/profile/preferences`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(preferencesData),
    });
    return handleResponse(res);
  },

  async getSavedDestinations() {
    const res = await fetch(`${API_BASE}/profile/saved-destinations`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async addSavedDestination(cityId: string, notes?: string) {
    const res = await fetch(`${API_BASE}/profile/saved-destinations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ cityId, notes }),
    });
    return handleResponse(res);
  },

  async deleteSavedDestination(savedId: string) {
    const res = await fetch(`${API_BASE}/profile/saved-destinations/${savedId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
