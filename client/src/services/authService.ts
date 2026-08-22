import type { AuthResponse, CurrentUserResponse, SimpleResponse } from '../types/auth';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';

// Helper to get headers (attaches Bearer token if present)
const getHeaders = (token?: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const activeToken = token || localStorage.getItem('token');
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
};

// Helper for error handling
const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! Status: ${response.status}`);
  }
  return data;
};

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(null),
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(res);
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(null),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async logout(): Promise<SimpleResponse> {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<CurrentUserResponse> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async forgotPassword(email: string): Promise<SimpleResponse> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(null),
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  async resetPassword(token: string, newPassword: string): Promise<SimpleResponse> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(null),
      body: JSON.stringify({ token, newPassword }),
    });
    return handleResponse(res);
  },
};
