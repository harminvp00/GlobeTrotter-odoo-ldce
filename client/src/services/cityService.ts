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

export const cityService = {
  async searchCities(query: string) {
    const res = await fetch(`${API_BASE}/cities?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getCities() {
    const res = await fetch(`${API_BASE}/cities`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
