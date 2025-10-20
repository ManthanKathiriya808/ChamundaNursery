import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../lib/queryClient'
import useUIStore from '../../stores/uiStore'

const API_BASE = 'http://localhost:4000/api'

// API functions
const userAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    
    const response = await fetch(`${API_BASE}/admin/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`)
    }
    return response.json()
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE}/admin/users/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`)
    }
    return response.json()
  },

  create: async (userData) => {
    const response = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`)
    }
    return response.json()
  },

  update: async ({ id, ...userData }) => {
    const response = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`)
    }
    return response.json()
  },

  updateRole: async ({ id, role }) => {
    const response = await fetch(`${API_BASE}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
      body: JSON.stringify({ role }),
    })
    if (!response.ok) {
      throw new Error(`Failed to update user role: ${response.statusText}`)
    }
    return response.json()
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`)
    }
    return { success: true }
  },

  toggleStatus: async ({ id, isActive }) => {
    const response = await fetch(`${API_BASE}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
      body: JSON.stringify({ isActive }),
    })
    if (!response.ok) {
      throw new Error(`Failed to update user status: ${response.statusText}`)
    }
    return response.json()
  },
}

// Query hooks
export const useUsers = (filters = {}) => {
  const { setLoading } = useUIStore()
  
  return useQuery({
    queryKey: ['users', 'list', filters],
    queryFn: () => userAPI.getAll(filters),
    onSettled: () => setLoading('users', false),
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load users')
    },
  })
}

export const useUser = (id) => {
  return useQuery({
    queryKey: ['users', 'detail', id],
    queryFn: () => userAPI.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load user')
    },
  })
}

// Mutation hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: userAPI.create,
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
      
      // Add the new user to the cache
      queryClient.setQueryData(
        ['users', 'detail', newUser.id],
        newUser
      )
      
      showSuccess('User created successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to create user')
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: userAPI.update,
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(
        ['users', 'detail', updatedUser.id],
        updatedUser
      )
      
      // Invalidate users list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
      
      showSuccess('User updated successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to update user')
    },
  })
}

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: userAPI.updateRole,
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(
        ['users', 'detail', updatedUser.id],
        updatedUser
      )
      
      // Invalidate users list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
      
      showSuccess('User role updated successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to update user role')
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: userAPI.delete,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['users', 'detail', deletedId] })
      
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
      
      showSuccess('User deleted successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to delete user')
    },
  })
}

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: userAPI.toggleStatus,
    onSuccess: (updatedUser) => {
      // Update the specific user in cache
      queryClient.setQueryData(
        ['users', 'detail', updatedUser.id],
        updatedUser
      )
      
      // Invalidate users list to reflect changes
      queryClient.invalidateQueries({ queryKey: ['users', 'list'] })
      
      showSuccess(`User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully!`)
    },
    onError: (error) => {
      showError(error.message, 'Failed to update user status')
    },
  })
}