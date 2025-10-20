/**
 * Public Data Hooks for Chamunda Nursery
 * React Query hooks for fetching public data with optimized caching
 */

import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { 
  productsAPI, 
  categoriesAPI, 
  blogAPI, 
  plantCareAPI, 
  contentAPI,
  apiErrors 
} from '../services/publicAPI'
import { queryKeys } from '../lib/queryClient'

/**
 * Products Hooks
 */

// Get all products with filtering
export const useProducts = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productsAPI.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes for product lists
    retry: (failureCount, error) => {
      if (apiErrors.isNotFoundError(error)) return false
      return failureCount < 3
    },
    select: (data) => ({
      products: data.data || data.products || data || [],
      total: data.total || data.count || 0,
      page: data.page || 1,
      totalPages: data.totalPages || Math.ceil((data.total || 0) / (filters.limit || 12))
    }),
    ...options,
  })
}

// Get single product by ID
export const useProduct = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsAPI.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes for product details
    enabled: !!id,
    ...options,
  })
}

// Get featured products
export const useFeaturedProducts = (limit = 8, options = {}) => {
  return useQuery({
    queryKey: queryKeys.products.featured(),
    queryFn: () => productsAPI.getFeatured(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes for featured products
    ...options,
  })
}

// Get related products
export const useRelatedProducts = (productId, limit = 4, options = {}) => {
  return useQuery({
    queryKey: queryKeys.products.related(productId),
    queryFn: () => productsAPI.getRelated(productId, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes for related products
    enabled: !!productId,
    ...options,
  })
}

// Search products
export const useProductSearch = (query, filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.products.search(query, filters),
    queryFn: () => productsAPI.search(query, filters),
    staleTime: 1 * 60 * 1000, // 1 minute for search results
    enabled: !!query && query.length > 2,
    ...options,
  })
}

/**
 * Categories Hooks
 */

// Get all categories
export const useCategories = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: () => categoriesAPI.getAll(),
    staleTime: 15 * 60 * 1000, // 15 minutes for categories (rarely change)
    ...options,
  })
}

// Get single category by ID
export const useCategory = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoriesAPI.getById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes for category details
    enabled: !!id,
    ...options,
  })
}

// Get category products
export const useCategoryProducts = (categoryId, filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.categories.products(categoryId, filters),
    queryFn: () => categoriesAPI.getProducts(categoryId, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes for category products
    enabled: !!categoryId,
    ...options,
  })
}

/**
 * Blog Hooks
 */

// Get all blog posts
export const useBlogPosts = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.blog.list(filters),
    queryFn: () => blogAPI.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes for blog lists
    ...options,
  })
}

// Get single blog post by ID
export const useBlogPost = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.blog.detail(id),
    queryFn: () => blogAPI.getById(id),
    staleTime: 10 * 60 * 1000, // 10 minutes for blog details
    enabled: !!id,
    ...options,
  })
}

// Get featured blog posts
export const useFeaturedBlogs = (limit = 3, options = {}) => {
  return useQuery({
    queryKey: queryKeys.blog.featured(),
    queryFn: () => blogAPI.getFeatured(limit),
    staleTime: 15 * 60 * 1000, // 15 minutes for featured blogs
    ...options,
  })
}

// Search blog posts
export const useBlogSearch = (query, filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.blog.search(query, filters),
    queryFn: () => blogAPI.search(query, filters),
    staleTime: 2 * 60 * 1000, // 2 minutes for blog search
    enabled: !!query && query.length > 2,
    ...options,
  })
}

/**
 * Blog Categories Hook
 */
export const useBlogCategories = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.blog.categories(),
    queryFn: () => blogAPI.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes for categories
    ...options,
  })
}

/**
 * Plant Care Hooks
 */

// Get all plant care articles
export const usePlantCareArticles = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: queryKeys.plantCare.list(filters),
    queryFn: () => plantCareAPI.getAll(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes for plant care articles
    ...options,
  })
}

