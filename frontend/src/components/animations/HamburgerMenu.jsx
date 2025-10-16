import React from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

/**
 * Animated Hamburger Menu Component
 * Features smooth transitions between hamburger and X states
 * 
 * @param {boolean} isOpen - Whether the menu is open (shows X) or closed (shows hamburger)
 * @param {function} onClick - Click handler for the button
 * @param {string} className - Additional CSS classes
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {string} variant - Style variant: 'default', 'minimal', 'rounded'
 */
const HamburgerMenu = ({ 
  isOpen = false, 
  onClick, 
  className = '', 
  size = 'md',
  variant = 'default',
  ariaLabel = 'Toggle menu'
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-10 h-10'
  }

  // Variant styles
  const variantClasses = {
    default: 'p-2 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 shadow-sm hover:shadow-md',
    minimal: 'p-2 rounded-lg hover:bg-neutral-100',
    rounded: 'p-3 rounded-full bg-white border border-neutral-200 shadow-lg hover:shadow-xl'
  }

  return (
    <motion.button
      className={`
        inline-flex items-center justify-center
        transition-all duration-200 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        active:scale-95
        ${variantClasses[variant]}
        ${className}
      `}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className={sizeClasses[size]}>
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="w-full h-full text-neutral-700" />
          ) : (
            <Menu className="w-full h-full text-neutral-700" />
          )}
        </motion.div>
      </div>
      
      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-primary/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={isOpen ? { scale: 1.2, opacity: [0, 0.3, 0] } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{ pointerEvents: 'none' }}
      />
    </motion.button>
  )
}

export default HamburgerMenu