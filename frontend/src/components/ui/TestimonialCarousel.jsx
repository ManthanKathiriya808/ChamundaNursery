import React from 'react'
import { useReducedMotion, useInView } from 'framer-motion'
import { Quote, MapPin } from 'lucide-react'
import ScrollReveal from '../animations/ScrollReveal'

const dummy = [
  {
    name: 'Aarav P.',
    quote: 'Beautiful plants and exceptional service. My balcony feels alive!',
    role: 'Mumbai',
  },
  {
    name: 'Nisha K.',
    quote: 'Premium quality pots and fast delivery. Loved the packaging!',
    role: 'Pune',
  },
  {
    name: 'Rahul S.',
    quote: 'Expert care guides helped me revive my snake plant. Highly recommend.',
    role: 'Ahmedabad',
  },
  {
    name: 'Meera D.',
    quote: 'The catalog is curated with taste. Great experience shopping here.',
    role: 'Bengaluru',
  },
]

export default function TestimonialCarousel({ items = dummy, intervalMs = 4000, className = '' }) {
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
    <section className={`rounded-xl bg-cream shadow-soft ${className}`} aria-label="Testimonials">
      <div
        ref={containerRef}
        className="flex overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory scrollbar-hide gap-6 px-4 py-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.map((t, idx) => (
          <ScrollReveal key={idx} variant="fadeUp" className="min-w-[280px] md:min-w-[360px] snap-start">
            <figure className="rounded-xl bg-white p-5 shadow-card">
              <blockquote className="text-neutral-700">
                <Quote className="inline-block h-5 w-5 text-primary mr-1 align-[-0.2em]" aria-hidden />
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 text-sm text-neutral-600 flex items-center gap-2">
                <span className="font-medium text-neutral-900">{t.name}</span>
                <span aria-hidden>·</span>
                <MapPin className="h-4 w-4 text-neutral-700" aria-hidden />
                <span>{t.role}</span>
              </figcaption>
            </figure>
          </ScrollReveal>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 pb-4">
        {items.map((_, i) => (
          <button
            key={i}
            className={`h-2.5 w-2.5 rounded-full ${active === i ? 'bg-primary' : 'bg-softGray'} hover:bg-primaryLight focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={active === i}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </section>
  )
}