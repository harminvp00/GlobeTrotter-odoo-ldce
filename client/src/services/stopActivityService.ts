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

export const stopActivityService = {
  async assignActivity(stopId: string, activityData: {
    activityId: string;
    date: string;
    startTime?: string;
    endTime?: string;
    order?: number;
    customCost?: number;
    notes?: string;
  }) {
    const res = await fetch(`${API_BASE}/stops/${stopId}/activities`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(activityData),
    });
    return handleResponse(res);
  },

  async getStopActivities(stopId: string) {
    const res = await fetch(`${API_BASE}/stops/${stopId}/activities`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateStopActivity(stopId: string, stopActivityId: string, activityData: Partial<{
    activityId: string;
    date: string;
    startTime: string | null;
    endTime: string | null;
    order: number;
    customCost: number | null;
    notes: string;
  }>) {
    const res = await fetch(`${API_BASE}/stops/${stopId}/activities/${stopActivityId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(activityData),
    });
    return handleResponse(res);
  },

  async deleteStopActivity(stopId: string, stopActivityId: string) {
    const res = await fetch(`${API_BASE}/stops/${stopId}/activities/${stopActivityId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
