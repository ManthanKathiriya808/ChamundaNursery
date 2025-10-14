import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import ScrollReveal from '../animations/ScrollReveal'

export default function SplitSection({
  title,
  bullets = [],
  ctaText,
  onCtaClick = () => {},
  media, // React node (img/video/svg)
  reverse = false,
  className = '',
  bgClass = 'bg-pastel-gray',
}) {
  const reduceMotion = useReducedMotion()
  return (
    <section className={`rounded-xl ${bgClass} py-10 md:py-16 ${className}`}>
      <div className={`container mx-auto px-4 grid md:grid-cols-2 gap-8 md:gap-12 items-center ${reverse ? 'md:[&>*:first-child]:col-start-2' : ''}`}>
        <ScrollReveal variant={reverse ? 'fadeRight' : 'fadeLeft'} className="order-1 md:order-none">
          <div className="relative overflow-hidden rounded-xl shadow-soft bg-cream">
            {media}
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" className="order-2 md:order-none">
          <h2 className="font-display text-2xl md:text-3xl text-neutral-900">{title}</h2>
          <ul className="mt-4 space-y-3">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <Leaf className="mt-0.5 h-4 w-4 text-primary flex-shrink-0" aria-hidden />
                <p className="text-neutral-700">{b}</p>
              </li>
            ))}
          </ul>
          {ctaText && (
            <motion.button
              onClick={onCtaClick}
              className="mt-6 inline-flex items-center rounded-lg bg-primary text-white px-5 py-3 shadow-soft hover:bg-primaryDark transition-colors focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2"
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              {ctaText}
            </motion.button>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}