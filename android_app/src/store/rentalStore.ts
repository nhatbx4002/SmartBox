import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { rentalService } from '../services/rental';
import { RentalWithRelations, CreateRentalPayload } from '../types';

interface RentalState {
  rentals: RentalWithRelations[];
  currentRental: RentalWithRelations | null;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  fetchRentals: (params?: { page?: number; limit?: number; status?: string }) => Promise<void>;
  fetchRentalDetail: (id: string) => Promise<RentalWithRelations>;
  createRental: (payload: CreateRentalPayload) => Promise<RentalWithRelations>;
  completeRental: (id: string) => Promise<void>;
}

export const useRentalStore = create<RentalState>()(
  persist(
    (set) => ({
  rentals: [],
  currentRental: null,
  isLoading: false,
  error: null,
  _hasHydrated: false,
  setHasHydrated: (v) => set({ _hasHydrated: v }),

  fetchRentals: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rentalService.getUserRentals(params);
      set({ rentals: response.data ?? [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch rentals', isLoading: false });
    }
  },

  fetchRentalDetail: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rentalService.getRentalById(id);
      set({ currentRental: response.data, isLoading: false });
      return response.data;
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch rental detail', isLoading: false });
      throw err;
    }
  },

  createRental: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rentalService.createRental(payload);
      const newRental = response.data.rental;
      set((state) => ({
        rentals: [newRental, ...state.rentals],
        currentRental: newRental,
        isLoading: false,
      }));
      return newRental;
    } catch (err: any) {
      set({ error: err.message || 'Failed to create rental', isLoading: false });
      throw err;
    }
  },

  completeRental: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await rentalService.completeRental(id);
      const detailResponse = await rentalService.getRentalById(id);
      const updatedRental = detailResponse.data;
      set((state) => ({
        rentals: state.rentals.map((r) => (r.id === id ? updatedRental : r)),
        currentRental: state.currentRental?.id === id ? updatedRental : state.currentRental,
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to complete rental', isLoading: false });
      throw err;
    }
  },
    }),
    {
      name: 'smartbox-rental-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ rentals: state.rentals }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    },
  )
);
