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

export const shareService = {
  // Owner updates share status on trip
  async enableSharing(tripId: string, payload: { isShared: boolean }) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/share`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async disableSharing(tripId: string) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/share`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Public gets shared itinerary details
  async getPublicTrip(shareSlug: string) {
    const res = await fetch(`${API_BASE}/shares/${shareSlug}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Visitor duplicates shared itinerary
  async copyTrip(shareSlug: string) {
    const res = await fetch(`${API_BASE}/shares/${shareSlug}/copy`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
