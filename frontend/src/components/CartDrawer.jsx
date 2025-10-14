import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/CartProvider.jsx'

export default function CartDrawer() {
  const { drawerOpen, closeDrawer, items, updateQty, remove, subtotal } = useCart()
  const shipping = subtotal > 499 ? 0 : 99
  const total = subtotal + shipping
  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-50" aria-live="polite">
          {/* Backdrop */}
          <motion.div
            role="button"
            aria-label="Close cart"
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-premium border-l border-neutral-200 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <div className="font-display text-lg font-semibold">Your Cart</div>
              <button className="btn btn-outline" onClick={closeDrawer} aria-label="Close">Close</button>
            </div>
            {/* Items */}
            <div className="flex-1 overflow-auto p-4">
              {items.length === 0 ? (
                <div className="text-neutral-700">Your cart is empty.</div>
              ) : (
                <ul className="space-y-3">
                  {items.map((i) => (
                    <li key={i.id} className="rounded-lg border border-neutral-200 p-3 flex items-center gap-3">
                      <img src={i.image || '/logo.png'} alt="Product" className="h-16 w-16 rounded bg-neutral-100 object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium line-clamp-1">{i.name}</div>
                        <div className="text-sm text-neutral-600">₹{i.price}</div>
                        <div className="mt-2 inline-flex items-center rounded-md border border-neutral-300 overflow-hidden">
                          <button className="px-3 py-1 hover:bg-neutral-100" onClick={() => updateQty(i.id, i.qty - 1)} aria-label="Decrease">-</button>
                          <span className="px-3 py-1 min-w-[32px] text-center">{i.qty}</span>
                          <button className="px-3 py-1 hover:bg-neutral-100" onClick={() => updateQty(i.id, i.qty + 1)} aria-label="Increase">+</button>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">₹{i.price * i.qty}</div>
                      <button className="btn btn-outline" onClick={() => remove(i.id)}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Footer */}
            <div className="border-t border-neutral-200 p-4">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>₹{shipping}</span></div>
                <div className="flex justify-between font-semibold"><span>Total</span><span>₹{total}</span></div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button className="btn btn-outline w-full" onClick={closeDrawer}>Continue Shopping</button>
                <Link to="/checkout" className="btn btn-primary w-full" onClick={closeDrawer}>Checkout</Link>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}