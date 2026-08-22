export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  coverPhoto?: string;
  budget?: number;
  currency: string;
  visibility: 'PRIVATE' | 'PUBLIC';
  shareSlug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  countryCode?: string;
  region?: string;
  description?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  costIndex?: number;
  popularity: number;
}
