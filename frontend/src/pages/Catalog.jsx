// Catalog page with multi-level filters (placeholders) and responsive product grid
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCardSkeleton } from '../components/Skeleton.jsx'
import { fetchProducts } from '../services/api.js'

const categories = {
  Plants: ['indoor', 'outdoor', 'bonsai', 'fruits', 'vegetables'],
  Supplies: ['tools', 'seeds', 'pots']
}

export default function Catalog() {
  const [params] = useSearchParams()
  const activeCategory = params.get('category')
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() => {
    setLoading(true)
    // Simulate async loading
    fetchProducts({ category: activeCategory }).then(() => {
      // demo items
      const demo = Array.from({ length: 8 }).map((_, i) => ({ id: i + 1, name: `Product ${i + 1}`, price: (i + 1) * 99 }))
      setItems(demo)
      setLoading(false)
    })
  }, [activeCategory])

  return (
    <div className="page-container grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Helmet>
        <title>Catalog • Chamunda Nursery</title>
        <meta name="description" content="Browse plants and gardening supplies" />
      </Helmet>

      {/* Filters sidebar */}
      <aside className="lg:col-span-1 space-y-4" aria-label="Filters">
        {Object.entries(categories).map(([group, items]) => (
          <div key={group} className="rounded-lg border border-neutral-200 bg-white p-4">
            <h3 className="font-semibold mb-2">{group}</h3>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item}>
                  <Link className={`link-hover ${activeCategory === item ? 'text-primary font-semibold' : ''}`} to={`/catalog?category=${item}`}>{item[0].toUpperCase() + item.slice(1)}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Product grid */}
      <section className="lg:col-span-3" aria-label="Products">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : items.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="group rounded-lg border border-neutral-200 bg-white p-3 hover:shadow-premium transition ease-soft">
                  <div className="h-32 rounded-md bg-neutral-100 group-hover:bg-accent/40 transition ease-soft"></div>
                  <div className="mt-2 text-sm text-neutral-700">{item.name}</div>
                  <div className="text-neutral-500">₹{item.price}</div>
                </Link>
              ))}
        </div>
      </section>
    </div>
  )
}