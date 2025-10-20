import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'
import { useCategories } from '../hooks/usePublicData.js'

export default function PromoBanners() {
  // Animation hooks for different promo sections
  const topBannersAnimation = useScrollAnimation()
  const fullBannerAnimation = useScrollAnimation()
  const { data: categoriesData } = useCategories()

  // Generate promo banners from dynamic categories or fallback to hardcoded ones
  const promoBanners = React.useMemo(() => {
    if (categoriesData?.categories && categoriesData.categories.length > 0) {
      const mainCategories = categoriesData.categories.filter(cat => !cat.parent_id)
      
      // Try to find specific categories for promos, or use first available ones
      const indoorCategory = mainCategories.find(cat => 
        cat.name.toLowerCase().includes('indoor') || 
        cat.slug.includes('indoor')
      ) || mainCategories[0]
      
      const planterCategory = mainCategories.find(cat => 
        cat.name.toLowerCase().includes('planter') || 
        cat.name.toLowerCase().includes('pot') ||
        cat.slug.includes('planter') ||
        cat.slug.includes('pot')
      ) || mainCategories[1] || mainCategories[0]
      
      const fruitCategory = mainCategories.find(cat => 
        cat.name.toLowerCase().includes('fruit') ||
        cat.slug.includes('fruit')
      ) || mainCategories[2] || mainCategories[0]

      return {
        topLeft: {
          category: indoorCategory,
          image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1600&auto=format&fit=crop',
          title: `Breathe Easy with ${indoorCategory.name}`,
          subtitle: 'Purify your space with easy-care plants'
        },
        topRight: {
          category: planterCategory,
          image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop',
          title: `Aesthetic ${planterCategory.name}`,
          subtitle: 'Style your plants to perfection'
        },
        full: {
          category: fruitCategory,
          image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=2000&auto=format&fit=crop',
          title: `Grow Your Own ${fruitCategory.name}`,
          subtitle: 'Fresh fruits from your balcony'
        }
      }
    }
    
    // Fallback to hardcoded banners
    return {
      topLeft: {
        category: { slug: 'indoor-plants', name: 'Indoor Plants' },
        image: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1600&auto=format&fit=crop',
        title: 'Breathe Easy with Indoor Greens',
        subtitle: 'Purify your space with easy-care plants'
      },
      topRight: {
        category: { slug: 'planters', name: 'Planters' },
        image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop',
        title: 'Aesthetic Planters & Pots',
        subtitle: 'Style your plants to perfection'
      },
      full: {
        category: { slug: 'fruit-plants', name: 'Fruit Plants' },
        image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=2000&auto=format&fit=crop',
        title: 'Grow Your Own Orchard',
        subtitle: 'Fresh fruits from your balcony'
      }
    }
  }, [categoriesData?.categories])

  return (
    <section aria-labelledby="promos-heading" className="py-6 md:py-10">
      <div className="page-container">
        <h2 id="promos-heading" className="sr-only">Promotional Banners</h2>
        <motion.div 
          ref={topBannersAnimation.ref}
          variants={topBannersAnimation.fadeUp}
          initial="hidden"
          animate={topBannersAnimation.inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
        >
          <Link to={`/catalog?category=${promoBanners.topLeft.category.slug}`} className="group block">
            <motion.div
              variants={topBannersAnimation.fadeLeft}
              className="rounded-xl overflow-hidden surface p-0"
            >
              <div className="relative">
                <img src={promoBanners.topLeft.image} alt={promoBanners.topLeft.category.name} className="h-40 md:h-56 w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent" />
                <div className="absolute left-4 bottom-4">
                  <div className="font-display text-2xl md:text-3xl font-semibold text-white">{promoBanners.topLeft.title}</div>
                  <div className="text-white/90 text-sm md:text-base">{promoBanners.topLeft.subtitle}</div>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link to={`/catalog?category=${promoBanners.topRight.category.slug}`} className="group block">
            <motion.div
              variants={topBannersAnimation.fadeRight}
              className="rounded-xl overflow-hidden surface p-0"
            >
              <div className="relative">
                <img src={promoBanners.topRight.image} alt={promoBanners.topRight.category.name} className="h-40 md:h-56 w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent" />
                <div className="absolute left-4 bottom-4">
                  <div className="font-display text-2xl md:text-3xl font-semibold text-white">{promoBanners.topRight.title}</div>
                  <div className="text-white/90 text-sm md:text-base">{promoBanners.topRight.subtitle}</div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        <Link to={`/catalog?category=${promoBanners.full.category.slug}`} className="group block mt-3 md:mt-4">
          <motion.div
            ref={fullBannerAnimation.ref}
            variants={fullBannerAnimation.scaleUp}
            initial="hidden"
            animate={fullBannerAnimation.inView ? "visible" : "hidden"}
            className="rounded-xl overflow-hidden surface p-0"
          >
            <div className="relative">
              <img src={promoBanners.full.image} alt={promoBanners.full.category.name} className="h-40 md:h-64 w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
              <div className="absolute left-4 bottom-4">
                <div className="font-display text-2xl md:text-3xl font-semibold text-white">{promoBanners.full.title}</div>
                <div className="text-white/90 text-sm md:text-base">{promoBanners.full.subtitle}</div>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  )
}