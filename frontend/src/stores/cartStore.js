import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isOpen: false,
      total: 0,
      itemCount: 0,

      // Actions
      addItem: (product, quantity = 1) => {
        const items = get().items
        const existingItem = items.find(item => item.id === product.id)
        
        let newItems
        if (existingItem) {
          newItems = items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        } else {
          newItems = [...items, { ...product, quantity }]
        }
        
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0)
        
        set({ items: newItems, total, itemCount })
      },

      removeItem: (productId) => {
        const items = get().items.filter(item => item.id !== productId)
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
        
        set({ items, total, itemCount })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        const items = get().items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
        
        set({ items, total, itemCount })
      },

      clearCart: () => set({ items: [], total: 0, itemCount: 0 }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      // Getters
      getItem: (productId) => get().items.find(item => item.id === productId),
      getItemQuantity: (productId) => get().getItem(productId)?.quantity || 0,
      isEmpty: () => get().items.length === 0,
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items, 
        total: state.total, 
        itemCount: state.itemCount 
      }),
    }
  )
)

export default useCartStore