/**
 * Public API Service for Chamunda Nursery Frontend
 * Handles all public data fetching with error handling and caching support
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Generic request handler with error handling
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error)
    throw error
  }
}

// Products API
export const productsAPI = {
  // Get all products with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    
    if (filters.category) params.append('category', filters.category)
    if (filters.search) params.append('search', filters.search)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    if (filters.tags) params.append('tags', filters.tags)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.page) params.append('page', filters.page)
    if (filters.sort) params.append('sort', filters.sort)

    const queryString = params.toString()
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },

  // Get single product by ID
  getById: async (id) => {
    return apiRequest(`/api/products/${id}`)
  },

  // Get featured products
  getFeatured: async (limit = 8) => {
    return apiRequest(`/api/products?featured=true&limit=${limit}`)
  },

  // Get related products
  getRelated: async (productId, limit = 4) => {
    return apiRequest(`/api/products/${productId}/related?limit=${limit}`)
  },

  // Search products
  search: async (query, filters = {}) => {
    const params = new URLSearchParams({ search: query })
    
    if (filters.category) params.append('category', filters.category)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.page) params.append('page', filters.page)

    return apiRequest(`/api/products/search?${params.toString()}`)
  },
}

// Categories API
export const categoriesAPI = {
  // Get all categories
  getAll: async () => {
    const response = await apiRequest('/api/categories')
    // Backend returns { success: true, data: [...] }
    // Transform to match frontend expectations
    return {
      categories: response.data || response,
      success: response.success || true
    }
  },

  // Get single category by ID
  getById: async (id) => {
    const response = await apiRequest(`/api/categories/${id}`)
    return response.data || response
  },

  // Get category by slug
  getBySlug: async (slug) => {
    return apiRequest(`/api/categories/slug/${slug}`)
  },

  // Get products in a category
  getProducts: async (categoryId, filters = {}) => {
    const params = new URLSearchParams()
    
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.page) params.append('page', filters.page)
    if (filters.sort) params.append('sort', filters.sort)

    const queryString = params.toString()
    const endpoint = `/api/categories/${categoryId}/products${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },
}

// Blog API
export const blogAPI = {
  // Get all blog posts with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    
    if (filters.category) params.append('category', filters.category)
    if (filters.tags) params.append('tags', filters.tags)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.page) params.append('page', filters.page)
    if (filters.sort) params.append('sort', filters.sort)

    const queryString = params.toString()
    const endpoint = `/api/blog${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },

  // Get single blog post by ID
  getById: async (id) => {
    return apiRequest(`/api/blog/${id}`)
  },

  // Get blog post by slug
  getBySlug: async (slug) => {
    return apiRequest(`/api/blog/slug/${slug}`)
  },

  // Get featured blog posts
  getFeatured: async (limit = 6) => {
    return apiRequest(`/api/blog?featured=true&limit=${limit}`)
  },

  // Search blog posts
  search: async (query, filters = {}) => {
    const params = new URLSearchParams({ search: query })
    
    if (filters.category) params.append('category', filters.category)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.page) params.append('page', filters.page)

    return apiRequest(`/api/blog/search?${params.toString()}`)
  },

  // Get blog categories
  getCategories: async () => {
    return apiRequest('/api/blog/meta/categories')
  },
}

// Plant Care API
export const plantCareAPI = {
  // Get all plant care articles with optional filters
  getAll: async (filters = {}) => {
    const params = new URLSearchParams()
    
    if (filters.difficulty) params.append('difficulty', filters.difficulty)
    if (filters.plantType) params.append('plantType', filters.plantType)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.page) params.append('page', filters.page)
    if (filters.sort) params.append('sort', filters.sort)

    const queryString = params.toString()
    const endpoint = `/api/care-guides${queryString ? `?${queryString}` : ''}`
    
    return apiRequest(endpoint)
  },

  // Get single plant care article by ID
  getById: async (id) => {
    return apiRequest(`/api/care-guides/${id}`)
  },

  // Get plant care article by slug
  getBySlug: async (slug) => {
    return apiRequest(`/api/care-guides/slug/${slug}`)
  },

  // Search plant care articles
  search: async (query, filters = {}) => {
    const params = new URLSearchParams({ search: query })
    
    if (filters.difficulty) params.append('difficulty', filters.difficulty)
    if (filters.limit) params.append('limit', filters.limit)
    if (filters.page) params.append('page', filters.page)

    return apiRequest(`/api/care-guides/search?${params.toString()}`)
  },
}

// General Content API
export const contentAPI = {
  // Get testimonials
  getTestimonials: async (limit = 6) => {
    return apiRequest(`/api/testimonials?limit=${limit}`)
  },

  // Get hero slides/banners - using testimonials as fallback since no hero-slides endpoint exists
  getHeroSlides: async () => {
    // Since there's no hero-slides endpoint, return empty array to use default slides
    return { data: [] }
  },

  // Get site settings
  getSettings: async () => {
    return apiRequest('/api/settings')
  },
}

// Media API for handling images and files
export const mediaAPI = {
  // Get image URL with proper base path
  getImageUrl: (imagePath) => {
    if (!imagePath) return '/logo.png' // fallback image
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath
    
    // If it's a relative path, prepend the backend URL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
  },

  // Get multiple image URLs
  getImageUrls: (imagePaths = []) => {
    return imagePaths.map(path => mediaAPI.getImageUrl(path))
  },

  // Get product gallery images
  getProductImages: (product) => {
    if (!product) return ['/logo.png']
    
    const images = []
    
    // Add main image
    if (product.image) {
      images.push(mediaAPI.getImageUrl(product.image))
    }
    
    // Add gallery images
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach(img => {
        images.push(mediaAPI.getImageUrl(img))
      })
    }
    
    // Fallback if no images
    return images.length > 0 ? images : ['/logo.png']
  },
}

// Error handling utilities
export const apiErrors = {
  isNetworkError: (error) => {
    return error.message.includes('fetch') || error.message.includes('Network')
  },

  isServerError: (error) => {
    return error.message.includes('500') || error.message.includes('502') || error.message.includes('503')
  },

  isNotFoundError: (error) => {
    return error.message.includes('404')
  },

  getUserFriendlyMessage: (error) => {
    if (apiErrors.isNetworkError(error)) {
      return 'Unable to connect to server. Please check your internet connection.'
    }
    
    if (apiErrors.isServerError(error)) {
      return 'Server is temporarily unavailable. Please try again later.'
    }
    
    if (apiErrors.isNotFoundError(error)) {
      return 'The requested content was not found.'
    }
    
    return 'Something went wrong. Please try again.'
  },
}

export default {
  products: productsAPI,
  categories: categoriesAPI,
  blog: blogAPI,
  plantCare: plantCareAPI,
  content: contentAPI,
  media: mediaAPI,
  errors: apiErrors,
}