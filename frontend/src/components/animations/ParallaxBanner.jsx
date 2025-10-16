// ParallaxBanner: background image with subtle parallax and content overlay
// Accessibility: respects prefers-reduced-motion by disabling parallax
import React from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function ParallaxBanner({
  imageSrc = 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=1920&auto=format&fit=crop',
  heightClass = 'h-[320px] md:h-[440px]',
  overlayClass = 'bg-gradient-to-t from-black/30 via-black/15 to-transparent',
  className = '',
  children,
  ariaLabel = 'Promotional banner',
}) {
  const reduceMotion = useReducedMotion()
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [reduceMotion ? 0 : -60, 0])

  return (
    <section aria-label={ariaLabel} className={`relative ${className}`}>
      {/* Full-bleed container with relative positioning for scroll calculations */}
      <div ref={ref} className={`relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] ${heightClass} overflow-hidden`}>
        <motion.div
          style={{ y, backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          className="absolute inset-0"
          aria-hidden
        />
        <div className={`absolute inset-0 ${overlayClass}`} aria-hidden />
        <div className="relative z-10 h-full">
          {/* Content overlay area */}
          {children}
        </div>
      </div>
    </section>
  )
}