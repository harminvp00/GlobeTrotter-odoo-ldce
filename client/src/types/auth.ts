export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'USER' | 'ADMIN';
  profilePhoto?: string | null;
}

export interface AuthResponse {
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface CurrentUserResponse {
  data: {
    user: User;
  };
}

export interface SimpleResponse {
  message: string;
}

export interface ApiError {
  error: string;
  details?: any[];
}
