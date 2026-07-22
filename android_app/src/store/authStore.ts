import { create } from 'zustand';
import { authService } from '../services/auth';
import { setUnauthorizedHandler } from '../services/api';
import { userService } from '../services/user';
import { tokenStorage } from '../services/tokenStorage';
import { User, LoginPayload, RegisterPayload } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<boolean>;
  updateProfile: (name?: string, email?: string, password?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.login(payload);
      set({
        user: result.user,
        accessToken: result.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.register(payload);
      set({
        user: result.user,
        accessToken: result.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  loadFromStorage: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await tokenStorage.getAccessToken();
      const refreshToken = await tokenStorage.getRefreshToken();

      if (token && refreshToken) {
        try {
          const profileResponse = await userService.getProfile();
          set({
            user: profileResponse.data,
            accessToken: token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (err) {
          console.error('Failed to load user profile with current token:', err);
          await tokenStorage.clearTokens();
        }
      }

      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      return false;
    } catch {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },

  updateProfile: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userService.updateProfile({ name, email, password });
      set({ user: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update profile', isLoading: false });
      throw err;
    }
  },
}));

setUnauthorizedHandler(() => {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: 'Session expired. Please log in again.',
  });
});
