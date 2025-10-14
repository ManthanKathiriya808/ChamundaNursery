import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within <CartProvider>')
  return ctx
}

export default function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart.items')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  // Cart drawer state for slide-in sidebar/modal
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('cart.items', JSON.stringify(items))
    } catch {}
  }, [items])

  const add = (product, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => String(i.id) === String(product.id))
      if (idx >= 0) {
        const next = prev.slice()
        next[idx] = { ...next[idx], qty: next[idx].qty + qty }
        return next
      }
      return [{ id: product.id, name: product.name, price: Number(product.price) || 0, image: product.image, qty }, ...prev]
    })
  }

  const remove = (id) => setItems((prev) => prev.filter((i) => String(i.id) !== String(id)))
  const updateQty = (id, qty) => setItems((prev) => prev.map((i) => (String(i.id) === String(id) ? { ...i, qty: Math.max(1, qty) } : i)))
  const clear = () => setItems([])

  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)
  const toggleDrawer = () => setDrawerOpen((o) => !o)

  const subtotal = items.reduce((sum, i) => sum + (Number(i.price) || 0) * (i.qty || 1), 0)

  const value = useMemo(() => ({ items, add, remove, updateQty, clear, subtotal, drawerOpen, openDrawer, closeDrawer, toggleDrawer }), [items, subtotal, drawerOpen])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}