// Get single plant care article by ID
export const usePlantCareArticle = (id, options = {}) => {
  return useQuery({
    queryKey: queryKeys.plantCare.detail(id),
    queryFn: () => plantCareAPI.getById(id),
    staleTime: 15 * 60 * 1000, // 15 minutes for plant care details
    enabled: !!id,
    ...options,
  })
}

// Search plant care articles
export const usePlantCareSearch = (query, options = {}) => {
  return useQuery({
    queryKey: queryKeys.plantCare.search(query),
    queryFn: () => plantCareAPI.search(query),
    staleTime: 5 * 60 * 1000, // 5 minutes for plant care search
    enabled: !!query && query.length > 2,
    ...options,
  })
}

/**
 * Combined hooks for complex data requirements
 */

// Get home page data (featured products + featured blogs)
export const useHomePageData = () => {
  const featuredProducts = useFeaturedProducts(8)
  const featuredBlogs = useFeaturedBlogs(3)
  const categories = useCategories()

  return {
    featuredProducts,
    featuredBlogs,
    categories,
    isLoading: featuredProducts.isLoading || featuredBlogs.isLoading || categories.isLoading,
    isError: featuredProducts.isError || featuredBlogs.isError || categories.isError,
    error: featuredProducts.error || featuredBlogs.error || categories.error,
  }
}

// Get product page data (products + categories for filtering)
export const useProductPageData = (filters = {}) => {
  const products = useProducts(filters)
  const categories = useCategories()

  return {
    products,
    categories,
    isLoading: products.isLoading || categories.isLoading,
    isError: products.isError || categories.isError,
    error: products.error || categories.error,
  }
}

// Infinite scroll for products
export const useInfiniteProducts = (filters = {}) => {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list({ ...filters, infinite: true }),
    queryFn: ({ pageParam = 1 }) => 
      productsAPI.getAll({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      const currentPage = lastPage.page || pages.length
      const totalPages = lastPage.totalPages || Math.ceil((lastPage.total || 0) / (filters.limit || 12))
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  })
}

// Get testimonials
export const useTestimonials = (limit = 6, options = {}) => {
  return useQuery({
    queryKey: ['testimonials', limit],
    queryFn: () => contentAPI.getTestimonials(limit),
    staleTime: 60 * 60 * 1000, // 1 hour - testimonials are stable
    cacheTime: 2 * 60 * 60 * 1000, // 2 hours cache
    select: (data) => data.data || data.testimonials || data || [],
    ...options,
  })
}

// Get hero slides
export const useHeroSlides = (options = {}) => {
  return useQuery({
    queryKey: ['hero-slides'],
    queryFn: () => contentAPI.getHeroSlides(),
    staleTime: 30 * 60 * 1000, // 30 minutes - hero content is curated
    cacheTime: 60 * 60 * 1000, // 1 hour cache
    select: (data) => data.data || data.slides || data || [],
    ...options,
  })
}

// Hook for handling API errors with user-friendly messages
export const useApiError = (error) => {
  if (!error) return null
  
  return {
    message: apiErrors.getUserFriendlyMessage(error),
    isNetworkError: apiErrors.isNetworkError(error),
    isServerError: apiErrors.isServerError(error),
    isNotFoundError: apiErrors.isNotFoundError(error),
    originalError: error
  }
}

// Hook for prefetching related data
export const usePrefetchRelated = () => {
  const queryClient = useQueryClient()
  
  const prefetchProduct = (id) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.products.detail(id),
      queryFn: () => productsAPI.getById(id),
      staleTime: 5 * 60 * 1000,
    })
  }
  
  const prefetchCategory = (id) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.categories.detail(id),
      queryFn: () => categoriesAPI.getById(id),
      staleTime: 30 * 60 * 1000,
    })
  }
  
  return { prefetchProduct, prefetchCategory }
}
