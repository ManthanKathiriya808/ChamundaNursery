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

  // Admin-specific method to get all products (including drafts, inactive, etc.)
  getAllAdmin: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    
    const response = await fetch(`${API_BASE}/admin/products?${params}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch admin products: ${response.statusText}`)
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
    // Transform frontend field names to backend field names
    const transformedData = {
      name: productData.name,
      slug: productData.slug,
      description: productData.description,
      short_description: productData.shortDescription,
      specs: productData.specs ? JSON.stringify(productData.specs) : null,
      price: productData.price ? parseFloat(productData.price) : 0, // Convert to number
      compare_price: productData.comparePrice || productData.salePrice, // Map salePrice to compare_price
      inventory: productData.stock || productData.inventory, // Map stock field to inventory
      sku: productData.sku,
      weight: productData.weight,
      dimensions: productData.dimensions ? JSON.stringify(productData.dimensions) : 
                 (productData.height || productData.width || productData.length) ? 
                 JSON.stringify({
                   height: productData.height ? parseFloat(productData.height) : null,
                   width: productData.width ? parseFloat(productData.width) : null,
                   length: productData.length ? parseFloat(productData.length) : null
                 }) : null,
      category_id: productData.categoryIds?.[0], // Use first category
      tags: Array.isArray(productData.tags) ? JSON.stringify(productData.tags) : 
            typeof productData.tags === 'string' ? JSON.stringify(productData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)) : 
            null,
      status: productData.status || (productData.isActive ? 'active' : 'inactive'),
      featured: productData.featured || productData.isFeatured,
      meta_title: productData.seoTitle || productData.metaTitle, // Handle both field names
      meta_description: productData.seoDescription || productData.metaDescription, // Handle both field names
      care_instructions: productData.careInstructions,
      plant_type: productData.plantType,
      light_requirement: productData.lightRequirement || productData.sunlightRequirement, // Handle both field names
      watering_frequency: productData.wateringFrequency || productData.waterRequirement, // Handle both field names
      // Add missing new fields
      botanical_name: productData.botanicalName,
      blooming_season: productData.bloomingSeason,
      difficulty: productData.difficulty,
      low_stock_threshold: productData.lowStockThreshold ? parseInt(productData.lowStockThreshold) : 5,
    }

    // Always use FormData for admin endpoint to handle both images and regular data
    const formData = new FormData()
    
    // Add all transformed product fields to FormData
    Object.keys(transformedData).forEach(key => {
      const value = transformedData[key]
      if (value !== undefined && value !== null) {
        // Handle arrays and objects by stringifying them
        if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
        console.log(`Adding to FormData: ${key} = ${value}`)
      }
    })

    // Add categoryIds as array for admin endpoint
    if (productData.categoryIds && Array.isArray(productData.categoryIds)) {
      // For FormData, we need to append each categoryId individually
      // The backend will receive this as an array
      productData.categoryIds.forEach(categoryId => {
        formData.append('categoryIds[]', String(categoryId))
      })
      console.log('Adding categoryIds to FormData:', productData.categoryIds)
    }

    // Add image files if present
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => {
        console.log('Adding image to FormData:', image.name || 'unnamed image', 'Size:', image.size)
        formData.append('product_images', image)
      })
    }

    console.log('Sending FormData with keys:', Array.from(formData.keys()))

    const response = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYwOTQ4NTI4LCJleHAiOjE3NjEwMzQ5Mjh9.Yk3fxqomxhjOVO1XHMZVLFQXkzKmGlwQakeNPhQfC0U`,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      },
      credentials: 'include',
      body: formData,
    })
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Server response:', response.status, errorText)
      throw new Error(`Failed to create product: ${response.statusText}`)
    }
    
    const responseData = await response.json()
    console.log('Success response data:', responseData)
    return responseData
  },

  update: async ({ id, ...productData }) => {
    // Transform frontend field names to backend field names
    const transformedData = {
      name: productData.name,
      slug: productData.slug,
      description: productData.description,
      short_description: productData.shortDescription,
      specs: productData.specs ? JSON.stringify(productData.specs) : null,
      price: productData.price ? parseFloat(productData.price) : 0, // Convert to number
      compare_price: productData.comparePrice || productData.salePrice, // Map salePrice to compare_price
      inventory: productData.stock || productData.inventory, // Map stock field to inventory
      sku: productData.sku,
      weight: productData.weight,
      dimensions: productData.dimensions ? JSON.stringify(productData.dimensions) : 
                 (productData.height || productData.width || productData.length) ? 
                 JSON.stringify({
                   height: productData.height ? parseFloat(productData.height) : null,
                   width: productData.width ? parseFloat(productData.width) : null,
                   length: productData.length ? parseFloat(productData.length) : null
                 }) : null,
      category_id: productData.categoryIds?.[0], // Use first category
      tags: Array.isArray(productData.tags) ? JSON.stringify(productData.tags) : 
            typeof productData.tags === 'string' ? JSON.stringify(productData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)) : 
            null,
      status: productData.status || (productData.isActive ? 'active' : 'inactive'),
      featured: productData.featured || productData.isFeatured,
      meta_title: productData.seoTitle || productData.metaTitle, // Handle both field names
      meta_description: productData.seoDescription || productData.metaDescription, // Handle both field names
      meta_keywords: productData.metaKeywords,
      care_instructions: productData.careInstructions,
      plant_type: productData.plantType,
      light_requirement: productData.lightRequirement || productData.sunlightRequirement, // Handle both field names
      watering_frequency: productData.wateringFrequency || productData.waterRequirement, // Handle both field names
      // Add missing new fields
      botanical_name: productData.botanicalName,
      blooming_season: productData.bloomingSeason,
      difficulty: productData.difficulty,
      low_stock_threshold: productData.lowStockThreshold ? parseInt(productData.lowStockThreshold) : 5,
    }

    // Always use FormData for admin endpoint to handle both images and regular data
    const formData = new FormData()
    
    // Add all transformed product fields to FormData
    Object.keys(transformedData).forEach(key => {
      const value = transformedData[key]
      if (value !== undefined && value !== null) {
        // Handle arrays and objects by stringifying them
        if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
        console.log(`Adding to FormData: ${key} = ${value}`)
      }
    })

    // Add categoryIds as array for admin endpoint
    if (productData.categoryIds && Array.isArray(productData.categoryIds)) {
      // For FormData, we need to append each categoryId individually
      // The backend will receive this as an array
      productData.categoryIds.forEach(categoryId => {
        formData.append('categoryIds[]', String(categoryId))
      })
      console.log('Adding categoryIds to FormData:', productData.categoryIds)
    }

    // Add image files if present
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach((image) => {
        console.log('Adding image to FormData:', image.name || 'unnamed image', 'Size:', image.size)
        formData.append('product_images', image)
      })
    }

    console.log('Sending FormData with keys:', Array.from(formData.keys()))

    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzYwOTQ4NTI4LCJleHAiOjE3NjEwMzQ5Mjh9.Yk3fxqomxhjOVO1XHMZVLFQXkzKmGlwQakeNPhQfC0U`,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      },
      credentials: 'include',
      body: formData,
    })
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Server response:', response.status, errorText)
      throw new Error(`Failed to update product: ${response.statusText}`)
    }
    
    const responseData = await response.json()
    console.log('Success response data:', responseData)
    return responseData
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
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
    queryFn: async () => {
      const response = await productAPI.getAll(filters)
      // Return the products array from the nested response structure
      return response.data?.products || []
    },
    onSettled: () => setLoading('products', false),
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load products')
    },
  })
}

// Admin products hook for admin panel
export const useAdminProducts = (filters = {}) => {
  const { setLoading } = useUIStore()
  
  return useQuery({
    queryKey: ['admin-products', filters],
    queryFn: async () => {
      const response = await productAPI.getAllAdmin(filters)
      // Return the products array from the admin response structure
      // The API returns { data: [...products], pagination: {...} }
      return {
        products: response.data || [],
        pagination: response.pagination || {}
      }
    },
    onSettled: () => setLoading('products', false),
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load admin products')
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