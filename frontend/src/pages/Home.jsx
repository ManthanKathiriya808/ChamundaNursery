// Premium Home page with hero banner, animated filters, and product carousels
import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, A11y, Keyboard } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { FunnelIcon, StarIcon } from '@heroicons/react/24/solid'
import { IconChevronRight } from '@tabler/icons-react'
import ImageLazy from '../components/ImageLazy.jsx'
import ProductCard from '../components/ProductCard.jsx'
import HeroSection from '../components/HeroSection.jsx'
import { fetchProducts } from '../services/api.js'
import { ProductCardSkeleton } from '../components/Skeleton.jsx'

const heroItems = [
  {
    title: 'Premium Plants, Delivered Fresh',
    subtitle: 'From Chamunda Nursery • Inspired by Fruitables',
    cta: 'Shop Now',
    href: '/catalog',
    image: '/logo.svg',
  },
  {
    title: 'Modern Gardening, Made Simple',
    subtitle: 'Tools • Pots • Care • Advice',
    cta: 'Explore Tools',
    href: '/catalog?category=tools',
    image: '/logo.svg',
  },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({ category: '', priceMin: '', priceMax: '' })

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchProducts({ limit: 12 })
      .then((data) => setProducts(Array.isArray(data) ? data : data?.items || []))
      .catch((e) => { console.error(e); setError('Failed to load products') })
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const inCat = filters.category ? (p.category || '').toLowerCase().includes(filters.category.toLowerCase()) : true
      const inMin = filters.priceMin ? Number(p.price) >= Number(filters.priceMin) : true
      const inMax = filters.priceMax ? Number(p.price) <= Number(filters.priceMax) : true
      return inCat && inMin && inMax
    })
  }, [products, filters])

  return (
    <div className="page-container">
      <Helmet>
        <title>Home • Chamunda Nursery</title>
        <meta name="description" content="Premium plants and gardening supplies from Chamunda Nursery. Shop indoor, outdoor, bonsai, and tools." />
      </Helmet>

      <HeroSection />

      {/* Hero Banner */}
      <section className="relative mb-10">
        <Swiper
          modules={[Navigation, Autoplay, A11y, Keyboard]}
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          keyboard={{ enabled: true }}
          a11y={{ enabled: true }}
          className="rounded-2xl shadow-premium"
        >
          {heroItems.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-10 bg-gradient-to-br from-primary/10 via-white to-accent/10">
                <div className="flex flex-col justify-center">
                  <motion.h1
                    className="text-3xl md:text-5xl font-display font-semibold"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    {item.title}
                  </motion.h1>
                  <motion.p
                    className="mt-3 text-neutral-700"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {item.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6"
                  >
                    <Link to={item.href} className="btn btn-primary inline-flex items-center">
                      {item.cta}
                      <IconChevronRight className="ml-1 h-5 w-5" />
                    </Link>
                  </motion.div>
                  <div className="mt-4 flex items-center gap-3 text-sm text-neutral-700">
                    <StarIcon className="h-5 w-5 text-accent" aria-hidden="true" />
                    Trusted by gardeners across India • Since 2012
                  </div>
                </div>
                <div className="relative">
                  <ImageLazy src={item.image} alt={item.title} className="w-full h-64 md:h-80 object-contain" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Filters */}
      <section aria-label="Advanced filters" className="mb-8">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-accent" aria-hidden="true" />
              <span className="font-medium">Filters</span>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Category (e.g., indoor, bonsai)"
                className="input input-bordered"
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Min Price"
                className="input input-bordered"
                value={filters.priceMin}
                onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Max Price"
                className="input input-bordered"
                value={filters.priceMax}
                onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value }))}
              />
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setFilters({ category: '', priceMin: '', priceMax: '' })}
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Product Carousels */}
      <section aria-label="Popular products" className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Popular Products</h2>
          <Link to="/catalog" className="link-hover">View all</Link>
        </div>
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}
        {error && (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
        )}
        {!loading && !error && (
          <Swiper
            modules={[Navigation, Autoplay, A11y]}
            navigation
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {filtered.map((p) => (
              <SwiperSlide key={p.id || p._id}>
                <ProductCard id={p.id || p._id} name={p.name} price={p.price} image={p.image} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </section>

      {/* Benefit cards */}
      <section aria-label="Why choose us" className="mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Fresh & Healthy', text: 'Direct from our nursery to your door.' },
            { title: 'Expert Support', text: 'Care guides and quick assistance.' },
            { title: 'Secure Payments', text: 'Trusted gateways with protection.' },
            { title: 'Fast Delivery', text: 'Pan-India shipping available.' },
          ].map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl border border-neutral-200 bg-white p-4 hover:shadow-premium transition ease-soft"
            >
              <div className="text-lg font-semibold">{b.title}</div>
              <p className="mt-1 text-neutral-700 text-sm">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}