/**
 * Loading Skeletons for Chamunda Nursery
 * Animated loading states using Framer Motion
 */

import React from 'react'
import { motion } from 'framer-motion'

// Shimmer animation variants
const shimmerVariants = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
}

// Base skeleton component with shimmer effect
const SkeletonBase = ({ className = '', children, ...props }) => (
  <div
    className={`relative overflow-hidden bg-gray-200 rounded-lg ${className}`}
    {...props}
  >
    {children}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
      variants={shimmerVariants}
      initial="initial"
      animate="animate"
    />
  </div>
)

/**
 * Error State Component
 */
export const ErrorState = ({ 
  title = "Something went wrong", 
  message = "Please try again later", 
  onRetry, 
  className = "" 
}) => (
  <motion.div
    className={`text-center py-8 px-4 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-red-400 text-5xl mb-4">⚠️</div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="btn btn-primary"
      >
        Try Again
      </button>
    )}
  </motion.div>
)

/**
 * Empty State Component
 */
export const EmptyState = ({ 
  title = "No items found", 
  message = "Try adjusting your search or filters", 
  icon = "🌱",
  className = "" 
}) => (
  <motion.div
    className={`text-center py-12 px-4 ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="text-neutral-400 text-6xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-neutral-700 mb-2">{title}</h3>
    <p className="text-neutral-500">{message}</p>
  </motion.div>
)

/**
 * Product Card Skeleton
 */
export const ProductCardSkeleton = () => (
  <motion.div
    className="bg-white rounded-xl shadow-lg overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* Product Image */}
    <SkeletonBase className="w-full h-64" />
    
    <div className="p-6 space-y-4">
      {/* Product Name */}
      <SkeletonBase className="h-6 w-3/4" />
      
      {/* Product Description */}
      <div className="space-y-2">
        <SkeletonBase className="h-4 w-full" />
        <SkeletonBase className="h-4 w-2/3" />
      </div>
      
      {/* Price and Category */}
      <div className="flex justify-between items-center">
        <SkeletonBase className="h-6 w-20" />
        <SkeletonBase className="h-5 w-16 rounded-full" />
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <SkeletonBase className="h-10 flex-1 rounded-lg" />
        <SkeletonBase className="h-10 w-10 rounded-lg" />
      </div>
    </div>
  </motion.div>
)

/**
 * Product Grid Skeleton
 */
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
)

/**
 * Blog Card Skeleton
 */
export const BlogCardSkeleton = () => (
  <motion.div
    className="bg-white rounded-xl shadow-lg overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* Blog Image */}
    <SkeletonBase className="w-full h-48" />
    
    <div className="p-6 space-y-4">
      {/* Blog Title */}
      <SkeletonBase className="h-6 w-full" />
      <SkeletonBase className="h-6 w-2/3" />
      
      {/* Blog Excerpt */}
      <div className="space-y-2">
        <SkeletonBase className="h-4 w-full" />
        <SkeletonBase className="h-4 w-full" />
        <SkeletonBase className="h-4 w-3/4" />
      </div>
      
      {/* Meta Info */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          <SkeletonBase className="h-8 w-8 rounded-full" />
          <SkeletonBase className="h-4 w-20" />
        </div>
        <SkeletonBase className="h-4 w-16" />
      </div>
      
      {/* Read More Button */}
      <SkeletonBase className="h-10 w-32 rounded-lg" />
    </div>
  </motion.div>
)

/**
 * Blog Grid Skeleton
 */
export const BlogGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {Array.from({ length: count }).map((_, index) => (
      <BlogCardSkeleton key={index} />
    ))}
  </div>
)

/**
 * Category Skeleton
 */
export const CategorySkeleton = () => (
  <motion.div
    className="bg-white rounded-xl shadow-lg overflow-hidden"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    {/* Category Image */}
    <SkeletonBase className="w-full h-40" />
    
    <div className="p-4 space-y-3">
      {/* Category Name */}
      <SkeletonBase className="h-6 w-3/4" />
      
      {/* Product Count */}
      <SkeletonBase className="h-4 w-1/2" />
    </div>
  </motion.div>
)

/**
 * Hero Section Skeleton
 */
