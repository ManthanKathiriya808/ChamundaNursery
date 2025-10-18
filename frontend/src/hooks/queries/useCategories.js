import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../lib/queryClient'
import useUIStore from '../../stores/uiStore'

const API_BASE = 'http://localhost:4000/api'

// API functions
const categoryAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    
    const response = await fetch(`${API_BASE}/categories?${params}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }
    return response.json()
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE}/categories/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.statusText}`)
    }
    return response.json()
  },

  create: async (categoryData) => {
    const response = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(categoryData),
    })
    if (!response.ok) {
      throw new Error(`Failed to create category: ${response.statusText}`)
    }
    return response.json()
  },

  update: async ({ id, ...categoryData }) => {
    const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(categoryData),
    })
    if (!response.ok) {
      throw new Error(`Failed to update category: ${response.statusText}`)
    }
    return response.json()
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to delete category: ${response.statusText}`)
    }
    return { success: true }
  },
}

// Query hooks
export const useCategories = (filters = {}) => {
  const { setLoading } = useUIStore()
  
  return useQuery({
    queryKey: queryKeys.categories.list(filters),
    queryFn: () => categoryAPI.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes - categories don't change often
    onSettled: () => setLoading('categories', false),
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load categories')
    },
  })
}

export const useCategory = (id) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryAPI.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load category')
    },
  })
}

// Mutation hooks
export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: categoryAPI.create,
    onSuccess: (newCategory) => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() })
      
      // Add the new category to the cache
      queryClient.setQueryData(
        queryKeys.categories.detail(newCategory.id),
        newCategory
      )
      
      showSuccess('Category created successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to create category')
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: categoryAPI.update,
    onSuccess: (updatedCategory) => {
      // Update the specific category in cache
      queryClient.setQueryData(
        queryKeys.categories.detail(updatedCategory.id),
        updatedCategory
      )
      
      // Invalidate categories list to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() })
      
      showSuccess('Category updated successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to update category')
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: categoryAPI.delete,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.categories.detail(deletedId) })
      
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() })
      
      showSuccess('Category deleted successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to delete category')
    },
  })
}

// Prefetch utilities
export const usePrefetchCategory = () => {
  const queryClient = useQueryClient()
  
  return (id) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories.detail(id),
      queryFn: () => categoryAPI.getById(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }
}