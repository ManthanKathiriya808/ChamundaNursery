// Reusable ProductCard with rating, tag badges, and hover effects
import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/24/solid'
import ImageLazy from './ImageLazy.jsx'

export default function ProductCard({ id, name, price, image = '/logo.png', tag, rating = 4.5 }) {
  const productId = id
  const stars = Math.round(rating)
  return (
    <Link to={`/product/${productId}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="surface surface-hover p-3"
      >
      <div className="relative overflow-hidden rounded-md">
        <ImageLazy src={image} alt={name} className="h-40 md:h-44 w-full object-cover rounded-md bg-neutral-100 transition-transform duration-300 ease-soft group-hover:scale-105" />
        {tag && (
          <span className="absolute top-2 left-2 badge badge-primary">{tag}</span>
        )}
      </div>
      <div className="mt-2 font-display text-xl md:text-2xl font-semibold line-clamp-1">{name}</div>
      <div className="flex items-center justify-between mt-1">
        <div className="text-base md:text-lg text-primary font-semibold">₹{price}</div>
        <div className="flex items-center gap-1" aria-label={`Rating ${rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className={`h-4 w-4 ${i < stars ? 'text-primaryLight' : 'text-neutral-300'}`} />
          ))}
        </div>
      </div>
      </motion.div>
    </Link>
  )
}