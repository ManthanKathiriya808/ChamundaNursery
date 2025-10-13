// Accessible banner slider with fade transitions and keyboard navigation
import React, { useEffect, useRef, useState } from 'react'

const slides = [
  { id: 1, label: 'Premium Indoor Plants', bg: 'bg-accent/60' },
  { id: 2, label: 'Fresh Outdoor Collection', bg: 'bg-primary/20' },
  { id: 3, label: 'Tools & Seeds', bg: 'bg-accent/40' },
]

export default function BannerSlider() {
  const [index, setIndex] = useState(0)
  const timeoutRef = useRef(null)
  const sliderRef = useRef(null)

  // Auto-advance every 4s
  useEffect(() => {
    timeoutRef.current = setTimeout(() => setIndex((i) => (i + 1) % slides.length), 4000)
    return () => clearTimeout(timeoutRef.current)
  }, [index])

  const goto = (i) => {
    setIndex((i + slides.length) % slides.length)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') goto(index + 1)
    if (e.key === 'ArrowLeft') goto(index - 1)
  }

  return (
    <section aria-label="Promotional banners" className="relative" ref={sliderRef}>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Chamunda Nursery promotions"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="h-48 md:h-64 rounded-xl overflow-hidden"
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            aria-hidden={i !== index}
            className={`absolute inset-0 ${s.bg} border border-neutral-200 flex items-center justify-center transition-opacity duration-700 ease-soft ${i === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <span className="text-neutral-800 text-lg md:text-xl">{s.label}</span>
          </div>
        ))}
      </div>
      {/* Controls with accessible labels */}
      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            className={`h-2 w-2 rounded-full ${i === index ? 'bg-primary' : 'bg-neutral-300'} focus:outline-none focus:ring-2 focus:ring-primary`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => goto(i)}
          />
        ))}
      </div>
    </section>
  )
}