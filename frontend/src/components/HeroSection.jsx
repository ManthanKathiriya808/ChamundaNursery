import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Leaf, Truck, ShieldCheck, Search, Sprout, Shovel } from 'lucide-react'
import ImageLazy from './ImageLazy.jsx'
import LottieAnimation from './animations/LottieAnimation.jsx'
import { useCategories } from '../hooks/queries/useCategories'

// Animation data for hero section
const heroAnimations = {
  floatingLeaves: "https://lottie.host/4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s/data.json",
  wateringCan: "https://lottie.host/2l3m4n5o-6p7q-8r9s-0t1u-2v3w4x5y6z7a/data.json",
  plantGrowing: "https://lottie.host/6p7q8r9s-0t1u-2v3w-4x5y-6z7a8b9c0d1e/data.json"
}

// Animation configurations
const animationConfigs = {
  hero: {
    loop: true,
    autoplay: true,
    speed: 0.8,
    style: { width: '100%', height: '100%' }
  },
  ui: {
    loop: false,
    autoplay: false,
    speed: 1,
    style: { width: '24px', height: '24px' }
  }
}


export default function HeroSection() {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  
  // Get main categories for hero section (limit to 4)
  const heroCategories = React.useMemo(() => {
    if (!categories.length) return []
    
    // Get main categories (no parent) and their first level children
    const mainCategories = categories.filter(cat => !cat.parentId && cat.status === 'active')
    const result = []
    
    // Add main categories and some subcategories up to 4 items
    mainCategories.forEach(mainCat => {
      if (result.length < 4) {
        result.push({
          name: mainCat.name,
          slug: mainCat.slug,
          icon: getIconForCategory(mainCat.name)
        })
      }
      
      // Add subcategories if we still have space
      const subcategories = categories.filter(cat => 
        cat.parentId === mainCat.id && cat.status === 'active'
      )
      
      subcategories.forEach(subCat => {
        if (result.length < 4) {
          result.push({
            name: subCat.name,
            slug: subCat.slug,
            icon: getIconForCategory(subCat.name)
          })
        }
      })
    })
    
    return result.slice(0, 4)
  }, [categories])
  
  // Helper function to get appropriate icon for category
  const getIconForCategory = (categoryName) => {
    const name = categoryName.toLowerCase()
    if (name.includes('seed')) return Sprout
    if (name.includes('tool')) return Shovel
    return Leaf
  }

  return (
    <section aria-label="Hero" className="mb-10">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-primary via-accent to-primaryDark text-neutral-900">
        {/* Floating leaves background animation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
          <LottieAnimation
            animationData={heroAnimations.floatingLeaves}
            width="100%"
            height="100%"
            className="absolute inset-0"
            {...animationConfigs.hero}
          />
        </div>
        
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,white_0,transparent_35%),radial-gradient(circle_at_80%_30%,white_0,transparent_35%)]" />
        </div>

        <div className="relative px-4 py-8 md:px-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left content */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Premium plants and supplies from Chamunda Nursery. High-quality greens, expert care, fast delivery.
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/catalog" className="btn btn-primary group">
                  <span>Shop Plants</span>
                  <Leaf className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                </Link>
                <Link to="/catalog?category=tools" className="btn btn-accent">
                  Explore Tools
                  <Shovel className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>

              {/* Search bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search plants, seeds, tools…"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-transparent bg-white/90 backdrop-blur-sm"
                />
              </motion.div>
            </div>

            {/* Right content - Visual */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 p-6 flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 mb-4">
                    <LottieAnimation
                      animationData={heroAnimations.plantGrowing}
                      width="100%"
                      height="100%"
                      className="absolute inset-0"
                      {...animationConfigs.hero}
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-display text-xl font-semibold mb-2">Grow Your Garden</h3>
                    <p className="text-sm opacity-80">Premium quality, expert care</p>
                  </div>
                </div>
                
                {/* Floating logo */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                  <ImageLazy 
                    src="/logo.svg" 
                    alt="Chamunda Nursery" 
                    className="absolute inset-0 w-full h-full object-contain opacity-20" 
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {categoriesLoading ? (
                    // Loading skeleton
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="rounded-md bg-white/20 px-3 py-2 animate-pulse">
                        <div className="h-4 bg-white/30 rounded w-16"></div>
                      </div>
                    ))
                  ) : (
                    heroCategories.map((category) => {
                      const IconComponent = category.icon
                      return (
                        <Link 
                          key={category.slug} 
                          to={`/catalog?category=${category.slug}`} 
                          className="rounded-md bg-accentSoft text-primary px-3 py-2 text-sm font-medium hover:bg-accentLight inline-flex items-center gap-2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                          {category.name}
                          <IconComponent className="h-4 w-4" aria-hidden />
                        </Link>
                      )
                    })
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { k: '50k+', v: 'Plants Delivered' },
          { k: '98%', v: 'Happy Customers' },
          { k: '24/7', v: 'Plant Care Support' },
          { k: '500+', v: 'Plant Varieties' }
        ].map(({ k, v }) => (
          <motion.div
            key={v}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center p-4 rounded-lg bg-white border border-neutral-200"
          >
            <div className="font-display text-2xl font-bold text-primary">{k}</div>
            <div className="text-sm text-neutral-600">{v}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}