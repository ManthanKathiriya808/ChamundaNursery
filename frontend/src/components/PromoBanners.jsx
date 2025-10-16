import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'

export default function PromoBanners() {
  // Animation hooks for different promo sections
  const topBannersAnimation = useScrollAnimation()
  const fullBannerAnimation = useScrollAnimation()

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
          <Link to="/catalog?category=indoor-plants" className="group block">
            <motion.div
              variants={topBannersAnimation.fadeLeft}
              className="rounded-xl overflow-hidden surface p-0"
            >
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1600&auto=format&fit=crop" alt="Indoor Plants" className="h-40 md:h-56 w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent" />
                <div className="absolute left-4 bottom-4">
                  <div className="font-display text-2xl md:text-3xl font-semibold text-white">Breathe Easy with Indoor Greens</div>
                  <div className="text-white/90 text-sm md:text-base">Purify your space with easy-care plants</div>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link to="/catalog?category=planters" className="group block">
            <motion.div
              variants={topBannersAnimation.fadeRight}
              className="rounded-xl overflow-hidden surface p-0"
            >
              <div className="relative">
                <img src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600&auto=format&fit=crop" alt="Planters" className="h-40 md:h-56 w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-transparent" />
                <div className="absolute left-4 bottom-4">
                  <div className="font-display text-2xl md:text-3xl font-semibold text-white">Aesthetic Planters & Pots</div>
                  <div className="text-white/90 text-sm md:text-base">Style your plants to perfection</div>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        <Link to="/catalog?category=fruit-plants" className="group block mt-3 md:mt-4">
          <motion.div
            ref={fullBannerAnimation.ref}
            variants={fullBannerAnimation.scaleUp}
            initial="hidden"
            animate={fullBannerAnimation.inView ? "visible" : "hidden"}
            className="rounded-xl overflow-hidden surface p-0"
          >
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?q=80&w=2000&auto=format&fit=crop" alt="Fruit Plants" className="h-40 md:h-64 w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
              <div className="absolute left-4 bottom-4">
                <div className="font-display text-2xl md:text-3xl font-semibold text-white">Grow Your Own Orchard</div>
                <div className="text-white/90 text-sm md:text-base">Fresh fruits from your balcony</div>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
    </section>
  )
}