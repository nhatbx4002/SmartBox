import { api } from './api';
import { ApiResponse, PricePlan } from '../types';

export interface LocationListItem {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId: string | null;
  mapImageUrl: string | null;
  distance: number | null;
  availableSmall: number;
  availableLarge: number;
  availableCount: number;
  totalSmall: number;
  totalLarge: number;
  totalCount: number;
  onlineCabinets: number;
  status: 'online' | 'offline';
}

export interface CabinetDetail {
  id: string;
  name: string;
  status: string;
  isOnline: boolean;
  lastHeartbeatAt: string | null;
  compartments: {
    id: string;
    name: string;
    size: 'SMALL' | 'LARGE';
    status: string;
  }[];
}

export interface UserLocationDetail {
  id: string;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  googlePlaceId: string | null;
  mapImageUrl: string | null;
  status: string;
  cabinets: CabinetDetail[];
}

export const locationService = {
  async getLocations(lat?: number, lng?: number): Promise<ApiResponse<LocationListItem[]>> {
    const query = lat !== undefined && lng !== undefined ? `?lat=${lat}&lng=${lng}` : '';
    return await api.get<ApiResponse<LocationListItem[]>>(`/api/users/me/locations${query}`);
  },

  async getLocationDetail(id: string): Promise<ApiResponse<UserLocationDetail>> {
    return await api.get<ApiResponse<UserLocationDetail>>(`/api/users/me/locations/${id}`);
  },

  async getPlans(size?: 'SMALL' | 'LARGE'): Promise<ApiResponse<PricePlan[]>> {
    const query = size ? `?size=${size}` : '';
    return await api.get<ApiResponse<PricePlan[]>>(`/api/plans${query}`);
  },
};
