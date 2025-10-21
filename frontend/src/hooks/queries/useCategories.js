import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../lib/queryClient'
import useUIStore from '../../stores/uiStore'
import { useAuth } from '@clerk/clerk-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// API functions
const createCategoryAPI = (getToken) => ({
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    
    // Use public endpoint for categories (admin endpoint requires auth)
    const response = await fetch(`${API_BASE}/api/categories?${params}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`)
    }
    const result = await response.json()
    
    // Extract data from response object
    const data = result.data || result
    
    // Transform backend field names to frontend field names
    const transformCategories = (categories) => {
      if (!Array.isArray(categories)) return []
      
      return categories.map(category => ({
        ...category,
        parentId: category.parent_id,
        isActive: category.status === 'active',
        sortOrder: category.sort_order || 0,
        seoTitle: category.meta_title,
        seoDescription: category.meta_description
      }))
    }
    
    return transformCategories(data)
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE}/api/categories/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.statusText}`)
    }
    const data = await response.json()
    
    // Transform backend field names to frontend field names
    return {
      ...data,
      parentId: data.parent_id,
      isActive: data.status === 'active',
      sortOrder: data.sort_order || 0,
      seoTitle: data.meta_title,
      seoDescription: data.meta_description
    }
  },

  create: async (categoryData) => {
    // Generate slug if not provided
    const slug = categoryData.slug || categoryData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Transform frontend field names to backend field names
    const transformedData = {
      ...categoryData,
      slug,
      parent_id: categoryData.parentId && categoryData.parentId !== '' ? parseInt(categoryData.parentId) : null,
      status: categoryData.isActive ? 'active' : 'inactive',
      sort_order: categoryData.sortOrder || 0,
      meta_title: categoryData.seoTitle || null,
      meta_description: categoryData.seoDescription || null
    }
    
    // Remove frontend-specific fields
    delete transformedData.parentId
    delete transformedData.isActive
    delete transformedData.sortOrder
    delete transformedData.seoTitle
    delete transformedData.seoDescription
    delete transformedData.seoKeywords
    
    const token = await getToken()
    const response = await fetch(`${API_BASE}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(transformedData),
    })
    if (!response.ok) {
      throw new Error(`Failed to create category: ${response.statusText}`)
    }
    return response.json()
  },

  update: async ({ id, ...categoryData }) => {
    // Transform frontend field names to backend field names
    const transformedData = {
      ...categoryData,
      parent_id: categoryData.parentId && categoryData.parentId !== '' ? parseInt(categoryData.parentId) : null,
      status: categoryData.isActive ? 'active' : 'inactive',
      sort_order: categoryData.sortOrder || 0,
      meta_title: categoryData.seoTitle || null,
      meta_description: categoryData.seoDescription || null
    }
    
    // Remove frontend-specific fields
    delete transformedData.parentId
    delete transformedData.isActive
    delete transformedData.sortOrder
    delete transformedData.seoTitle
    delete transformedData.seoDescription
    delete transformedData.seoKeywords
    
    const token = await getToken()
    const response = await fetch(`${API_BASE}/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(transformedData),
    })
    if (!response.ok) {
      throw new Error(`Failed to update category: ${response.statusText}`)
    }
    return response.json()
  },

  delete: async (id) => {
    const token = await getToken()
    const response = await fetch(`${API_BASE}/api/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    if (!response.ok) {
      throw new Error(`Failed to delete category: ${response.statusText}`)
    }
    return { success: true }
  },
})

// Query hooks
export const useCategories = (filters = {}) => {
  const { showInactive = false, ...otherFilters } = filters;
  
  return useQuery({
    queryKey: ['categories', filters],
    queryFn: async () => {
      const filterParams = {};
      
      // Handle status filtering
      if (showInactive) {
        // Don't set status parameter to get all categories
      } else {
        filterParams.status = 'active';
      }
      
      // Add other filters
      Object.entries(otherFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          filterParams[key] = value;
        }
      });
      
      // Use the createCategoryAPI function which returns the transformed data directly
      const categoryAPI = createCategoryAPI(() => Promise.resolve(null));
      const categories = await categoryAPI.getAll(filterParams);
      return categories;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export const useCategory = (id) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => createCategoryAPI(() => Promise.resolve(null)).getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load category')
    },
  })
}

// Mutation hooks
export const useCreateCategory = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: (categoryData) => createCategoryAPI(getToken).create(categoryData),
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
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: (categoryData) => createCategoryAPI(getToken).update(categoryData),
    onSuccess: (response) => {
      // Transform the backend response to frontend format
      const updatedCategory = response.data || response
      const transformedCategory = {
        ...updatedCategory,
        parentId: updatedCategory.parent_id,
        isActive: updatedCategory.status === 'active',
        sortOrder: updatedCategory.sort_order || 0,
        seoTitle: updatedCategory.meta_title,
        seoDescription: updatedCategory.meta_description
      }
      
      // Update the specific category in cache
      queryClient.setQueryData(
        queryKeys.categories.detail(transformedCategory.id),
        transformedCategory
      )
      
      // Invalidate all categories queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
      
      showSuccess('Category updated successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to update category')
    },
  })
}

export const useDeleteCategory = () => {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: (id) => createCategoryAPI(getToken).delete(id),
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