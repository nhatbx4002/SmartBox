import { create } from 'zustand';
import { locationService, LocationListItem, UserLocationDetail } from '../services/location';
import { PricePlan } from '../types';

interface LocationState {
  locations: LocationListItem[];
  selectedLocation: UserLocationDetail | null;
  plans: PricePlan[];
  isLoading: boolean;
  error: string | null;
  fetchLocations: (lat?: number, lng?: number) => Promise<void>;
  fetchLocationDetail: (id: string) => Promise<UserLocationDetail>;
  fetchPlans: (size?: 'SMALL' | 'LARGE') => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  locations: [],
  selectedLocation: null,
  plans: [],
  isLoading: false,
  error: null,

  fetchLocations: async (lat, lng) => {
    set({ isLoading: true, error: null });
    try {
      const response = await locationService.getLocations(lat, lng);
      set({ locations: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch locations', isLoading: false });
    }
  },

  fetchLocationDetail: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await locationService.getLocationDetail(id);
      set({ selectedLocation: response.data, isLoading: false });
      return response.data;
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch location detail', isLoading: false });
      throw err;
    }
  },

  fetchPlans: async (size) => {
    set({ error: null });
    try {
      const response = await locationService.getPlans(size);
      set({ plans: response.data });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch price plans' });
    }
  },
}));
