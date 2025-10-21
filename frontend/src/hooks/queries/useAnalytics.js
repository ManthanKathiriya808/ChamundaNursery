/**
 * Analytics Hooks for Admin Dashboard
 * React Query hooks for fetching admin analytics data
 */

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react'
import { useUIStore } from '../../stores/uiStore'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Create analytics API with authentication
const createAnalyticsAPI = (getToken) => ({
  async getDashboardAnalytics() {
    const token = await getToken()
    const response = await fetch(`${API_BASE}/api/admin/analytics/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard analytics: ${response.status}`)
    }
    
    return response.json()
  },

  async getSalesAnalytics() {
    const token = await getToken()
    const response = await fetch(`${API_BASE}/api/admin/analytics/sales`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sales analytics: ${response.status}`)
    }
    
    return response.json()
  }
})

/**
 * Hook to fetch dashboard analytics data
 */
export const useDashboardAnalytics = () => {
  const { getToken } = useAuth()
  const analyticsAPI = createAnalyticsAPI(getToken)
  
  return useQuery({
    queryKey: ['admin-analytics', 'dashboard'],
    queryFn: () => analyticsAPI.getDashboardAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load dashboard analytics')
    },
  })
}

/**
 * Hook to fetch sales analytics data
 */
export const useSalesAnalytics = () => {
  const { getToken } = useAuth()
  const analyticsAPI = createAnalyticsAPI(getToken)
  
  return useQuery({
    queryKey: ['admin-analytics', 'sales'],
    queryFn: () => analyticsAPI.getSalesAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load sales analytics')
    },
  })
}