import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../lib/queryClient'
import useUIStore from '../../stores/uiStore'
import useAuthStore from '../../stores/authStore'

const API_BASE = 'http://localhost:4000/api'

// API functions
const orderAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    
    const response = await fetch(`${API_BASE}/admin/orders?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`)
    }
    return response.json()
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`)
    }
    return response.json()
  },

  getUserOrders: async (userId) => {
    const response = await fetch(`${API_BASE}/orders/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch user orders: ${response.statusText}`)
    }
    return response.json()
  },

  create: async (orderData) => {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(orderData),
    })
    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`)
    }
    return response.json()
  },

  updateStatus: async ({ id, status }) => {
    const response = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.statusText}`)
    }
    return response.json()
  },

  cancel: async (id) => {
    const response = await fetch(`${API_BASE}/orders/${id}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to cancel order: ${response.statusText}`)
    }
    return response.json()
  },
}

// Query hooks
export const useOrders = (filters = {}) => {
  const { setLoading } = useUIStore()
  
  return useQuery({
    queryKey: queryKeys.orders.list(filters),
    queryFn: () => orderAPI.getAll(filters),
    onSettled: () => setLoading('orders', false),
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load orders')
    },
  })
}

export const useOrder = (id) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderAPI.getById(id),
    enabled: !!id,
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load order')
    },
  })
}

export const useUserOrders = (userId) => {
  return useQuery({
    queryKey: queryKeys.orders.user(userId),
    queryFn: () => orderAPI.getUserOrders(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load your orders')
    },
  })
}

// Current user's orders
export const useMyOrders = () => {
  const { user } = useAuthStore()
  return useUserOrders(user?.id)
}

// Mutation hooks
export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: orderAPI.create,
    onSuccess: (newOrder) => {
      // Invalidate orders lists
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
      
      // Invalidate user orders
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.user(user.id) })
      }
      
      // Add the new order to the cache
      queryClient.setQueryData(
        queryKeys.orders.detail(newOrder.id),
        newOrder
      )
      
      showSuccess('Order placed successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to place order')
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: orderAPI.updateStatus,
    onSuccess: (updatedOrder) => {
      // Update the specific order in cache
      queryClient.setQueryData(
        queryKeys.orders.detail(updatedOrder.id),
        updatedOrder
      )
      
      // Invalidate orders list to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
      
      // Invalidate user orders if applicable
      if (updatedOrder.user_id) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.orders.user(updatedOrder.user_id) 
        })
      }
      
      showSuccess('Order status updated successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to update order status')
    },
  })
}

export const useCancelOrder = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: orderAPI.cancel,
    onSuccess: (cancelledOrder) => {
      // Update the specific order in cache
      queryClient.setQueryData(
        queryKeys.orders.detail(cancelledOrder.id),
        cancelledOrder
      )
      
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() })
      
      // Invalidate user orders
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.user(user.id) })
      }
      
      showSuccess('Order cancelled successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to cancel order')
    },
  })
}

// Prefetch utilities
export const usePrefetchOrder = () => {
  const queryClient = useQueryClient()
  
  return (id) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.orders.detail(id),
      queryFn: () => orderAPI.getById(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }
}