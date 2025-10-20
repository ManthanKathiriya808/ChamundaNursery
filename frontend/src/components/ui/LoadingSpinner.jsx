import React from 'react'
import { motion } from 'framer-motion'

/**
 * Reusable Loading Spinner Component
 * Provides consistent loading indicators across the application
 * with different sizes and color variants
 */
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'green', 
  className = '',
  text = null 
}) => {
  // Size configurations
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  // Color configurations
  const colorClasses = {
    green: 'border-green-600',
    blue: 'border-blue-600',
    red: 'border-red-600',
    gray: 'border-gray-600',
    white: 'border-white',
  }

  const spinnerClass = `${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin ${className}`

  if (text) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center space-x-2"
      >
        <div className={spinnerClass} />
        <span className="text-sm text-gray-600">{text}</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={spinnerClass}
    />
  )
}

export { LoadingSpinner }
export default LoadingSpinner