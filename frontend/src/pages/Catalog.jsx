// Catalog page with multi-level filters (placeholders) and responsive product grid
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/animations/ScrollReveal.jsx'
import { Helmet } from 'react-helmet-async'
import { Link, useSearchParams } from 'react-router-dom'
import { ProductCardSkeleton } from '../components/Skeleton.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { useData } from '../context/DataProvider.jsx'

const categories = {
  Plants: ['indoor', 'outdoor', 'bonsai', 'fruits', 'vegetables'],
  Supplies: ['tools', 'seeds', 'pots']
}

export default function Catalog() {
  const [params] = useSearchParams()
  const activeCategory = params.get('category')
  const [sort, setSort] = useState('popular')
  const { products, loading: dataLoading } = useData()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [openGroups, setOpenGroups] = useState(() => Object.keys(categories).reduce((acc, k) => ({ ...acc, [k]: true }), {}))

  useEffect(() => {
    try {
      const filtered = (products || []).filter((p) => !activeCategory || p.category === activeCategory)
      setItems(filtered)
      setError('')
    } catch (e) {
      console.error(e)
      setError('Failed to load products')
      setItems([])
    }
  }, [activeCategory, products])

  return (
    <div className="page-container grid grid-cols-1 lg:grid-cols-4 gap-6">
      <Helmet>
        <title>Catalog • Chamunda Nursery</title>
        <meta name="description" content="Browse plants and gardening supplies" />
      </Helmet>

      {/* Page intro / dynamic heading */}
      <div className="lg:col-span-4 -mt-2">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="rounded-xl border border-neutral-200 bg-white p-4 md:p-5 shadow-soft"
        >
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-neutral-900">
            {activeCategory ? String(activeCategory).charAt(0).toUpperCase() + String(activeCategory).slice(1) : 'All Products'}
          </h1>
          <p className="text-neutral-700 text-sm md:text-base mt-1">Explore curated plants and gardening essentials. Use filters to refine your selection.</p>
        </motion.div>
      </div>

      {/* Filters sidebar */}
      <aside className="lg:col-span-1 space-y-4" aria-label="Filters">
        {Object.entries(categories).map(([group, items]) => (
          <ScrollReveal key={group} variant="fadeUp" className="rounded-lg border border-neutral-200 bg-white">
            <button
              className="w-full flex items-center justify-between px-4 py-3"
              aria-expanded={openGroups[group]}
              onClick={() => setOpenGroups((o) => ({ ...o, [group]: !o[group] }))}
            >
              <span className="font-semibold text-base md:text-lg">{group}</span>
              <span className={`transition-transform duration-300 ${openGroups[group] ? 'rotate-180' : 'rotate-0'}`}>▾</span>
            </button>
            <motion.ul
              initial={false}
              animate={openGroups[group] ? 'open' : 'collapsed'}
              variants={{ open: { height: 'auto', opacity: 1 }, collapsed: { height: 0, opacity: 0 } }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden px-4 pb-3 space-y-2"
            >
              {items.map((item) => (
                <li key={item}>
                  <Link className={`link-hover ${activeCategory === item ? 'text-primary font-semibold' : ''}`} to={`/catalog?category=${item}`}>{item[0].toUpperCase() + item.slice(1)}</Link>
                </li>
              ))}
            </motion.ul>
          </ScrollReveal>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-lg border border-neutral-200 bg-white p-4"
        >
          <h3 className="font-semibold mb-2">Sort</h3>
          <select className="input input-bordered w-full" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="new">Newest</option>
          </select>
        </motion.div>
      </aside>

      {/* Product grid */}
      <section className="lg:col-span-3" aria-label="Products">
        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
        )}
        <ScrollReveal variant="fadeUp" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {dataLoading
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
        </ScrollReveal>
      </section>
    </div>
  )
}