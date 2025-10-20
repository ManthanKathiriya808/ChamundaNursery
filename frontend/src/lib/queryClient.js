/**
 * React Query Configuration for Chamunda Nursery
 * Optimized for caching, real-time updates, and performance
 */

import { QueryClient } from '@tanstack/react-query'

// Default options for all queries
const defaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes - data is fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes - keep in cache for 10 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    refetchOnMount: true, // Refetch when component mounts
  },
  mutations: {
    retry: 1, // Retry mutations once
  },
}

// Create the query client
export const queryClient = new QueryClient({
  defaultOptions,
})

/**
 * Query Keys Factory
 * Consistent query key structure for better cache management
 */
export const queryKeys = {
  // Products
  products: {
    all: ['products'],
    lists: () => [...queryKeys.products.all, 'list'],
    list: (filters) => [...queryKeys.products.lists(), { filters }],
    details: () => [...queryKeys.products.all, 'detail'],
    detail: (id) => [...queryKeys.products.details(), id],
    featured: () => [...queryKeys.products.all, 'featured'],
    related: (id) => [...queryKeys.products.all, 'related', id],
    search: (query, filters) => [...queryKeys.products.all, 'search', { query, filters }],
  },

  // Categories
  categories: {
    all: ['categories'],
    lists: () => [...queryKeys.categories.all, 'list'],
    list: (filters) => [...queryKeys.categories.lists(), { filters }],
    details: () => [...queryKeys.categories.all, 'detail'],
    detail: (id) => [...queryKeys.categories.details(), id],
    products: (id, filters) => [...queryKeys.categories.all, 'products', id, { filters }],
  },

  // Blog
  blog: {
    all: ['blog'],
    lists: () => [...queryKeys.blog.all, 'list'],
    list: (filters) => [...queryKeys.blog.lists(), { filters }],
    details: () => [...queryKeys.blog.all, 'detail'],
    detail: (id) => [...queryKeys.blog.details(), id],
    featured: () => [...queryKeys.blog.all, 'featured'],
    categories: () => [...queryKeys.blog.all, 'categories'],
    search: (query, filters) => [...queryKeys.blog.all, 'search', { query, filters }],
  },

  // Plant Care
  plantCare: {
    all: ['plantCare'],
    lists: () => [...queryKeys.plantCare.all, 'list'],
    list: (filters) => [...queryKeys.plantCare.lists(), { filters }],
    details: () => [...queryKeys.plantCare.all, 'detail'],
    detail: (id) => [...queryKeys.plantCare.details(), id],
    search: (query) => [...queryKeys.plantCare.all, 'search', query],
  },
}

/**
 * Cache invalidation helpers
 * For real-time updates when admin makes changes
 */
export const invalidateQueries = {
  // Invalidate all product-related queries
  products: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
  },

  // Invalidate specific product
  product: (id) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) })
    queryClient.invalidateQueries({ queryKey: queryKeys.products.related(id) })
  },

  // Invalidate all category-related queries
  categories: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all })
  },

  // Invalidate specific category
  category: (id) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(id) })
  },

  // Invalidate all blog-related queries
  blog: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.blog.all })
  },

  // Invalidate specific blog post
  blogPost: (id) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.blog.detail(id) })
  },

  // Invalidate all plant care queries
  plantCare: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.plantCare.all })
  },

  // Invalidate everything (use sparingly)
  all: () => {
    queryClient.invalidateQueries()
  },
}

export default queryClient
