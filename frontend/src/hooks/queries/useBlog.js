import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../lib/queryClient'
import useUIStore from '../../stores/uiStore'

const API_BASE = 'http://localhost:4000/api'

/**
 * Blog/Plant Care API functions
 * Handles all CRUD operations for blog posts and plant care articles
 * Supports image uploads, metadata management, and tag operations
 */
const blogAPI = {
  /**
   * Fetch all blog posts with optional filtering and pagination
   * @param {Object} filters - Filter options (category, tags, search, page, limit)
   * @returns {Promise} API response with blog posts array and pagination info
   */
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
    
    const response = await fetch(`${API_BASE}/blog?${params}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * Fetch a single blog post by ID
   * @param {string|number} id - Blog post ID
   * @returns {Promise} Blog post data with full content and metadata
   */
  getById: async (id) => {
    const response = await fetch(`${API_BASE}/blog/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * Create a new blog post with optional image uploads
   * @param {Object} blogData - Blog post data including content, metadata, and images
   * @returns {Promise} Created blog post data
   */
  create: async (blogData) => {
    const formData = new FormData()
    
    // Handle text fields
    Object.entries(blogData).forEach(([key, value]) => {
      if (key !== 'images' && key !== 'featuredImage') {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value)
        }
      }
    })
    
    // Handle featured image
    if (blogData.featuredImage && blogData.featuredImage instanceof File) {
      formData.append('featuredImage', blogData.featuredImage)
    }
    
    // Handle multiple images
    if (blogData.images && Array.isArray(blogData.images)) {
      blogData.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append('images', image)
        }
      })
    }
    
    const response = await fetch(`${API_BASE}/admin/blog`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to create blog post: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * Update an existing blog post
   * @param {Object} params - Object containing id and updated blog data
   * @returns {Promise} Updated blog post data
   */
  update: async ({ id, ...blogData }) => {
    const formData = new FormData()
    
    // Handle text fields
    Object.entries(blogData).forEach(([key, value]) => {
      if (key !== 'images' && key !== 'featuredImage' && key !== 'removeImages') {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value)
        }
      }
    })
    
    // Handle featured image replacement
    if (blogData.featuredImage && blogData.featuredImage instanceof File) {
      formData.append('featuredImage', blogData.featuredImage)
    }
    
    // Handle new images
    if (blogData.images && Array.isArray(blogData.images)) {
      blogData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('images', image)
        }
      })
    }
    
    // Handle image removal
    if (blogData.removeImages && Array.isArray(blogData.removeImages)) {
      blogData.removeImages.forEach(imageId => {
        formData.append('removeImages', imageId)
      })
    }
    
    const response = await fetch(`${API_BASE}/admin/blog/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to update blog post: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * Delete a blog post by ID
   * @param {string|number} id - Blog post ID to delete
   * @returns {Promise} Success confirmation
   */
  delete: async (id) => {
    const response = await fetch(`${API_BASE}/admin/blog/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to delete blog post: ${response.statusText}`)
    }
    return { success: true }
  },

  /**
   * Upload images for blog content (for WYSIWYG editor)
   * @param {File[]} images - Array of image files
   * @returns {Promise} Array of uploaded image URLs
   */
  uploadImages: async (images) => {
    const formData = new FormData()
    images.forEach(image => {
      formData.append('images', image)
    })
    
    const response = await fetch(`${API_BASE}/admin/blog/upload-images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error(`Failed to upload images: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * Get all available tags for blog posts
   * @returns {Promise} Array of tag objects
   */
  getTags: async () => {
    const response = await fetch(`${API_BASE}/blog/tags`)
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`)
    }
    return response.json()
  },

  /**
   * Search blog posts by query
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} Search results
   */
  search: async (query, filters = {}) => {
    const params = new URLSearchParams({ q: query })
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value)
      }
    })
    
    const response = await fetch(`${API_BASE}/blog/search?${params}`)
    if (!response.ok) {
      throw new Error(`Failed to search blog posts: ${response.statusText}`)
    }
    return response.json()
  },
}

/**
 * Hook to fetch all blog posts with filtering and real-time updates
 * @param {Object} filters - Filter options for blog posts
 * @returns {Object} Query result with data, loading, error states
 */
