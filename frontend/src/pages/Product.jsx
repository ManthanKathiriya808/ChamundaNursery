// Product detail page with sections and accessible layout
import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import ImageLazy from '../components/ImageLazy.jsx'
import { fetchProductById, fetchProducts } from '../services/api.js'
import { StarIcon } from '@heroicons/react/24/solid'
import ProductCard from '../components/ProductCard.jsx'
import { ProductCardSkeleton } from '../components/Skeleton.jsx'
import { useCart } from '../hooks/CartProvider.jsx'
import { useToast } from '../components/ToastProvider.jsx'

export default function Product() {
  const { id } = useParams()
  const cart = useCart()
  const toast = useToast()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [related, setRelated] = useState([])
  const [relLoading, setRelLoading] = useState(false)
  const [selectedImg, setSelectedImg] = useState(0)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    setLoading(true)
    setError('')
    fetchProductById(id)
      .then((data) => setItem(data))
      .catch((e) => { console.error(e); setError('Failed to load product') })
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!item) return
    setRelLoading(true)
    fetchProducts({ limit: 8, category: item.category })
      .then((data) => setRelated(Array.isArray(data) ? data : data?.items || []))
      .catch((e) => { console.error(e); setRelated([]) })
      .finally(() => setRelLoading(false))
  }, [item])

  const images = useMemo(() => {
    const base = []
    if (item?.image) base.push(item.image)
    // Fallback demo images to simulate gallery
    while (base.length < 4) base.push('/logo.png')
    return base
  }, [item])

  const rating = Number(item?.rating || 4.5)
  const reviews = Number(item?.reviews || 28)

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
        {loading && (
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
                <h3 className="font-semibold mb-2">Reviews</h3>
                <p className="text-sm text-neutral-700">No reviews yet.</p>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Related Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {relLoading && Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                  {!relLoading && related.slice(0, 4).map((p) => (
                    <ProductCard key={p.id || p._id} id={p.id || p._id} name={p.name} price={p.price} image={p.image} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Buy Panel */}
            <aside className="lg:col-span-1">
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-premium lg:sticky lg:top-20">
                <div className="text-2xl font-semibold">₹{item.price}</div>
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
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => {
                      if (!item) return
                      cart.add({ id: item.id || id, name: item.name, price: item.price, image: item.image }, qty)
                      toast.push('success', 'Added to cart')
                    }}
                  >
                    Add to Cart
                  </button>
                  <button className="btn btn-accent w-full">Buy Now</button>
                </div>
                <div className="mt-4 rounded-lg bg-primary/10 text-primary p-3 text-sm">
                  Free shipping on orders over ₹499 • Secure payments
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  )
}