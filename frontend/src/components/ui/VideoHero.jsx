import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ScrollReveal from '../animations/ScrollReveal'
// Lightweight promo slider overlay
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, A11y, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

export default function VideoHero({
  videoSrc = '/demo/video/plant-care.mp4',
  poster = 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1920&auto=format&fit=crop',
  heading = 'Nurture Your Green Space',
  subheading = 'Premium plants, pots, and care delivered with love.',
  ctaText = 'Explore Catalog',
  onCtaClick = () => {},
  className = '',
  showSlider = true,
  sliderMessages = [
    { id: 1, text: 'Fresh arrivals 🌿' },
    { id: 2, text: 'Tools & seeds on sale 🧰🌱' },
    { id: 3, text: 'Secure payments ⚡️' },
  ],
}) {
  const reduceMotion = useReducedMotion()

  return (
    <section className={`relative ${className}`} aria-label="Featured video">
      {/* Full-bleed container */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden bg-neutral-900">
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover"
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-black/20" aria-hidden />
        </div>
        <div className="relative z-10 page-container py-20 md:py-28">
          <ScrollReveal variant="fadeUp" className="max-w-2xl">
            <h1 className="font-display text-3xl md:text-5xl text-white drop-shadow-sm">
              {heading}
            </h1>
            <p className="mt-4 text-neutral-200 md:text-lg">
              {subheading}
            </p>
            <motion.button
              onClick={onCtaClick}
              className="mt-8 inline-flex items-center rounded-lg bg-primary text-white px-6 py-3 shadow-soft hover:bg-primaryDark transition-colors"
              whileHover={reduceMotion ? undefined : { scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              {ctaText}
            </motion.button>
          </ScrollReveal>

          {showSlider && (
            <div className="mt-8 max-w-md">
              <section aria-label="Highlights" className="relative">
                <Swiper
                  modules={[Autoplay, Pagination, A11y, EffectFade]}
                  effect="fade"
                  loop
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  a11y={{ enabled: true }}
                  className="rounded-lg overflow-hidden border border-neutral-200 bg-white/90 backdrop-blur"
                >
                  {sliderMessages.map((m) => (
                    <SwiperSlide key={m.id}>
                      <div className="px-4 py-3 text-center text-neutral-900 font-medium">
                        {m.text}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </section>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}