export const HeroSkeleton = () => (
  <motion.div
    className="relative h-96 bg-gray-200 rounded-2xl overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <SkeletonBase className="w-full h-full" />
    
    {/* Hero Content */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-4 max-w-2xl px-6">
        <SkeletonBase className="h-12 w-96 mx-auto" />
        <SkeletonBase className="h-6 w-80 mx-auto" />
        <SkeletonBase className="h-6 w-72 mx-auto" />
        <div className="flex gap-4 justify-center pt-4">
          <SkeletonBase className="h-12 w-32 rounded-lg" />
          <SkeletonBase className="h-12 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  </motion.div>
)

/**
 * Product Detail Skeleton
 */
export const ProductDetailSkeleton = () => (
  <motion.div
    className="max-w-6xl mx-auto px-4 py-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        <SkeletonBase className="w-full h-96 rounded-xl" />
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBase key={index} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="space-y-6">
        <div className="space-y-4">
          <SkeletonBase className="h-8 w-3/4" />
          <SkeletonBase className="h-6 w-1/4" />
          <div className="space-y-2">
            <SkeletonBase className="h-4 w-full" />
            <SkeletonBase className="h-4 w-full" />
            <SkeletonBase className="h-4 w-2/3" />
          </div>
        </div>
        
        <div className="space-y-4">
          <SkeletonBase className="h-12 w-32" />
          <div className="flex gap-4">
            <SkeletonBase className="h-12 flex-1 rounded-lg" />
            <SkeletonBase className="h-12 w-12 rounded-lg" />
          </div>
        </div>
        
        {/* Product Features */}
        <div className="space-y-3">
          <SkeletonBase className="h-6 w-1/3" />
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBase key={index} className="h-4 w-2/3" />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
)

/**
 * Search Results Skeleton
 */
export const SearchResultsSkeleton = ({ count = 6 }) => (
  <div className="space-y-6">
    {/* Search Header */}
    <div className="space-y-2">
      <SkeletonBase className="h-8 w-64" />
      <SkeletonBase className="h-4 w-32" />
    </div>
    
    {/* Results Grid */}
    <ProductGridSkeleton count={count} />
  </div>
)

/**
 * Filter Sidebar Skeleton
 */
export const FilterSidebarSkeleton = () => (
  <div className="space-y-6">
    {/* Categories Filter */}
    <div className="space-y-3">
      <SkeletonBase className="h-6 w-24" />
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonBase key={index} className="h-4 w-full" />
      ))}
    </div>
    
    {/* Price Filter */}
    <div className="space-y-3">
      <SkeletonBase className="h-6 w-16" />
      <SkeletonBase className="h-8 w-full" />
      <div className="flex gap-2">
        <SkeletonBase className="h-8 flex-1" />
        <SkeletonBase className="h-8 flex-1" />
      </div>
    </div>
    
    {/* Other Filters */}
    <div className="space-y-3">
      <SkeletonBase className="h-6 w-20" />
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonBase key={index} className="h-4 w-3/4" />
      ))}
    </div>
  </div>
)

/**
 * Testimonial Skeleton
 */
export const TestimonialSkeleton = () => (
  <motion.div
    className="bg-white rounded-xl shadow-lg p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* Rating Stars */}
    <div className="flex space-x-1 mb-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonBase key={index} className="h-5 w-5 rounded" />
      ))}
    </div>
    
    {/* Testimonial Text */}
    <div className="space-y-2 mb-6">
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-full" />
      <SkeletonBase className="h-4 w-3/4" />
    </div>
    
    {/* User Info */}
    <div className="flex items-center space-x-3">
      <SkeletonBase className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <SkeletonBase className="h-4 w-24" />
        <SkeletonBase className="h-3 w-20" />
      </div>
    </div>
  </motion.div>
)

export default {
  ProductCardSkeleton,
  ProductGridSkeleton,
  BlogCardSkeleton,
  BlogGridSkeleton,
  CategorySkeleton,
  HeroSkeleton,
  ProductDetailSkeleton,
  SearchResultsSkeleton,
  FilterSidebarSkeleton,
  TestimonialSkeleton,
  ErrorState,
  EmptyState,
}