export const useBlogPosts = (filters = {}) => {
  const { setLoading } = useUIStore()
  
  return useQuery({
    queryKey: queryKeys.blog.list(filters),
    queryFn: async () => {
      const response = await blogAPI.getAll(filters)
      return response.data?.articles || []
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - blog content changes more frequently
    onSettled: () => setLoading('blog', false),
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load blog posts')
    },
  })
}

/**
 * Hook to fetch a single blog post by ID
 * @param {string|number} id - Blog post ID
 * @returns {Object} Query result with blog post data
 */
export const useBlogPost = (id) => {
  return useQuery({
    queryKey: queryKeys.blog.detail(id),
    queryFn: () => blogAPI.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load blog post')
    },
  })
}

/**
 * Hook to search blog posts with debounced queries
 * @param {string} query - Search query
 * @param {Object} filters - Additional search filters
 * @returns {Object} Query result with search results
 */
export const useSearchBlogPosts = (query, filters = {}) => {
  return useQuery({
    queryKey: queryKeys.blog.search(query, filters),
    queryFn: () => blogAPI.search(query, filters),
    enabled: !!query && query.length >= 2,
    staleTime: 1000 * 60 * 1, // 1 minute for search results
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Search failed')
    },
  })
}

/**
 * Hook to fetch available blog tags
 * @returns {Object} Query result with tags array
 */
export const useBlogTags = () => {
  return useQuery({
    queryKey: queryKeys.blog.tags(),
    queryFn: blogAPI.getTags,
    staleTime: 1000 * 60 * 10, // 10 minutes - tags don't change often
    onError: (error) => {
      useUIStore.getState().showError(error.message, 'Failed to load tags')
    },
  })
}

/**
 * Mutation hook for creating new blog posts
 * Handles form data, image uploads, and cache updates
 * @returns {Object} Mutation object with mutate function and states
 */
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: blogAPI.create,
    onSuccess: (newBlogPost) => {
      // Invalidate and refetch blog posts list
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.lists() })
      
      // Add the new blog post to the cache
      queryClient.setQueryData(
        queryKeys.blog.detail(newBlogPost.id),
        newBlogPost
      )
      
      // Update tags cache if new tags were created
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.tags() })
      
      showSuccess('Blog post created successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to create blog post')
    },
  })
}

/**
 * Mutation hook for updating existing blog posts
 * Handles partial updates, image replacements, and metadata changes
 * @returns {Object} Mutation object with mutate function and states
 */
export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: blogAPI.update,
    onSuccess: (updatedBlogPost) => {
      // Update the specific blog post in cache
      queryClient.setQueryData(
        queryKeys.blog.detail(updatedBlogPost.id),
        updatedBlogPost
      )
      
      // Invalidate blog posts list to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.lists() })
      
      // Update tags cache if tags were modified
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.tags() })
      
      showSuccess('Blog post updated successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to update blog post')
    },
  })
}

/**
 * Mutation hook for deleting blog posts
 * Handles cache cleanup and UI feedback
 * @returns {Object} Mutation object with mutate function and states
 */
export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useUIStore()

  return useMutation({
    mutationFn: blogAPI.delete,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.blog.detail(deletedId) })
      
      // Invalidate blog posts list
      queryClient.invalidateQueries({ queryKey: queryKeys.blog.lists() })
      
      showSuccess('Blog post deleted successfully!')
    },
    onError: (error) => {
      showError(error.message, 'Failed to delete blog post')
    },
  })
}

/**
 * Mutation hook for uploading images to blog content
 * Used by WYSIWYG editor for inline image uploads
 * @returns {Object} Mutation object for image upload operations
 */
export const useUploadBlogImages = () => {
  const { showError } = useUIStore()

  return useMutation({
    mutationFn: blogAPI.uploadImages,
    onError: (error) => {
      showError(error.message, 'Failed to upload images')
    },
  })
}

/**
 * Prefetch utility for blog posts
 * Improves performance by preloading blog post data
 * @returns {Function} Prefetch function that takes a blog post ID
 */
export const usePrefetchBlogPost = () => {
  const queryClient = useQueryClient()
  
  return (id) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.blog.detail(id),
      queryFn: () => blogAPI.getById(id),
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }
}