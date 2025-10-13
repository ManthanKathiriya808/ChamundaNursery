// Reusable ProductCard with rating, tag badges, and hover effects
import React from 'react'
import { Link } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/24/solid'
import ImageLazy from './ImageLazy.jsx'

export default function ProductCard({ id, name, price, image = '/logo.png', tag, rating = 4.5 }) {
  const productId = id
  const stars = Math.round(rating)
  return (
    <Link to={`/product/${productId}`} className="group block surface surface-hover p-3">
      <div className="relative">
        <ImageLazy src={image} alt={name} className="h-32 w-full object-cover rounded-md bg-neutral-100" />
        {tag && (
          <span className="absolute top-2 left-2 badge badge-primary">{tag}</span>
        )}
      </div>
      <div className="mt-2 font-display text-lg font-normal line-clamp-1">{name}</div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-primary font-semibold">₹{price}</div>
        <div className="flex items-center gap-1" aria-label={`Rating ${rating} out of 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className={`h-4 w-4 ${i < stars ? 'text-primaryLight' : 'text-neutral-300'}`} />
          ))}
        </div>
      </div>
    </Link>
  )
}