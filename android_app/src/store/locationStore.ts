import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { locationService, LocationListItem, UserLocationDetail } from '../services/location';
import { PricePlan } from '../types';

interface LocationState {
  locations: LocationListItem[];
  selectedLocation: UserLocationDetail | null;
  plans: PricePlan[];
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  fetchLocations: (lat?: number, lng?: number) => Promise<void>;
  fetchLocationDetail: (id: string) => Promise<UserLocationDetail>;
  fetchPlans: (size?: 'SMALL' | 'LARGE') => Promise<void>;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
  locations: [],
  selectedLocation: null,
  plans: [],
  isLoading: false,
  error: null,
  _hasHydrated: false,
  setHasHydrated: (v) => set({ _hasHydrated: v }),

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
    }),
    {
      name: 'smartbox-location-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ locations: state.locations, plans: state.plans }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  )
);
