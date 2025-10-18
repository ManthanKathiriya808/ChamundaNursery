import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time in milliseconds that unused/inactive cache data remains in memory
      gcTime: 1000 * 60 * 5, // 5 minutes
      
      // Time in milliseconds that the data is considered fresh
      staleTime: 1000 * 60 * 1, // 1 minute
      
      // Retry failed requests
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      
      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
      
      // Retry delay for mutations
      retryDelay: 1000,
    },
  },
})

// Query keys factory for consistent key management
export const queryKeys = {
  // Products
  products: {
    all: ['products'],
    lists: () => [...queryKeys.products.all, 'list'],
    list: (filters) => [...queryKeys.products.lists(), { filters }],
    details: () => [...queryKeys.products.all, 'detail'],
    detail: (id) => [...queryKeys.products.details(), id],
    search: (query) => [...queryKeys.products.all, 'search', query],
    categories: () => [...queryKeys.products.all, 'categories'],
  },
  
  // Categories
  categories: {
    all: ['categories'],
    lists: () => [...queryKeys.categories.all, 'list'],
    list: (filters) => [...queryKeys.categories.lists(), { filters }],
    details: () => [...queryKeys.categories.all, 'detail'],
    detail: (id) => [...queryKeys.categories.details(), id],
  },
  
  // Orders
  orders: {
    all: ['orders'],
    lists: () => [...queryKeys.orders.all, 'list'],
    list: (filters) => [...queryKeys.orders.lists(), { filters }],
    details: () => [...queryKeys.orders.all, 'detail'],
    detail: (id) => [...queryKeys.orders.details(), id],
    user: (userId) => [...queryKeys.orders.all, 'user', userId],
  },
  
  // Users
  users: {
    all: ['users'],
    lists: () => [...queryKeys.users.all, 'list'],
    list: (filters) => [...queryKeys.users.lists(), { filters }],
    details: () => [...queryKeys.users.all, 'detail'],
    detail: (id) => [...queryKeys.users.details(), id],
    profile: () => [...queryKeys.users.all, 'profile'],
  },
  
  // Reviews
  reviews: {
    all: ['reviews'],
    lists: () => [...queryKeys.reviews.all, 'list'],
    list: (filters) => [...queryKeys.reviews.lists(), { filters }],
    product: (productId) => [...queryKeys.reviews.all, 'product', productId],
  },
  
  // Admin
  admin: {
    all: ['admin'],
    dashboard: () => [...queryKeys.admin.all, 'dashboard'],
    analytics: () => [...queryKeys.admin.all, 'analytics'],
    sync: () => [...queryKeys.admin.all, 'sync'],
  },
  
  // Care Guides
  careGuides: {
    all: ['care-guides'],
    lists: () => [...queryKeys.careGuides.all, 'list'],
    list: (filters) => [...queryKeys.careGuides.lists(), { filters }],
    details: () => [...queryKeys.careGuides.all, 'detail'],
    detail: (id) => [...queryKeys.careGuides.details(), id],
  },
  
  // Testimonials
  testimonials: {
    all: ['testimonials'],
    lists: () => [...queryKeys.testimonials.all, 'list'],
    list: (filters) => [...queryKeys.testimonials.lists(), { filters }],
  },
}