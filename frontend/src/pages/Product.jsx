// Product detail page with dynamic API data and image galleries
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
import { 
  useProduct, 
  useRelatedProducts, 
  useApiError,
  usePrefetchRelated 
} from '../hooks/usePublicData.js'
import { 
  ProductDetailSkeleton, 
  ErrorState 
} from '../components/LoadingSkeletons.jsx'

export default function Product() {
  const { id } = useParams()
  const cart = useCart()
  const toast = useToast()
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedImg, setSelectedImg] = useState(0)
  const [qty, setQty] = useState(1)

  // Dynamic API data
  const { 
    data: product, 
    isLoading: productLoading, 
    error: productError,
    refetch: refetchProduct 
  } = useProduct(id)

  const { 
    data: relatedProducts, 
    isLoading: relatedLoading, 
    error: relatedError 
  } = useRelatedProducts(id, product?.category)

  // Fallback to static data for backward compatibility
  const { getById, products, loading: dataLoading } = useData()
  const [fallbackItem, setFallbackItem] = useState(null)
  const [fallbackLoading, setFallbackLoading] = useState(false)

  // Error handling
  const productErrorInfo = useApiError(productError)
  const relatedErrorInfo = useApiError(relatedError)

  // Prefetch related data
  usePrefetchRelated(product?.category, product?.id)

  // Fallback data loading
  useEffect(() => {
    if (!product && !productLoading && id) {
      setFallbackLoading(true)
      Promise.resolve(getById(id))
        .then((data) => setFallbackItem(data))
        .catch((e) => console.error('Fallback load failed:', e))
        .finally(() => setFallbackLoading(false))
    }
  }, [id, getById, product, productLoading])

  // Final data resolution
  const item = product || fallbackItem
  const isLoading = productLoading || fallbackLoading || dataLoading
  const related = relatedProducts?.products || 
    (products || []).filter((p) => p.id !== item?.id && (!item?.category || p.category === item.category)).slice(0, 8)

  // Record recently viewed
  useEffect(() => {
    if (item?.id) {
      recordRecentlyViewed(item.id).catch(() => {})
    }
  }, [item])

  // Dynamic image gallery
  const images = useMemo(() => {
    if (!item) return ['/logo.png']
    
    const imageList = []
    
    // Add all images from the images array
    if (Array.isArray(item.images) && item.images.length > 0) {
      imageList.push(...item.images)
    } else if (item.image) {
      // Fallback to single image
      imageList.push(item.image)
    } else if (item.thumbnail) {
      // Fallback to thumbnail
      imageList.push(item.thumbnail)
    }
    
    // Ensure we have at least one image
    if (imageList.length === 0) {
      imageList.push('/logo.png')
    }
    
    return imageList
  }, [item])

  // Reset selected image when product changes
  useEffect(() => {
    setSelectedImg(0)
  }, [item?.id])

  const rating = Number(item?.rating ?? 4.5)
  const reviews = Number(item?.reviews ?? item?.reviewsCount ?? 28)
  const mrp = Number(item?.mrp) || Math.round((Number(item?.price) || 0) * 1.2)
  const savings = Math.max(0, mrp - Number(item?.price || 0))
  const offerPercent = mrp ? Math.round((savings / mrp) * 100) : 0

  return (
    <div className="page-container">
      <Helmet>
        <title>{item ? item.name : `Product #${id}`} • Chamunda Nursery</title>
        <meta name="description" content={item?.description || "Product details, specifications, and care instructions"} />
      </Helmet>
      
      {productErrorInfo && (
        <ErrorState
          title="Failed to load product"
          message={productErrorInfo.message}
          onRetry={refetchProduct}
          className="mb-6"
        />
      )}

      {isLoading ? (
        <ProductDetailSkeleton />
      ) : !item ? (
        <div className="text-center py-12">
          <div className="text-neutral-400 text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">Product not found</h3>
          <p className="text-neutral-500 mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/catalog" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Image Gallery */}
          <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-soft" aria-label="Image gallery">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-100 relative">
              <ImageLazy
                src={images[selectedImg]}
                alt={`${item.name} image ${selectedImg + 1}`}
                className="h-full w-full object-cover"
                zoom
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImg(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setSelectedImg(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                    aria-label="Next image"
                  >
                    →
                  </button>
                </>
              )}
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 6)}, 1fr)` }}>
                {images.slice(0, 6).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImg === i ? 'border-primary ring-2 ring-primary/20' : 'border-neutral-200 hover:border-neutral-300'
                    } focus:outline-none focus:ring-2 focus:ring-primary`}
                    aria-label={`Select image ${i + 1}`}
                  >
                    <ImageLazy 
                      src={src} 
                      alt={`${item.name} thumbnail ${i + 1}`} 
                      className="h-16 w-full object-cover" 
                    />
                  </button>
                ))}
                {images.length > 6 && (
                  <div className="h-16 rounded-lg border-2 border-neutral-200 bg-neutral-100 flex items-center justify-center text-sm text-neutral-600">
                    +{images.length - 6}
                  </div>
                )}
              </div>
            )}
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

            {/* Related Products Section with Error Handling */}
            <div className="mt-4">
              <FrequentlyBoughtTogether items={related.slice(0, 3)} />
              {relatedErrorInfo && (
                <ErrorState
                  title="Failed to load related products"
                  message={relatedErrorInfo.message}
                  onRetry={refetchRelated}
                  className="mt-4"
                />
              )}
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
        </div>
      )}
      
      {/* Recently viewed section */}
      <RecentlyViewed />
    </div>
  )
}