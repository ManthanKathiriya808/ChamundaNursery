import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStaggerAnimation } from '../hooks/useScrollAnimation.js'
import { useCategories } from '../hooks/usePublicData.js'

export default function CollectionGrid() {
  // Animation hook for staggered collection cards
  const collectionAnimation = useStaggerAnimation()
  const { data: categoriesData, isLoading } = useCategories()

  // Generate categories from API data or fallback to hardcoded ones
  const categories = React.useMemo(() => {
    if (categoriesData?.categories && categoriesData.categories.length > 0) {
      // Use dynamic categories and map to the expected format
      return categoriesData.categories
        .filter(cat => !cat.parent_id) // Only main categories
        .slice(0, 8) // Limit to 8 categories for grid
        .map(cat => ({
          key: cat.slug,
          label: cat.name,
          image: cat.image_url || 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop'
        }))
    }
    
    // Fallback to hardcoded categories
    return [
      { key: 'indoor-plants', label: 'Indoor Plants', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop' },
      { key: 'flowering-plants', label: 'Flowering Plants', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop' },
      { key: 'succulents', label: 'Succulents', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop' },
      { key: 'fruit-plants', label: 'Fruit Plants', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1200&auto=format&fit=crop' },
      { key: 'bonsai', label: 'Bonsai', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop' },
      { key: 'seeds', label: 'Seeds', image: 'https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?q=80&w=1200&auto=format&fit=crop' },
      { key: 'planters', label: 'Planters', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1200&auto=format&fit=crop' },
      { key: 'soil-fertilizers', label: 'Soil & Fertilizers', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop' }
    ]
  }, [categoriesData?.categories])

  if (isLoading) {
    return (
      <section aria-labelledby="collections-heading" className="py-6 md:py-10">
        <div className="page-container">
          <div className="flex items-end justify-between gap-4 mb-4 md:mb-6">
            <h2 id="collections-heading" className="heading-section">Shop by Collection</h2>
            <Link to="/catalog" className="btn btn-link">View all</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="surface p-0 overflow-hidden rounded-xl animate-pulse">
                <div className="h-28 sm:h-36 md:h-40 w-full bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="collections-heading" className="py-6 md:py-10">
      <div className="page-container">
        <div className="flex items-end justify-between gap-4 mb-4 md:mb-6">
          <h2 id="collections-heading" className="heading-section">Shop by Collection</h2>
          <Link to="/catalog" className="btn btn-link">View all</Link>
        </div>
        <motion.div 
          ref={collectionAnimation.ref}
          variants={collectionAnimation.containerVariants}
          initial="hidden"
          animate={collectionAnimation.inView ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        >
          {categories.map((c, idx) => (
            <Link key={c.key} to={`/catalog?category=${encodeURIComponent(c.key)}`} className="group block">
              <motion.div
                variants={collectionAnimation.itemVariants}
                className="surface p-0 overflow-hidden rounded-xl"
              >
                <div className="relative">
                  <img src={c.image} alt={c.label} className="h-28 sm:h-36 md:h-40 w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <div className="font-display text-lg md:text-xl font-semibold text-white drop-shadow">{c.label}</div>
                    <span className="inline-flex items-center justify-center rounded-full bg-white/90 text-primary h-8 w-8 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}