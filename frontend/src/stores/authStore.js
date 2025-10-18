import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => set({ token }),
      
      setAuth: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: !!user,
        error: null 
      }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: null 
      }),
      
      clearError: () => set({ error: null }),
      
      // Getters
      getUser: () => get().user,
      getToken: () => get().token,
      isAdmin: () => get().user?.role === 'admin',
      isCustomer: () => get().user?.role === 'customer',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)

export default useAuthStore