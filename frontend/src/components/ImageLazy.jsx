// Accessible image with native lazy loading and optional zoom on hover
import React from 'react'

export default function ImageLazy({ src, alt, className = '', zoom = false }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`${className} ${zoom ? 'transition-transform duration-300 ease-soft hover:scale-[1.02]' : ''}`}
    />
  )
}