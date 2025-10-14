import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '../hooks/CartProvider.jsx'
import { useToast } from './ToastProvider.jsx'
import useUser from '../hooks/useUser.js'
import { useNavigate, useLocation } from 'react-router-dom'

export default function FrequentlyBoughtTogether({ items = [] }) {
  const toast = useToast()
  const { add, openDrawer } = useCart()
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [selected, setSelected] = useState(() => items.slice(0, 3).map((p) => p.id || p._id))
  const total = useMemo(() => {
    return items.reduce((sum, p) => {
      const id = p.id || p._id
      return selected.includes(id) ? sum + (Number(p.price) || 0) : sum
    }, 0)
  }, [items, selected])

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  const addSelected = () => {
    if (!user?.isAuthenticated) {
      navigate('/account/login', { state: { from: location } })
      return
    }
    items.forEach((p) => {
      const id = p.id || p._id
      if (selected.includes(id)) add({ id, name: p.name, price: p.price, image: p.image }, 1)
    })
    toast.push('success', 'Bundle added to cart')
    openDrawer()
  }

  if (items.length === 0) return null

  return (
    <section aria-labelledby="fbt-heading" className="mt-6">
      <h3 id="fbt-heading" className="font-display text-lg md:text-xl font-semibold mb-2">Frequently Bought Together</h3>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
        className="rounded-xl border border-neutral-200 bg-white p-4"
      >
        <ul className="space-y-2">
          {items.slice(0, 3).map((p) => {
            const id = p.id || p._id
            const checked = selected.includes(id)
            return (
              <li key={id} className="flex items-center gap-3">
                <input type="checkbox" checked={checked} onChange={() => toggle(id)} aria-label={`Include ${p.name}`} />
                <img src={p.image || '/logo.png'} alt="" className="h-12 w-12 rounded bg-neutral-100 object-cover" />
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{p.name}</div>
                  <div className="text-sm text-neutral-600">₹{p.price}</div>
                </div>
                <div className="text-sm font-semibold">₹{p.price}</div>
              </li>
            )
          })}
        </ul>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm">Bundle total: <span className="font-semibold">₹{total}</span></div>
          <button className="btn btn-primary" onClick={addSelected}>Add selected to cart</button>
        </div>
      </motion.div>
    </section>
  )
}