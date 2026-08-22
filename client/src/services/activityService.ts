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

export const activityService = {
  async getActivities(cityId?: string, type?: string, query?: string) {
    let url = `${API_BASE}/activities?`;
    if (cityId) url += `cityId=${encodeURIComponent(cityId)}&`;
    if (type) url += `type=${encodeURIComponent(type)}&`;
    if (query) url += `q=${encodeURIComponent(query)}&`;

    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
