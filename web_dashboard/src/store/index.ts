import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Admin } from '@/types'

interface AuthState {
  admin: Admin | null
  token: string | null
  isAuthenticated: boolean
  login: (admin: Admin, token: string) => void
  logout: () => void
}

const unauthenticatedState = {
  admin: null,
  token: null,
  isAuthenticated: false,
}

function isLikelyJwt(token: string) {
  return token.split('.').length === 3
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...unauthenticatedState,
      login: (admin, token) => set({ admin, token, isAuthenticated: true }),
      logout: () => set(unauthenticatedState),
    }),
    {
      name: 'smartbox-auth',
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as Partial<AuthState> | undefined
        if (!state?.token || !isLikelyJwt(state.token)) return unauthenticatedState
        return {
          admin: state.admin ?? null,
          token: state.token,
          isAuthenticated: Boolean(state.admin && state.token),
        }
      },
    },
  ),
)

interface UIState {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}))
