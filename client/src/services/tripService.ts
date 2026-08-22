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

export const tripService = {
  async createTrip(tripData: {
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    budget?: number;
    currency?: string;
    visibility?: 'PRIVATE' | 'PUBLIC';
  }) {
    const res = await fetch(`${API_BASE}/trips`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(tripData),
    });
    return handleResponse(res);
  },

  async getTrips(search?: string, visibility?: 'PRIVATE' | 'PUBLIC', page: number = 1, limit: number = 20) {
    let url = `${API_BASE}/trips?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (visibility) url += `&visibility=${encodeURIComponent(visibility)}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getTripById(id: string) {
    const res = await fetch(`${API_BASE}/trips/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateTrip(id: string, tripData: Partial<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    budget: number;
    currency: string;
    visibility: 'PRIVATE' | 'PUBLIC';
  }>) {
    const res = await fetch(`${API_BASE}/trips/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(tripData),
    });
    return handleResponse(res);
  },

  async deleteTrip(id: string) {
    const res = await fetch(`${API_BASE}/trips/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
