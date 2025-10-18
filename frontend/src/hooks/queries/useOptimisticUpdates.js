/**
 * Optimistic Updates Hook
 * 
 * Provides utilities for implementing optimistic updates across the application
 * Improves user experience by immediately updating UI before server confirmation
 */

import { useQueryClient } from '@tanstack/react-query'
import { useUIStore } from '../../stores/uiStore'
import { queryKeys } from '../../lib/queryClient'

export const useOptimisticUpdates = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useUIStore()

  // Optimistic product updates
  const optimisticProductUpdate = {
    // Add product optimistically
    add: (newProduct) => {
      const previousProducts = queryClient.getQueryData(queryKeys.products.all())
      
      // Optimistically update the cache
      queryClient.setQueryData(queryKeys.products.all(), (old) => {
        if (!old) return [newProduct]
        return [...old, { ...newProduct, id: `temp-${Date.now()}`, isOptimistic: true }]
      })

      return {
        rollback: () => {
          queryClient.setQueryData(queryKeys.products.all(), previousProducts)
        },
        confirm: (confirmedProduct) => {
          queryClient.setQueryData(queryKeys.products.all(), (old) => {
            if (!old) return [confirmedProduct]
            return old.map(product => 
              product.isOptimistic && product.name === newProduct.name 
                ? confirmedProduct 
                : product
            )
          })
        }
      }
    },

    // Update product optimistically
    update: (productId, updates) => {
      const previousProducts = queryClient.getQueryData(queryKeys.products.all())
      const previousProduct = queryClient.getQueryData(queryKeys.products.detail(productId))
      
      // Update products list
      queryClient.setQueryData(queryKeys.products.all(), (old) => {
        if (!old) return old
        return old.map(product => 
          product.id === productId 
            ? { ...product, ...updates, isOptimistic: true }
            : product
        )
      })

      // Update individual product
      queryClient.setQueryData(queryKeys.products.detail(productId), (old) => {
        if (!old) return old
        return { ...old, ...updates, isOptimistic: true }
      })

      return {
        rollback: () => {
          queryClient.setQueryData(queryKeys.products.all(), previousProducts)
          queryClient.setQueryData(queryKeys.products.detail(productId), previousProduct)
        },
        confirm: (confirmedProduct) => {
          queryClient.setQueryData(queryKeys.products.all(), (old) => {
            if (!old) return old
            return old.map(product => 
              product.id === productId ? confirmedProduct : product
            )
          })
          queryClient.setQueryData(queryKeys.products.detail(productId), confirmedProduct)
        }
      }
    },

    // Delete product optimistically
    delete: (productId) => {
      const previousProducts = queryClient.getQueryData(queryKeys.products.all())
      
      // Remove from cache
      queryClient.setQueryData(queryKeys.products.all(), (old) => {
        if (!old) return old
        return old.filter(product => product.id !== productId)
      })

      // Remove individual product cache
      queryClient.removeQueries(queryKeys.products.detail(productId))

      return {
        rollback: () => {
          queryClient.setQueryData(queryKeys.products.all(), previousProducts)
        }
      }
    }
  }

  // Optimistic cart updates (for local cart state)
  const optimisticCartUpdate = {
    // Add item to cart optimistically
    addItem: (product, quantity = 1) => {
      showNotification(`Added ${product.name} to cart`, 'success')
      
      return {
        rollback: () => {
          showNotification('Failed to add item to cart', 'error')
        }
      }
    },

    // Update item quantity optimistically
    updateQuantity: (productId, newQuantity) => {
      const previousNotification = `Updated quantity to ${newQuantity}`
      showNotification(previousNotification, 'success')
      
      return {
        rollback: () => {
          showNotification('Failed to update quantity', 'error')
        }
      }
    },

    // Remove item optimistically
    removeItem: (productName) => {
      showNotification(`Removed ${productName} from cart`, 'success')
      
      return {
        rollback: () => {
          showNotification('Failed to remove item from cart', 'error')
        }
      }
    }
  }

  // Optimistic order updates
  const optimisticOrderUpdate = {
    // Create order optimistically
    create: (orderData) => {
      const tempOrder = {
        ...orderData,
        id: `temp-${Date.now()}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        isOptimistic: true
      }

      const previousOrders = queryClient.getQueryData(queryKeys.orders.all())
      
      // Add to orders cache
      queryClient.setQueryData(queryKeys.orders.all(), (old) => {
        if (!old) return [tempOrder]
        return [tempOrder, ...old]
      })

      showNotification('Order placed successfully!', 'success')

      return {
        rollback: () => {
          queryClient.setQueryData(queryKeys.orders.all(), previousOrders)
          showNotification('Failed to place order', 'error')
        },
        confirm: (confirmedOrder) => {
          queryClient.setQueryData(queryKeys.orders.all(), (old) => {
            if (!old) return [confirmedOrder]
            return old.map(order => 
              order.isOptimistic && order.id === tempOrder.id 
                ? confirmedOrder 
                : order
            )
          })
          queryClient.setQueryData(queryKeys.orders.detail(confirmedOrder.id), confirmedOrder)
        }
      }
    },

    // Update order status optimistically
    updateStatus: (orderId, newStatus) => {
      const previousOrders = queryClient.getQueryData(queryKeys.orders.all())
      const previousOrder = queryClient.getQueryData(queryKeys.orders.detail(orderId))
      
      // Update orders list
      queryClient.setQueryData(queryKeys.orders.all(), (old) => {
        if (!old) return old
        return old.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, isOptimistic: true }
            : order
        )
      })

      // Update individual order
      queryClient.setQueryData(queryKeys.orders.detail(orderId), (old) => {
        if (!old) return old
        return { ...old, status: newStatus, isOptimistic: true }
      })

      showNotification(`Order status updated to ${newStatus}`, 'success')

      return {
        rollback: () => {
          queryClient.setQueryData(queryKeys.orders.all(), previousOrders)
          queryClient.setQueryData(queryKeys.orders.detail(orderId), previousOrder)
          showNotification('Failed to update order status', 'error')
        },
        confirm: (confirmedOrder) => {
          queryClient.setQueryData(queryKeys.orders.all(), (old) => {
            if (!old) return old
            return old.map(order => 
              order.id === orderId ? confirmedOrder : order
            )
          })
          queryClient.setQueryData(queryKeys.orders.detail(orderId), confirmedOrder)
        }
      }
    }
  }

  // Generic optimistic update utility
  const createOptimisticUpdate = (queryKey, updateFn, options = {}) => {
    const previousData = queryClient.getQueryData(queryKey)
    
    // Apply optimistic update
    queryClient.setQueryData(queryKey, (old) => updateFn(old))
    
    if (options.successMessage) {
      showNotification(options.successMessage, 'success')
    }

    return {
      rollback: () => {
        queryClient.setQueryData(queryKey, previousData)
        if (options.errorMessage) {
          showNotification(options.errorMessage, 'error')
        }
      },
      confirm: (confirmedData) => {
        queryClient.setQueryData(queryKey, confirmedData)
      }
    }
  }

  // Prefetch related data
  const prefetchRelatedData = {
    // Prefetch product details when hovering over product cards
    productDetails: (productId) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.detail(productId),
        queryFn: () => fetch(`/api/products/${productId}`).then(res => res.json()),
        staleTime: 5 * 60 * 1000, // 5 minutes
      })
    },

    // Prefetch category products
    categoryProducts: (categoryId) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.products.byCategory(categoryId),
        queryFn: () => fetch(`/api/products?category=${categoryId}`).then(res => res.json()),
        staleTime: 5 * 60 * 1000,
      })
    },

    // Prefetch user orders
    userOrders: (userId) => {
      queryClient.prefetchQuery({
        queryKey: queryKeys.orders.byUser(userId),
        queryFn: () => fetch(`/api/orders?userId=${userId}`).then(res => res.json()),
        staleTime: 2 * 60 * 1000, // 2 minutes
      })
    }
  }

  // Cache invalidation utilities
  const invalidateCache = {
    // Invalidate all product-related queries
    products: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products._def })
    },

    // Invalidate all order-related queries
    orders: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders._def })
    },

    // Invalidate all category-related queries
    categories: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories._def })
    },

    // Invalidate specific product
    product: (productId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(productId) })
    },

    // Invalidate all queries (nuclear option)
    all: () => {
      queryClient.invalidateQueries()
    }
  }

  return {
    optimisticProductUpdate,
    optimisticCartUpdate,
    optimisticOrderUpdate,
    createOptimisticUpdate,
    prefetchRelatedData,
    invalidateCache
  }
}

export default useOptimisticUpdates