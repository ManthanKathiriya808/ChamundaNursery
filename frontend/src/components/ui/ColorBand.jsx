import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import ScrollReveal from '../animations/ScrollReveal'

// ColorBand: a striking full-width gradient band with CTA.
// - Ideal for announcements or promotions.
// - Full-bleed gradient background with accessible CTA.
export default function ColorBand({
  as = 'section',
  ariaLabel = 'Promotional band',
  title = 'Grow your indoor jungle',
  subtitle = 'Free shipping over ₹499 • 7-day plant guarantee',
  ctaText = 'Shop Now',
  onCtaClick,
  bgClass = 'bg-gradient-to-r from-primary via-primaryDark to-earth',
  className = '',
}) {
  const reduceMotion = useReducedMotion()

  return (
    <ScrollReveal as={as} variant="fadeUp" className={`relative ${className}`} aria-label={ariaLabel}>
      {/* Full-bleed gradient background */}
      <div className={`relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] ${bgClass} py-8 md:py-12 text-white overflow-hidden`}>
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl md:text-3xl">{title}</h2>
              {subtitle && <p className="mt-2 text-white/90">{subtitle}</p>}
            </div>
            <motion.button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-white text-neutral-900 px-5 py-2.5 shadow-soft hover:bg-cream transition-colors focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2"
              aria-label={ctaText}
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <ShoppingCart className="h-4 w-4" aria-hidden />
              {ctaText}
            </motion.button>
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}