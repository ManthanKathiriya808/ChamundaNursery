import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ScrollReveal from '../animations/ScrollReveal'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, A11y, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const defaultSlides = [
  {
    id: 1,
    videoSrc: '/3816531-uhd_3840_2160_30fps.mp4',
    poster: '/img.webp',
    heading: 'Discover Premium Greens',
    subheading: 'Handpicked plants, beautiful pots, and expert care tips.',
    ctaText: 'Shop the Catalog',
    ctaHref: '/catalog',
  },
  {
    id: 2,
    imageSrc: '/img.webp',
    heading: 'Festive Offers',
    subheading: 'Save on seasonal bundles and kits.',
    ctaText: 'Browse Offers',
    ctaHref: '/catalog?tag=offer',
  },
  {
    id: 3,
    imageSrc: '/img.webp',
    heading: 'Indoor Plant Picks',
    subheading: 'Low-maintenance beauties for homes and offices.',
    ctaText: 'Explore Indoor',
    ctaHref: '/catalog?category=indoor',
  },
  {
    id: 4,
    videoSrc: '/3816531-uhd_3840_2160_30fps.mp4',
    poster: '/img.webp',
    heading: 'Seeds & Tools',
    subheading: 'Everything you need to grow from scratch.',
    ctaText: 'Shop Seeds & Tools',
    ctaHref: '/catalog?category=seeds',
  },
  {
    id: 5,
    imageSrc: '/img.webp',
    heading: 'New Arrivals',
    subheading: 'Fresh greens curated for local climates.',
    ctaText: 'Browse New',
    ctaHref: '/catalog?tag=new',
  },
]

export default function VideoHeroCarousel({ slides = defaultSlides, delay = 3000, className = '' }) {
  const reduceMotion = useReducedMotion()
  const [heroHeight, setHeroHeight] = useState('100vh')

  // Calculate dynamic height based on viewport and header
  useEffect(() => {
    const calculateHeight = () => {
      const viewportHeight = window.innerHeight
      
      // Get header height from CSS custom property set by Header component
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 120
      
      // Use full viewport height minus header for true full-page experience
      const calculatedHeight = viewportHeight - headerHeight
      setHeroHeight(`${calculatedHeight}px`)
    }

    // Calculate on mount and resize
    calculateHeight()
    window.addEventListener('resize', calculateHeight)
    
    // Recalculate after a short delay to ensure DOM is fully rendered
    const timeoutId = setTimeout(calculateHeight, 100)
    
    return () => {
      window.removeEventListener('resize', calculateHeight)
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <section className={`relative ${className}`} aria-label="Featured videos and images">
      {/* Full-bleed container with dynamic height calculation */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-neutral-900">
        <Swiper
          modules={[Autoplay, Pagination, A11y, EffectFade]}
          effect="fade"
          loop={slides.length > 1}
          autoplay={{ delay, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          a11y={{ enabled: true }}
          className="w-full"
          style={{ height: heroHeight }}
        >
          {slides.map((s, idx) => (
            <SwiperSlide key={s.id || idx} className="relative">
              <div className="absolute inset-0">
                {s.videoSrc ? (
                  <video
                    className="w-full h-full object-cover"
                    src={s.videoSrc}
                    poster={s.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-hidden
                  />
                ) : (
                  <img
                    className="w-full h-full object-cover"
                    src={s.imageSrc || s.poster}
                    alt={s.alt || s.heading || 'Hero slide'}
                    aria-hidden
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/35 to-black/20" aria-hidden />
              </div>

              <div className="relative z-10 mx-auto max-w-7xl px-4 h-full flex items-center justify-center">
                <ScrollReveal variant="fadeUp" className="max-w-2xl text-center">
                  <h1 className="font-display text-3xl md:text-5xl text-white drop-shadow-sm">{s.heading}</h1>
                  <p className="mt-4 text-neutral-200 md:text-lg">{s.subheading}</p>
                  {s.ctaText && (
                    <motion.a
                      href={s.ctaHref || '/catalog'}
                      className="mt-8 inline-flex items-center rounded-lg bg-primary text-white px-6 py-3 shadow-soft hover:bg-primaryDark transition-colors"
                      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    >
                      {s.ctaText}
                    </motion.a>
                  )}
                </ScrollReveal>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}