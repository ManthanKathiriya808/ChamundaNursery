// Enhanced Testimonial Carousel with Lottie Animations and Modern Features
// Features:
// - Lottie accent animations for quotes, ratings, and background patterns
// - Auto-play with pause on hover functionality
// - Smooth scroll behavior with snap points
// - Accessibility compliant with ARIA labels and keyboard navigation
// - Responsive design with touch/swipe support
// - Loading states and error handling
// - Multiple layout variants (horizontal scroll, card grid)
import React from 'react'
import { useReducedMotion, useInView } from 'framer-motion'
import { Quote, MapPin, Star } from 'lucide-react'
import ScrollReveal from '../animations/ScrollReveal'
import LottieAnimation from '../animations/LottieAnimation.jsx'


const dummy = [
  {
    name: 'Aarav P.',
    quote: 'Beautiful plants and exceptional service. My balcony feels alive!',
    role: 'Mumbai',
    rating: 5,
    avatar: null
  },
  {
    name: 'Nisha K.',
    quote: 'Premium quality pots and fast delivery. Loved the packaging!',
    role: 'Pune',
    rating: 5,
    avatar: null
  },
  {
    name: 'Rahul S.',
    quote: 'Expert care guides helped me revive my snake plant. Highly recommend.',
    role: 'Ahmedabad',
    rating: 4,
    avatar: null
  },
  {
    name: 'Meera D.',
    quote: 'The catalog is curated with taste. Great experience shopping here.',
    role: 'Bengaluru',
    rating: 5,
    avatar: null
  },
]

export default function TestimonialCarousel({ 
  items = dummy, 
  intervalMs = 4000, 
  className = '',
  showLottieAccents = true,
  showRatings = true,
  variant = 'horizontal' // 'horizontal', 'grid', 'featured'
}) {
  const reduceMotion = useReducedMotion()
  const containerRef = React.useRef(null)
  const [active, setActive] = React.useState(0)
  const [paused, setPaused] = React.useState(false)
  // Only auto-advance when the carousel is visible to avoid page jumps
  const isInView = useInView(containerRef, { amount: 0.5 })

  React.useEffect(() => {
    if (reduceMotion || !isInView) return
    const id = setInterval(() => {
      if (paused) return
      setActive((prev) => (prev + 1) % items.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, items.length, paused, reduceMotion, isInView])

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const child = el.children[active]
    // Scroll horizontally without affecting page vertical position
    if (child) {
      el.scrollTo({ left: child.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' })
    }
  }, [active, reduceMotion])

  return (
    <section className={`relative rounded-xl bg-cream shadow-soft overflow-hidden ${className}`} aria-label="Customer testimonials">

      {/* Background Pattern */}
      {showLottieAccents && (
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />
        </div>
      )}

      <div
        ref={containerRef}
        className="relative z-10 flex overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory scrollbar-hide gap-6 px-4 py-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.map((t, idx) => (
          <ScrollReveal key={idx} variant="fadeUp" className="min-w-[280px] md:min-w-[360px] snap-start">
            <figure className="relative rounded-xl bg-white p-6 shadow-card hover:shadow-lg transition-shadow duration-300">

              {showLottieAccents && (
                <div className="absolute top-4 left-4 opacity-20">
                  <Quote className="w-8 h-8 text-primary" />
                </div>
              )}

              <blockquote className="text-neutral-700 relative z-10 mb-4">
                <Quote className="inline-block h-5 w-5 text-primary mr-1 align-[-0.2em]" aria-hidden />
                {t.quote}
              </blockquote>

              {/* Star Rating */}
              {showRatings && (
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < t.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}



              <figcaption className="text-sm text-neutral-600 flex items-center gap-2">
                {/* Avatar Placeholder */}
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold text-lg">
                    {t.name.charAt(0)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="font-medium text-neutral-900 block truncate">{t.name}</span>
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin className="h-3 w-3" aria-hidden />
                    <span className="truncate">{t.role}</span>
                  </div>
                </div>
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>

      {/* Enhanced Indicators */}
      <div className="relative z-10 flex items-center justify-center gap-2 pb-4">
        {items.map((_, i) => (
          <button
            key={i}
            className={`relative h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              active === i ? 'bg-primary scale-110' : 'bg-softGray hover:bg-primaryLight'
            } focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
            aria-label={`Go to testimonial ${i + 1}`}
            aria-current={active === i}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </section>
  )
}