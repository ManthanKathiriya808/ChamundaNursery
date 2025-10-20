import React, { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ScrollReveal from '../animations/ScrollReveal'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, A11y, EffectFade, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'

const defaultSlides = [
  {
    id: 1,
    videoSrc: '/3816531-uhd_3840_2160_30fps.mp4',
    poster: '/images/plants/plant1.jpg',
    heading: 'Discover Premium Greens',
    subheading: 'Handpicked plants, beautiful pots, and expert care tips delivered with love.',
    ctaText: 'Shop the Catalog',
    ctaHref: '/catalog',
    alt: 'Beautiful plants in a nursery setting'
  },
  {
    id: 2,
    videoSrc: '/3816531-uhd_3840_2160_30fps.mp4', // Using same video for demo
    poster: '/images/plants/plant2.jpg',
    heading: 'Festive Plant Collections',
    subheading: 'Save on seasonal bundles and curated plant kits for every occasion.',
    ctaText: 'Browse Offers',
    ctaHref: '/catalog?tag=offer',
    alt: 'Seasonal plant collection display'
  },
  {
    id: 3,
    imageSrc: '/images/plants/plant3.jpg',
    heading: 'Indoor Plant Paradise',
    subheading: 'Low-maintenance beauties perfect for homes and offices.',
    ctaText: 'Explore Indoor Plants',
    ctaHref: '/catalog?category=indoor',
    alt: 'Indoor plants in modern home setting'
  },
  {
    id: 4,
    imageSrc: '/images/plants/plant4.jpg',
    heading: 'Seeds & Garden Tools',
    subheading: 'Everything you need to grow your garden from scratch.',
    ctaText: 'Shop Seeds & Tools',
    ctaHref: '/catalog?category=seeds',
    alt: 'Garden tools and seed packets'
  },
  {
    id: 5,
    videoSrc: '/3816531-uhd_3840_2160_30fps.mp4', // Using same video for demo
    poster: '/images/plants/plant5.jpg',
    heading: 'New Plant Arrivals',
    subheading: 'Fresh greens curated for local climates and growing conditions.',
    ctaText: 'Browse New Arrivals',
    ctaHref: '/catalog?tag=new',
    alt: 'New plant arrivals showcase'
  },
]

export default function VideoHeroCarousel({ 
  slides = defaultSlides, 
  delay = 4000, 
  className = '',
  showNavigation = true,
  showPagination = true 
}) {
  const reduceMotion = useReducedMotion()
  const [heroHeight, setHeroHeight] = useState('100vh')
  const [loadedVideos, setLoadedVideos] = useState(new Set())
  const videoRefs = useRef({})

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

  // Handle video loading
  const handleVideoLoad = (slideId) => {
    setLoadedVideos(prev => new Set([...prev, slideId]))
  }

  // Handle video error
  const handleVideoError = (slideId, videoElement) => {
    console.error(`Video failed to load for slide ${slideId}:`, videoElement?.src)
    // Don't hide the video element, let the poster image show instead
  }

  // Preload videos for better performance
  useEffect(() => {
    slides.forEach(slide => {
      if (slide.videoSrc && !loadedVideos.has(slide.id)) {
        const video = document.createElement('video')
        video.src = slide.videoSrc
        video.preload = 'auto' // Changed from 'metadata' to 'auto' for better loading
        video.addEventListener('loadeddata', () => handleVideoLoad(slide.id))
        video.addEventListener('error', () => handleVideoError(slide.id, video))
      }
    })
  }, [slides, loadedVideos])

  return (
    <section className={`relative ${className}`} aria-label="Featured hero carousel">
      {/* Full-bleed container with dynamic height calculation */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-neutral-900">
        <Swiper
          modules={[Autoplay, Pagination, A11y, EffectFade, Navigation]}
          effect="fade"
          loop={slides.length > 1}
          autoplay={{ 
            delay, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          }}
          pagination={showPagination ? { 
            clickable: true,
            bulletClass: 'swiper-pagination-bullet !bg-white/70 !w-3 !h-3',
            bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !scale-125'
          } : false}
          navigation={showNavigation ? {
            nextEl: '.hero-swiper-button-next',
            prevEl: '.hero-swiper-button-prev',
          } : false}
          a11y={{ enabled: true }}
          className="w-full hero-swiper"
          style={{ height: heroHeight }}
          onSlideChange={(swiper) => {
            // Pause all videos when slide changes
            Object.values(videoRefs.current).forEach(video => {
              if (video && !video.paused) {
                video.pause()
              }
            })
            
            // Play current slide video if it exists
            const currentSlide = slides[swiper.realIndex]
            if (currentSlide?.videoSrc && videoRefs.current[currentSlide.id]) {
              const video = videoRefs.current[currentSlide.id]
              video.currentTime = 0
              video.play().catch(console.error)
            }
          }}
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={slide.id || idx} className="relative">
              <div className="absolute inset-0 bg-neutral-900">
                {slide.videoSrc ? (
                  <video
                    ref={el => videoRefs.current[slide.id] = el}
                    className="w-full h-full object-cover"
                    src={slide.videoSrc}
                    poster={slide.poster}
                    autoPlay={idx === 0} // Only autoplay first video
                    loop
                    muted
                    playsInline
                    preload="auto"
                    aria-hidden
                    onLoadedData={() => handleVideoLoad(slide.id)}
                    onError={(e) => handleVideoError(slide.id, e.target)}
                    onCanPlay={(e) => {
                      // Ensure video starts playing when it can
                      if (idx === 0 && e.target.paused) {
                        e.target.play().catch(console.error)
                      }
                    }}
                  />
                ) : (
                  <img
                    className="w-full h-full object-cover"
                    src={slide.imageSrc || slide.poster}
                    alt={slide.alt || slide.heading || 'Hero slide'}
                    aria-hidden
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src)
                      // Fallback to a default image
                      e.target.src = '/logo.png'
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" aria-hidden />
              </div>

              <div className="relative z-10 mx-auto max-w-7xl px-4 h-full flex items-center justify-center">
                <ScrollReveal variant="fadeUp" className="max-w-3xl text-center">
                  <motion.h1 
                    className="font-display text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-lg font-bold leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    {slide.heading}
                  </motion.h1>
                  <motion.p 
                    className="mt-6 text-neutral-100 text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {slide.subheading}
                  </motion.p>
                  {slide.ctaText && (
                    <motion.a
                      href={slide.ctaHref || '/catalog'}
                      className="mt-8 inline-flex items-center rounded-lg bg-primary text-white px-8 py-4 text-lg font-semibold shadow-xl hover:bg-primaryDark hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      {slide.ctaText}
                      <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </motion.a>
                  )}
                </ScrollReveal>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {showNavigation && (
          <>
            <button 
              className="hero-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              className="hero-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
  )
}