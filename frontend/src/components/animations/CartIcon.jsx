import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

/**
 * Animated Cart Icon Component
 * Features bounce animations when items are added and hover effects
 * 
 * @param {number} itemCount - Number of items in cart
 * @param {function} onClick - Click handler for the cart button
 * @param {string} className - Additional CSS classes
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} showBadge - Whether to show the item count badge
 */
const CartIcon = ({ 
  itemCount = 0, 
  onClick, 
  className = '', 
  size = 'md',
  showBadge = true,
  ariaLabel = 'Open cart'
}) => {
  const prevItemCount = useRef(itemCount)

  // Size configurations
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }

  const buttonSizes = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3'
  }

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 25
      }
    },
    bounce: {
      scale: [1, 1.3, 1],
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center
        rounded-lg border border-neutral-300 bg-white
        hover:bg-neutral-50 hover:border-neutral-400
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        transition-all duration-200 ease-out
        shadow-sm hover:shadow-md
        ${buttonSizes[size]}
        ${className}
      `}
      onClick={onClick}
      aria-label={`${ariaLabel}${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Cart Icon */}
      <div className={sizeClasses[size]}>
        <ShoppingCart className="w-full h-full text-neutral-700" />
      </div>

      {/* Item Count Badge */}
      <AnimatePresence>
        {showBadge && itemCount > 0 && (
          <motion.span
            key={itemCount}
            variants={badgeVariants}
            initial="hidden"
            animate={itemCount > prevItemCount.current ? "bounce" : "visible"}
            exit="hidden"
            className="
              absolute -top-2 -right-2 
              min-w-[20px] h-5 px-1.5
              bg-primary text-white text-xs font-semibold
              rounded-full flex items-center justify-center
              shadow-lg border-2 border-white
            "
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-primary/10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 1.2, opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.4 }}
        style={{ pointerEvents: 'none' }}
      />

      {/* Pulse effect when items are added */}
      <AnimatePresence>
        {itemCount > prevItemCount.current && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-primary"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default CartIcon