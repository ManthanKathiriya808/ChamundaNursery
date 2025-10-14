// Recently Viewed products pulled from API with localStorage fallback
// Advanced patterns:
// - Animation: framer-motion staggered fade
// - State: data fetch with cancel guard
// - ARIA: region labelling and list semantics
import React, { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ProductCard from './ProductCard.jsx'
import { ProductCardSkeleton } from './Skeleton.jsx'
import { useData } from '../context/DataProvider.jsx'

export default function RecentlyViewed({ title = 'Recently viewed', limit = 8 }) {
  const { products, loading: dataLoading } = useData()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let mounted = true
    // Use localStorage IDs for parity with recordRecentlyViewed fallback
    const raw = localStorage.getItem('recently_viewed_ids')
    const ids = raw ? JSON.parse(raw) : []
    const mapped = ids
      .map((id) => products.find((p) => String(p.id) === String(id)))
      .filter(Boolean)
    if (mounted) {
      setItems(mapped.slice(0, limit))
      setLoading(false)
    }
    return () => { mounted = false }
  }, [limit, products])

  return (
    <section aria-labelledby="recently-viewed-title" className="page-container">
      <div className="flex items-end justify-between">
        <h2 id="recently-viewed-title" className="heading-section">{title}</h2>
      </div>
      {loading || dataLoading ? (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: Math.min(limit, 8) }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="mt-4 text-body">No recent views yet. Explore plants to see them here.</p>
      ) : (
        <motion.div
          className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          role="list"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? {} : { opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {items.map((p) => (
            <motion.div key={p.id} role="listitem" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={reduceMotion ? {} : { opacity: 1, y: 0 }}>
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}