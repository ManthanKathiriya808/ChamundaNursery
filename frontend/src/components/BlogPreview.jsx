import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const posts = [
  { id: 'care-tips', title: '10 Plant Care Tips for Beginners', date: 'Sep 2024', image: 'https://images.unsplash.com/photo-1470167290877-7d5d2d0a3d95?q=80&w=1200&auto=format&fit=crop' },
  { id: 'air-purifiers', title: 'Best Air-Purifying Plants for Home', date: 'Aug 2024', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=1200&auto=format&fit=crop' },
  { id: 'balcony-garden', title: 'Create a Thriving Balcony Garden', date: 'Jul 2024', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop' }
]

export default function BlogPreview() {
  return (
    <section aria-labelledby="blog-heading" className="py-6 md:py-10">
      <div className="page-container">
        <div className="flex items-end justify-between gap-4 mb-4 md:mb-6">
          <h2 id="blog-heading" className="heading-section">From Our Blog</h2>
          <Link to="/blog" className="btn btn-link">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {posts.map((p, i) => (
            <Link key={p.id} to={`/blog/${p.id}`} className="group block">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: 'easeOut' }}
                className="surface rounded-xl overflow-hidden"
              >
                <img src={p.image} alt={p.title} className="h-36 md:h-44 w-full object-cover transition-transform duration-500 ease-soft group-hover:scale-105" />
                <div className="p-4">
                  <div className="text-xs md:text-sm text-neutral-500">{p.date}</div>
                  <div className="font-display text-lg md:text-xl font-semibold mt-1 line-clamp-2">{p.title}</div>
                  <div className="mt-2 inline-flex items-center text-primary font-medium">
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}