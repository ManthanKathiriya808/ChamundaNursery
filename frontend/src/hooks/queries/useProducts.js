import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../lib/queryClient'
import useUIStore from '../../stores/uiStore'

const API_BASE = 'http://localhost:4000/api'

// API functions
const productAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    
    const response = await fetch(`${API_BASE}/products?${params}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`)
    }
    return response.json()
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE}/products/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`)
    }
    return response.json()
  },

  search: async (query) => {
    const response = await fetch(`${API_BASE}/products/search?q=${encodeURIComponent(query)}`)
    if (!response.ok) {
      throw new Error(`Failed to search products: ${response.statusText}`)
    }
    return response.json()
  },

  create: async (productData) => {
    const response = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(productData),
    })
    if (!response.ok) {
      throw new Error(`Failed to create product: ${response.statusText}`)
    }
    return response.json()
  },

  update: async ({ id, ...productData }) => {
    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(productData),
    })
    if (!response.ok) {
      throw new Error(`Failed to update product: ${response.statusText}`)
    }
    return response.json()
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to delete product: ${response.statusText}`)
    }
    return { success: true }
  },
}

// Query hooks
export const useProducts = (filters = {}) => {
  const { setLoading } = useUIStore()
  
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productAPI.getAll(filters),
    onSettled: () => setLoading('products', false),
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load products')
    },
  })
}

export const useProduct = (id) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productAPI.getById(id),
    enabled: !!id,
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load product')
    },
  })
}

export const useProductSearch = (query) => {
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: () => productAPI.search(query),
    enabled: !!query && query.length > 2,
    staleTime: 1000 * 30, // 30 seconds
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Search failed')
    },
  })
}

// Mutation hooks
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: productAPI.create,
    onSuccess: (newProduct) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
      
      // Add the new product to the cache
      queryClient.setQueryData(
        queryKeys.products.detail(newProduct.id),
        newProduct
      )
      
      showSuccess('Product created successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to create product')
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: productAPI.update,
    onSuccess: (updatedProduct) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        queryKeys.products.detail(updatedProduct.id),
        updatedProduct
      )
      
      // Invalidate products list to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
      
      showSuccess('Product updated successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to update product')
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: productAPI.delete,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(deletedId) })
      
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() })
      
      showSuccess('Product deleted successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to delete product')
    },
  })
}

// Prefetch utilities
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient()
  
  return (id) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(id),
      queryFn: () => productAPI.getById(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }
}