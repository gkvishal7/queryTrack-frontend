import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, type AuthResponse } from '../utils/auth';

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    emailId: string;
    username: string;
    department: string;
    phoneNumber: string;
    role: 'USER' | 'ADMIN';
  } | null;
  tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  // Actions
  login: (emailId: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    emailId: string;
    phoneNumber: string;
    department: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuthStatus: () => boolean;
  getUserRole: () => 'USER' | 'ADMIN' | null;
  isAdmin: () => boolean;
}

// Combined store type
export type AuthStore = AuthState & AuthActions;

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  tokens: {
    accessToken: null,
    refreshToken: null,
  },
  isLoading: false,
  error: null,
};

// Create auth store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Login action
      login: async (emailId: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response: AuthResponse = await authService.login({ emailId, password });
          
          set({
            isAuthenticated: true,
            user: {
              emailId: response.data.emailId,
              username: response.data.username,
              department: response.data.department,
              phoneNumber: response.data.phoneNumber,
              role: response.data.role as 'USER' | 'ADMIN',
            },
            tokens: {
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            },
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isAuthenticated: false,
            user: null,
            tokens: { accessToken: null, refreshToken: null },
            isLoading: false,
            error: error.message || 'Login failed',
          });
          throw error;
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response: AuthResponse = await authService.register(userData);
          
          set({
            isAuthenticated: true,
            user: {
              emailId: response.data.emailId,
              username: response.data.username,
              department: response.data.department,
              phoneNumber: response.data.phoneNumber,
              role: response.data.role as 'USER' | 'ADMIN',
            },
            tokens: {
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
            },
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isAuthenticated: false,
            user: null,
            tokens: { accessToken: null, refreshToken: null },
            isLoading: false,
            error: error.message || 'Registration failed',
          });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true });
        
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            isAuthenticated: false,
            user: null,
            tokens: { accessToken: null, refreshToken: null },
            isLoading: false,
            error: null,
          });
        }
      },

      // Refresh token action
      refreshToken: async () => {
        const { tokens } = get();
        if (!tokens.refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          // This will be handled by the API interceptor
          // We just need to update the tokens when they're refreshed
          const newAccessToken = localStorage.getItem('accessToken');
          const newRefreshToken = localStorage.getItem('refreshToken');
          
          if (newAccessToken) {
            set({
              tokens: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken || tokens.refreshToken,
              },
            });
          }
        } catch (error) {
          // If refresh fails, logout the user
          get().logout();
          throw error;
        }
      },

      // Clear error action
      clearError: () => set({ error: null }),

      // Set loading action
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      // Set error action
      setError: (error: string | null) => set({ error }),

      // Utility actions
      checkAuthStatus: () => {
        const { isAuthenticated, tokens } = get();
        return isAuthenticated && !!tokens.accessToken;
      },

      getUserRole: () => {
        const { user } = get();
        return user?.role || null;
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'ADMIN';
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        tokens: state.tokens,
      }),
    }
  )
);
