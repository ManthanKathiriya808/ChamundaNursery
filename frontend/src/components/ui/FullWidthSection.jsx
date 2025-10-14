import React from 'react'
import { useReducedMotion } from 'framer-motion'
import ScrollReveal from '../animations/ScrollReveal'

// FullWidthSection: creates a full-bleed background band with optional overlay.
// - Background spans full viewport width using a bleed technique.
// - Content stays within site container for consistent alignment.
// - Respects reduced motion by keeping reveal subtle.
export default function FullWidthSection({
  as = 'section',
  ariaLabel = 'Full width section',
  bgClass = 'bg-cream',
  overlayClass = '',
  padded = true,
  center = false,
  title,
  subtitle,
  className = '',
  children,
}) {
  const reduceMotion = useReducedMotion()
  const padding = padded ? 'py-10 md:py-16' : ''

  return (
    <ScrollReveal as={as} variant="fadeUp" className={`relative ${className}`} aria-label={ariaLabel}>
      {/* Full-bleed background */}
      <div className={`relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] ${bgClass} ${padding} overflow-hidden`}>
        {overlayClass && <div className={`absolute inset-0 ${overlayClass}`} aria-hidden />}
        {/* Content container */}
        <div className="page-container">
          <div className={`${center ? 'text-center mx-auto' : ''} max-w-3xl`}>
            {title && (
              <h2 className="font-display text-2xl md:text-3xl text-neutral-900">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-3 text-neutral-700">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}