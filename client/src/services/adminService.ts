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

export const adminService = {
  async getOverview() {
    const res = await fetch(`${API_BASE}/admin/overview`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getUsers(search?: string, page: number = 1, limit: number = 20) {
    let url = `${API_BASE}/admin/users?page=${page}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getPopularCities() {
    const res = await fetch(`${API_BASE}/admin/popular-cities`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getPopularActivities() {
    const res = await fetch(`${API_BASE}/admin/popular-activities`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
