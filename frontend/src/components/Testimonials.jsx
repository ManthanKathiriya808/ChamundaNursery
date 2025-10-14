// Testimonials section with animated cards, ARIA semantics, and skeletons
// Advanced patterns explained inline:
// - Animation: framer-motion fade/slide with reduced motion respect
// - State: loading -> fetched with graceful fallback
// - ARIA: region, heading association, and card semantics
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import ImageLazy from './ImageLazy.jsx'
import { SkeletonBox } from './Skeleton.jsx'
import { useData } from '../context/DataProvider.jsx'

export default function Testimonials({ limit = 6 }) {
  const { testimonials, loading } = useData()
  const list = (testimonials || []).slice(0, limit)
  const reduceMotion = useReducedMotion()

  return (
    <section aria-labelledby="testimonials-title" className="page-container">
      <div className="flex items-end justify-between">
        <div>
          <h2 id="testimonials-title" className="heading-section">Loved by plant parents</h2>
          <p className="text-body mt-1">Real reviews from our happy customers</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="surface p-4">
              <SkeletonBox className="h-10 w-10 rounded-full" />
              <SkeletonBox className="mt-3 h-4 w-1/2 rounded" />
              <SkeletonBox className="mt-2 h-3 w-2/3 rounded" />
              <SkeletonBox className="mt-2 h-3 w-full rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
          {list.map((t) => (
            <motion.article
              role="listitem"
              key={t.id}
              className="surface p-4 surface-hover"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <ImageLazy src={t.avatar} alt="Customer avatar" className="h-10 w-10 rounded-full" />
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-neutral-600">{t.location}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1" aria-label={`Rating ${t.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={i < t.rating ? 'currentColor' : 'none'} stroke="currentColor" className={`h-4 w-4 ${i < t.rating ? 'text-amber-500' : 'text-neutral-300'}`} aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.287a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.035a1 1 0 00-.364 1.118l1.07 3.287c.3.921-.755 1.688-1.54 1.118l-2.802-2.035a1 1 0 00-1.176 0l-2.802 2.035c-.784.57-1.838-.197-1.539-1.118l1.07-3.287a1 1 0 00-.365-1.118L2.98 8.714c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.287z" />
                  </svg>
                ))}
              </div>
              <p className="mt-3 text-body">{t.comment}</p>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  )
}