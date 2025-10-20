/**
 * Comprehensive API Service Layer for Chamunda Nursery
 * Handles all API communications with proper error handling, loading states, and caching
 */

const API_BASE = 'http://localhost:4000/api'

// Helper function for API requests with error handling
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Request failed for ${url}:`, error)
    throw error
  }
}

/**
 * Products API Service
 */
export const productsAPI = {
  // Get all products with filtering and pagination
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    return apiRequest(`/products?${params}`)
  },

  // Get single product by ID
  getById: async (id) => {
    return apiRequest(`/products/${id}`)
  },

  // Search products
  search: async (query, filters = {}) => {
    const params = new URLSearchParams({ q: query })
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    return apiRequest(`/products/search?${params}`)
  },

  // Get featured products
  getFeatured: async (limit = 8) => {
    return apiRequest(`/products/featured?limit=${limit}`)
  },

  // Get related products
  getRelated: async (productId, limit = 4) => {
    return apiRequest(`/products/${productId}/related?limit=${limit}`)
  },
}

/**
 * Categories API Service
 */
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    return apiRequest('/categories')
  },

  // Get category by ID with products
  getById: async (id) => {
    return apiRequest(`/categories/${id}`)
  },

  // Get category products
  getProducts: async (categoryId, filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    return apiRequest(`/categories/${categoryId}/products?${params}`)
  },
}

/**
 * Blog/Articles API Service
 */
export const blogAPI = {
  // Get all blog posts
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v))
        } else {
          params.append(key, value)
        }
      }
    })
    return apiRequest(`/blog?${params}`)
  },

  // Get single blog post
  getById: async (id) => {
    return apiRequest(`/blog/${id}`)
  },

  // Search blog posts
  search: async (query, filters = {}) => {
    const params = new URLSearchParams({ q: query })
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    return apiRequest(`/blog/search?${params}`)
  },

  // Get featured blog posts
  getFeatured: async (limit = 3) => {
    return apiRequest(`/blog/featured?limit=${limit}`)
  },
}

/**
 * Plant Care API Service
 */
export const plantCareAPI = {
  // Get all plant care articles
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    return apiRequest(`/plant-care?${params}`)
  },

  // Get single plant care article
  getById: async (id) => {
    return apiRequest(`/plant-care/${id}`)
  },

  // Search plant care articles
  search: async (query) => {
    return apiRequest(`/plant-care/search?q=${encodeURIComponent(query)}`)
  },
}

/**
 * Image/Media API Service
 */
export const mediaAPI = {
  // Get image URL
  getImageUrl: (path) => {
    if (!path) return '/placeholder-image.jpg'
    if (path.startsWith('http')) return path
    return `http://localhost:4000/uploads/${path}`
  },
}

/**
 * Error handling utilities
 */
export const handleApiError = (error, fallbackMessage = 'Something went wrong') => {
  if (error.message.includes('Failed to fetch')) {
    return 'Network error. Please check your connection.'
  }
  if (error.message.includes('404')) {
    return 'Content not found.'
  }
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.'
  }
  return error.message || fallbackMessage
}

export default {
  products: productsAPI,
  categories: categoriesAPI,
  blog: blogAPI,
  plantCare: plantCareAPI,
  media: mediaAPI,
  handleApiError,
}
