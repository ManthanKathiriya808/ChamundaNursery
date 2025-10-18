// Product detail page with sections and accessible layout
import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import ImageLazy from '../components/ImageLazy.jsx'
import { recordRecentlyViewed } from '../services/api.js'
import { useData } from '../context/DataProvider.jsx'
import { StarIcon } from '@heroicons/react/24/solid'
import ProductCard from '../components/ProductCard.jsx'
import { ProductCardSkeleton } from '../components/Skeleton.jsx'
import { useCart } from '../hooks/CartProvider.jsx'
import { useToast } from '../components/ToastProvider.jsx'
import useUser from '../hooks/useUser.js'
import Tabs from '../components/Tabs.jsx'
import RelatedCarousel from '../components/RelatedCarousel.jsx'
import FrequentlyBoughtTogether from '../components/FrequentlyBoughtTogether.jsx'
import { motion } from 'framer-motion'
import RecentlyViewed from '../components/RecentlyViewed.jsx'

export default function Product() {
  const { id } = useParams()
  const { getById, products, loading: dataLoading } = useData()
  const cart = useCart()
  const toast = useToast()
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [related, setRelated] = useState([])
  const [relLoading, setRelLoading] = useState(false)
  const [selectedImg, setSelectedImg] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError('')
    Promise.resolve(getById(id))
      .then((data) => { if (mounted) setItem(data) })
      .catch((e) => { console.error(e); if (mounted) setError('Failed to load product') })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id, getById])

  useEffect(() => {
    if (!item) return
    setRelLoading(true)
    try {
      const rel = (products || [])
        .filter((p) => p.id !== item.id && (!item.category || p.category === item.category))
        .slice(0, 8)
      setRelated(rel)
    } catch (e) {
      console.error(e)
      setRelated([])
    } finally {
      setRelLoading(false)
    }
  }, [item, products])

  // Record recently viewed (advanced state side-effect)
  useEffect(() => {
    if (item?.id) recordRecentlyViewed(item.id).catch(() => {})
  }, [item])

  const images = useMemo(() => {
    const base = []
    if (item?.image) base.push(item.image)
    else if (Array.isArray(item?.images) && item.images.length) base.push(item.images[0])
    else if (item?.thumbnail) base.push(item.thumbnail)
    while (base.length < 4) base.push('/logo.png')
    return base
  }, [item])

  const rating = Number(item?.rating ?? 4.5)
  const reviews = Number(item?.reviews ?? item?.reviewsCount ?? 28)
  const mrp = Number(item?.mrp) || Math.round((Number(item?.price) || 0) * 1.2)
  const savings = Math.max(0, mrp - Number(item?.price || 0))
  const offerPercent = mrp ? Math.round((savings / mrp) * 100) : 0

  return (
    <div className="page-container">
      <Helmet>
        <title>{item ? item.name : `Product #${id}`} • Chamunda Nursery</title>
        <meta name="description" content="Product details, specifications, and care instructions" />
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {error && (
          <div className="lg:col-span-2 rounded border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
        )}
        {(loading || dataLoading) && (
          <div className="lg:col-span-2 p-4 text-neutral-600">Loading…</div>
        )}
        {!loading && item && (
          <>
            {/* Gallery */}
            <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-soft" aria-label="Image gallery">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100">
                <ImageLazy
                  src={images[selectedImg]}
                  alt={`${item.name} image ${selectedImg + 1}`}
                  className="h-full w-full object-cover"
                  zoom
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`rounded-lg overflow-hidden border ${selectedImg === i ? 'border-primary' : 'border-neutral-200'} focus:outline-none focus:ring-2 focus:ring-primary`}
                    aria-label={`Select image ${i + 1}`}
                  >
                    <ImageLazy src={src} alt={`Thumbnail ${i + 1}`} className="h-16 w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details & Highlights */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-semibold">{item.name}</h1>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} className={`h-5 w-5 ${i + 0.5 <= rating ? 'text-accent' : 'text-neutral-300'}`} aria-hidden="true" />
                    ))}
                    <span className="text-neutral-700">{rating.toFixed(1)} • {reviews} reviews</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.category && <span className="badge badge-primary">{String(item.category).charAt(0).toUpperCase() + String(item.category).slice(1)}</span>}
                    <span className="badge">Fast Delivery</span>
                    <span className="badge">Fresh Stock</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {offerPercent > 0 && <span className="badge badge-primary">Save {offerPercent}%</span>}
                <span className="badge bg-green-100 text-primary">Free shipping over ₹499</span>
                {mrp > (item.price || 0) && <span className="text-neutral-600 text-sm">MRP: <span className="line-through">₹{mrp}</span></span>}
              </div>
              <p className="text-serif-soft">{item.description || 'Premium plant with great care needs. Ideal for home and garden.'}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-soft">
                  <h3 className="font-semibold mb-2">Highlights</h3>
                  <ul className="text-sm text-neutral-700 space-y-1">
                    <li>Healthy, nursery-grown plant</li>
                    <li>Ideal for {item.category || 'home & garden'}</li>
                    <li>Free care guide included</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-soft">
                  <h3 className="font-semibold mb-2">Specifications</h3>
                  <ul className="text-sm text-neutral-700 space-y-1">
                    <li>Height: 30cm</li>
                    <li>Pot Size: 6 inch</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-soft">
                  <h3 className="font-semibold mb-2">Care Instructions</h3>
                  <ul className="text-sm text-neutral-700 space-y-1">
                    <li>Water twice a week</li>
                    <li>Indirect sunlight</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-soft">
                <Tabs
                  items={[
                    { label: 'Care', content: (
                      <ul className="text-sm text-neutral-700 space-y-1">
                        <li>Water twice a week</li>
                        <li>Indirect sunlight</li>
                        <li>Fertilize monthly</li>
                      </ul>
                    )},
                    { label: 'Description', content: (
                      <p className="text-sm text-neutral-700">{item.description || 'Premium plant with vibrant foliage, perfect for homes and offices.'}</p>
                    )},
                    { label: 'Reviews', content: (
                      <p className="text-sm text-neutral-700">No reviews yet.</p>
                    )},
                  ]}
                />
              </div>

              <div className="mt-4">
                <FrequentlyBoughtTogether items={related.slice(0, 3)} />
                {relLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                  </div>
                ) : (
                  <RelatedCarousel items={related.slice(0, 8)} />
                )}
              </div>
            </div>

            {/* Sticky Buy Panel */}
            <aside className="lg:col-span-1">
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-premium lg:sticky lg:top-20">
                <div className="flex items-baseline gap-3">
                  <div className="text-2xl font-semibold">₹{item.price}</div>
                  {mrp > (item.price || 0) && <div className="text-neutral-500 line-through">₹{mrp}</div>}
                </div>
                <p className="mt-1 text-sm text-neutral-700">Inclusive of all taxes</p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm">Quantity</span>
                  <div className="inline-flex items-center rounded-md border border-neutral-300 overflow-hidden">
                    <button className="px-3 py-1 hover:bg-neutral-100" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">-</button>
                    <span className="px-3 py-1 min-w-[32px] text-center">{qty}</span>
                    <button className="px-3 py-1 hover:bg-neutral-100" onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <motion.button
                    className="btn btn-primary w-full"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      console.log('Add to cart clicked', { item, user, cart, toast })
                      if (!item) {
                        console.log('No item found')
                        return
                      }
                      if (!user?.isAuthenticated) {
                        console.log('User not authenticated, redirecting to login')
                        navigate('/account/login', { state: { from: location } })
                        return
                      }
                      console.log('Adding to cart:', { id: item.id || id, name: item.name, price: item.price, image: item.image }, qty)
                      cart.add({ id: item.id || id, name: item.name, price: item.price, image: item.image }, qty)
                      console.log('Showing toast')
                      toast.push('success', 'Added to cart')
                      console.log('Opening drawer')
                      cart.openDrawer()
                    }}
                  >
                    Add to Cart
                  </motion.button>
                  <Link to="/checkout" className="btn btn-accent w-full">Buy Now</Link>
                </div>
                <div className="mt-4 rounded-lg bg-primary/10 text-primary p-3 text-sm">
                  Free shipping on orders over ₹499 • Secure payments
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
      {/* Recently viewed section */}
      <RecentlyViewed />
    </div>
  )
}