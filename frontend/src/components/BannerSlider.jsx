// Accessible banner slider powered by Swiper with autoplay and pagination
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, A11y, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const slides = [
  { id: 1, label: 'Premium Indoor Plants 🌿', bg: 'bg-accent/60' },
  { id: 2, label: 'Fresh Outdoor Collection 🌳', bg: 'bg-primary/20' },
  { id: 3, label: 'Tools & Seeds 🧰🌱', bg: 'bg-accent/40' },
]

export default function BannerSlider() {
  return (
    <section aria-label="Promotional banners" className="relative">
      <Swiper
        modules={[Autoplay, Pagination, A11y, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        a11y={{ enabled: true }}
        className="rounded-xl overflow-hidden h-52 md:h-72 border border-neutral-200"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.id}>
            <div className={`w-full h-full ${s.bg} flex items-center justify-center`}>
              <span className="text-neutral-800 text-2xl md:text-3xl font-display font-semibold drop-shadow-sm">{s.label}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}