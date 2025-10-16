// Testimonials section with enhanced icons, scroll effects, and ARIA semantics
// Advanced patterns explained inline:
// - Animation: Enhanced scroll-triggered animations with stagger effects
// - Icons: Modern Lucide icons for better engagement
// - State: loading -> fetched with graceful fallback and skeleton states
// - ARIA: region, heading association, and card semantics
// - Performance: Optimized animations with reduced motion support
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ImageLazy from './ImageLazy.jsx'
import { SkeletonBox } from './Skeleton.jsx'
import { useData } from '../context/DataProvider.jsx'
import { Heart, Star, Users, MessageCircle, Award } from 'lucide-react'

import { 
  StaggerContainer, 
  StaggerItem, 
  slideUpVariants,
  scaleInVariants,
  viewportConfig 
} from '../lib/scrollAnimations.jsx'

export default function Testimonials({ limit = 6 }) {
  const { testimonials, loading } = useData()
  const list = (testimonials || []).slice(0, limit)
  const reduceMotion = useReducedMotion()

  return (
    <section aria-labelledby="testimonials-title" className="page-container">
      {/* Enhanced Header with Multiple Lottie Animations */}
      <motion.div 
        className="flex items-end justify-between mb-8"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig.standard}
        variants={slideUpVariants}
      >
        <div className="flex items-center gap-6">
          <div>
            <h2 id="testimonials-title" className="heading-section">Loved by plant parents</h2>
            <p className="text-body mt-1">Real reviews from our happy customers</p>
          </div>
          
          {/* Happy customer icon - main header animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportConfig.standard}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Heart className="w-20 h-20 text-red-500" />
          </motion.div>
        </div>

        {/* Five stars rating icon - positioned top right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewportConfig.standard}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="hidden md:block"
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {loading ? (
        // Enhanced loading state with staggered skeleton animation
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <StaggerItem key={i} variant={scaleInVariants}>
              <div className="surface p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <SkeletonBox className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <SkeletonBox className="h-4 w-24 rounded mb-2" />
                    <SkeletonBox className="h-3 w-20 rounded" />
                  </div>
                </div>
                <SkeletonBox className="h-3 w-full rounded mb-2" />
                <SkeletonBox className="h-3 w-4/5 rounded mb-2" />
                <SkeletonBox className="h-3 w-3/5 rounded" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        // Enhanced testimonials grid with staggered animations
        <StaggerContainer 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
          role="list"
          stagger={0.15}
          delay={0.2}
        >
          {list.map((t, index) => (
            <StaggerItem
              key={t.id}
              variant={scaleInVariants}
              className="group"
            >
              <motion.article
                role="listitem"
                className="surface p-6 rounded-xl surface-hover relative overflow-hidden"
                whileHover={reduceMotion ? {} : { 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Quote marks icon - positioned absolutely */}
                <div className="absolute top-4 right-4 opacity-20">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>

                {/* Customer info with avatar animation */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <ImageLazy 
                      src={t.avatar} 
                      alt={`${t.name}'s avatar`} 
                      className="h-12 w-12 rounded-full object-cover" 
                    />
                    {/* Subtle pulse effect for avatar */}
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse opacity-30"></div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-semibold text-neutral-900">{t.name}</div>
                    <div className="text-sm text-neutral-600 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {t.location}
                    </div>
                  </div>
                </div>

                {/* Rating with enhanced star icons */}
                <div className="flex items-center gap-2 mb-3" aria-label={`Rating ${t.rating} out of 5`}>
                  {t.rating >= 5 ? (
                    // Five stars display for perfect ratings
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  ) : (
                    // Fallback star display for other ratings
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < t.rating ? 'text-yellow-400' : 'text-neutral-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  )}
                  <span className="text-sm text-neutral-600 ml-1">({t.rating}/5)</span>
                </div>

                {/* Testimonial content */}
                <blockquote className="text-neutral-700 leading-relaxed">
                  "{t.comment || t.testimonial || 'Great experience with Chamunda Nursery!'}"
                </blockquote>

                {/* Verified badge for authentic testimonials */}
                {t.verified && (
                  <div className="flex items-center gap-1 mt-3 text-xs text-green-600">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Purchase
                  </div>
                )}
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Call-to-action section with animation */}
      <motion.div
        className="mt-12 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig.standard}
        variants={slideUpVariants}
      >
        <p className="text-neutral-600 mb-4">Join thousands of happy plant parents</p>
        <motion.a
          href="/catalog"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primaryDark transition-colors"
          whileHover={reduceMotion ? {} : { scale: 1.05 }}
          whileTap={reduceMotion ? {} : { scale: 0.95 }}
        >
          Start Your Plant Journey
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.a>
      </motion.div>
    </section>
  )
}