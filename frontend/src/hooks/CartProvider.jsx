import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { fetchCartItems, addToCart, updateCartItem, removeFromCart, clearCart } from '../services/api.js'

const CartContext = createContext(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Load cart items on mount
  useEffect(() => {
    const loadCartItems = async () => {
      setLoading(true)
      try {
        const cartItems = await fetchCartItems()
        setItems(cartItems)
      } catch (error) {
        console.error('Failed to load cart items:', error)
        // Fallback to localStorage
        try {
          const raw = localStorage.getItem('cart.items')
          setItems(raw ? JSON.parse(raw) : [])
        } catch {
          setItems([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadCartItems()
  }, [])

  // Sync with localStorage as backup
  useEffect(() => {
    try {
      localStorage.setItem('cart.items', JSON.stringify(items))
    } catch {}
  }, [items])

  const add = useCallback(async (product, qty = 1) => {
    setLoading(true)
    try {
      const result = await addToCart(product.id, qty)
      if (result.success || result.item) {
        // Refresh cart items from backend
        const updatedItems = await fetchCartItems()
        setItems(updatedItems)
      }
    } catch (error) {
      console.error('Failed to add to cart:', error)
      // Fallback to local state update
      setItems((prev) => {
        const idx = prev.findIndex((i) => String(i.id) === String(product.id))
        if (idx >= 0) {
          const next = prev.slice()
          next[idx] = { ...next[idx], qty: next[idx].qty + qty }
          return next
        }
        return [{ id: product.id, name: product.name, price: Number(product.price) || 0, image: product.image, qty }, ...prev]
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const remove = useCallback(async (id) => {
    setLoading(true)
    try {
      await removeFromCart(id)
      // Refresh cart items from backend
      const updatedItems = await fetchCartItems()
      setItems(updatedItems)
    } catch (error) {
      console.error('Failed to remove from cart:', error)
      // Fallback to local state update
      setItems((prev) => prev.filter((i) => String(i.id) !== String(id)))
    } finally {
      setLoading(false)
    }
  }, [])

  const updateQty = useCallback(async (id, qty) => {
    setLoading(true)
    try {
      await updateCartItem(id, qty)
      // Refresh cart items from backend
      const updatedItems = await fetchCartItems()
      setItems(updatedItems)
    } catch (error) {
      console.error('Failed to update cart quantity:', error)
      // Fallback to local state update
      setItems((prev) => prev.map((i) => (String(i.id) === String(id) ? { ...i, qty: Math.max(1, qty) } : i)))
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(async () => {
    setLoading(true)
    try {
      await clearCart()
      setItems([])
    } catch (error) {
      console.error('Failed to clear cart:', error)
      // Fallback to local state update
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)
  const toggleDrawer = () => setDrawerOpen((o) => !o)

  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (i.qty || 1), 0)

  const value = useMemo(() => ({ 
    items, 
    add, 
    remove, 
    updateQty, 
    clear, 
    subtotal, 
    loading,
    drawerOpen, 
    openDrawer, 
    closeDrawer, 
    toggleDrawer 
  }), [items, subtotal, loading, drawerOpen, add, remove, updateQty, clear])
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}