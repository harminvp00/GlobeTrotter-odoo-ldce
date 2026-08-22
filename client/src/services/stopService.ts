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

export const stopService = {
  async addStop(tripId: string, stopData: {
    cityId: string;
    startDate: string;
    endDate: string;
    notes?: string;
    order?: number;
  }) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/stops`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(stopData),
    });
    return handleResponse(res);
  },

  async getStops(tripId: string) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/stops`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateStop(tripId: string, stopId: string, stopData: Partial<{
    cityId: string;
    startDate: string;
    endDate: string;
    notes: string;
    order: number;
  }>) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/stops/${stopId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(stopData),
    });
    return handleResponse(res);
  },

  async deleteStop(tripId: string, stopId: string) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/stops/${stopId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async assignActivity(tripId: string, stopId: string, activityData: { activityId: string; date: string; notes?: string }) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(activityData),
    });
    return handleResponse(res);
  },

  async unassignActivity(tripId: string, stopId: string, stopActivityId: string) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/stops/${stopId}/activities/${stopActivityId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
