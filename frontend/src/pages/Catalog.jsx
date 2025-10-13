// Catalog page with multi-level filters (placeholders) and responsive product grid
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCardSkeleton } from '../components/Skeleton.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { fetchProducts } from '../services/api.js'

const categories = {
  Plants: ['indoor', 'outdoor', 'bonsai', 'fruits', 'vegetables'],
  Supplies: ['tools', 'seeds', 'pots']
}

export default function Catalog() {
  const [params] = useSearchParams()
  const activeCategory = params.get('category')
  const [sort, setSort] = useState('popular')
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchProducts({ category: activeCategory })
      .then((data) => {
        setItems(Array.isArray(data) ? data : (data.items || []))
      })
      .catch((e) => {
        console.error(e)
        setError('Failed to load products')
        setItems([])
      })
      .finally(() => setLoading(false))
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
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h3 className="font-semibold mb-2">Sort</h3>
          <select className="input input-bordered w-full" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="new">Newest</option>
          </select>
        </div>
      </aside>

      {/* Product grid */}
      <section className="lg:col-span-3" aria-label="Products">
        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : items
                .slice()
                .sort((a, b) => {
                  if (sort === 'price_asc') return (a.price || 0) - (b.price || 0)
                  if (sort === 'price_desc') return (b.price || 0) - (a.price || 0)
                  return 0
                })
                .map((item) => (
                  <ProductCard key={item.id || item._id} id={item.id || item._id} name={item.name} price={item.price} image={item.image} tag={activeCategory ? activeCategory[0].toUpperCase() + activeCategory.slice(1) : undefined} />
                ))}
        </div>
      </section>
    </div>
  )
}