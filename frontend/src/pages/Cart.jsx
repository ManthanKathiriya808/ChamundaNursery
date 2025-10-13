// Cart page placeholder
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/CartProvider.jsx'

export default function Cart() {
  const { items, updateQty, remove, subtotal } = useCart()
  return (
    <div className="page-container">
      <Helmet>
        <title>Cart • Chamunda Nursery</title>
        <meta name="description" content="Review items in your cart" />
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-lg border border-neutral-200 bg-white p-4">
          <h1 className="text-xl font-semibold mb-3">Your Cart</h1>
          {items.length === 0 ? (
            <div className="text-neutral-700">Your cart is empty.</div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {items.map(i => (
                <li key={i.id} className="py-3 grid grid-cols-[1fr_auto_auto] items-center gap-3">
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <div className="text-sm text-neutral-600">₹{i.price}</div>
                  </div>
                  <div className="inline-flex items-center rounded-md border border-neutral-300 overflow-hidden">
                    <button className="px-3 py-1 hover:bg-neutral-100" onClick={() => updateQty(i.id, i.qty - 1)} aria-label="Decrease">-</button>
                    <span className="px-3 py-1 min-w-[32px] text-center">{i.qty}</span>
                    <button className="px-3 py-1 hover:bg-neutral-100" onClick={() => updateQty(i.id, i.qty + 1)} aria-label="Increase">+</button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm">₹{i.price * i.qty}</div>
                    <button className="btn btn-outline" onClick={() => remove(i.id)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <aside className="rounded-lg border border-neutral-200 bg-white p-4">
          <h3 className="font-semibold mb-2">Summary</h3>
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>₹99</span></div>
          <div className="flex justify-between font-semibold"><span>Total</span><span>₹{subtotal + 99}</span></div>
          <div className="mt-3">
            <Link to="/checkout" className="btn btn-primary w-full">Checkout</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}