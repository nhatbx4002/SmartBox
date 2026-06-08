import { create } from 'zustand';
import { rentalService } from '../services/rental';
import { RentalWithRelations, CreateRentalPayload } from '../types';

interface RentalState {
  rentals: RentalWithRelations[];
  currentRental: RentalWithRelations | null;
  isLoading: boolean;
  error: string | null;
  fetchRentals: (params?: { page?: number; limit?: number; status?: string }) => Promise<void>;
  fetchRentalDetail: (id: string) => Promise<RentalWithRelations>;
  createRental: (payload: CreateRentalPayload) => Promise<RentalWithRelations>;
  unlockRental: (id: string) => Promise<RentalWithRelations>;
  completeRental: (id: string) => Promise<void>;
}

export const useRentalStore = create<RentalState>((set) => ({
  rentals: [],
  currentRental: null,
  isLoading: false,
  error: null,

  fetchRentals: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rentalService.getUserRentals(params);
      set({ rentals: response.data, isLoading: false });
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

  unlockRental: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await rentalService.unlockRental(id);
      const updatedRental = response.data;
      set((state) => ({
        rentals: state.rentals.map((r) => (r.id === id ? updatedRental : r)),
        currentRental: state.currentRental?.id === id ? updatedRental : state.currentRental,
        isLoading: false,
      }));
      return updatedRental;
    } catch (err: any) {
      set({ error: err.message || 'Failed to unlock locker', isLoading: false });
      throw err;
    }
  },

  completeRental: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await rentalService.completeRental(id);
      set((state) => ({
        rentals: state.rentals.map((r) =>
          r.id === id ? { ...r, status: 'COMPLETED' as any, paymentStatus: 'PAID' as any } : r
        ),
        currentRental:
          state.currentRental?.id === id
            ? { ...state.currentRental, status: 'COMPLETED' as any, paymentStatus: 'PAID' as any }
            : state.currentRental,
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to complete rental', isLoading: false });
      throw err;
    }
  },
}));
