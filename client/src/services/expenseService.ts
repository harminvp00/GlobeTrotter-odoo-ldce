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

export const expenseService = {
  async getExpenses(tripId: string) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/expenses`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createExpense(tripId: string, expenseData: {
    category: string;
    description: string;
    amount: number;
    currency?: string;
    date: string;
    tripStopId?: string | null;
  }) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/expenses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(expenseData),
    });
    return handleResponse(res);
  },

  async deleteExpense(tripId: string, expenseId: string) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/expenses/${expenseId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
