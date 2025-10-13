// Generic skeleton components for loading states
import React from 'react'

export function SkeletonBox({ className = '' }) {
  return <div className={`animate-pulse bg-neutral-200 ${className}`} aria-hidden="true" />
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3">
      <SkeletonBox className="h-32 rounded-md" />
      <SkeletonBox className="mt-2 h-4 w-2/3 rounded" />
      <SkeletonBox className="mt-1 h-3 w-1/3 rounded" />
    </div>
  )
}