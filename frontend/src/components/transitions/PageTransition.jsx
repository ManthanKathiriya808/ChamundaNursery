import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: 20,
    scale: 0.98
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
}

// Slide variants for different directions
const slideVariants = {
  slideLeft: {
    initial: { opacity: 0, x: -100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 100 }
  },
  slideRight: {
    initial: { opacity: 0, x: 100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -100 }
  },
  slideUp: {
    initial: { opacity: 0, y: 100 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -100 }
  },
  slideDown: {
    initial: { opacity: 0, y: -100 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: 100 }
  }
}

// Fade variants
const fadeVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
}

// Scale variants
const scaleVariants = {
  initial: { opacity: 0, scale: 0.9 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.1 }
}

// Route-specific transition configurations
const routeTransitions = {
  '/': 'default',
  '/products': 'slideLeft',
  '/product': 'slideUp',
  '/cart': 'slideRight',
  '/checkout': 'slideUp',
  '/account/login': 'fade',
  '/account/register': 'fade',
  '/account': 'slideRight',
  '/admin': 'scale',
  '/demo': 'slideDown'
}

// Get transition type based on route
const getTransitionType = (pathname) => {
  // Check for exact matches first
  if (routeTransitions[pathname]) {
    return routeTransitions[pathname]
  }
  
  // Check for partial matches
  for (const route in routeTransitions) {
    if (pathname.startsWith(route) && route !== '/') {
      return routeTransitions[route]
    }
  }
  
  return 'default'
}

// Get variants based on transition type
const getVariants = (transitionType) => {
  switch (transitionType) {
    case 'slideLeft':
      return slideVariants.slideLeft
    case 'slideRight':
      return slideVariants.slideRight
    case 'slideUp':
      return slideVariants.slideUp
    case 'slideDown':
      return slideVariants.slideDown
    case 'fade':
      return fadeVariants
    case 'scale':
      return scaleVariants
    default:
      return pageVariants
  }
}

// Main PageTransition component
const PageTransition = ({ children, className = '' }) => {
  const location = useLocation()
  const transitionType = getTransitionType(location.pathname)
  const variants = getVariants(transitionType)

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={variants}
        transition={pageTransition}
        className={`w-full ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Layout transition for consistent header/footer
const LayoutTransition = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation
const StaggerContainer = ({ children, className = '', delay = 0.1 }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Individual stagger item
const StaggerItem = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Modal transition
const ModalTransition = ({ children, isOpen, onClose, className = '' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Drawer transition (for mobile menus, cart drawer, etc.)
const DrawerTransition = ({ children, isOpen, onClose, direction = 'right', className = '' }) => {
  const getDrawerVariants = (dir) => {
    switch (dir) {
      case 'left':
        return {
          closed: { x: '-100%' },
          open: { x: 0 }
        }
      case 'right':
        return {
          closed: { x: '100%' },
          open: { x: 0 }
        }
      case 'top':
        return {
          closed: { y: '-100%' },
          open: { y: 0 }
        }
      case 'bottom':
        return {
          closed: { y: '100%' },
          open: { y: 0 }
        }
      default:
        return {
          closed: { x: '100%' },
          open: { x: 0 }
        }
    }
  }

  const variants = getDrawerVariants(direction)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={variants}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`fixed z-50 ${className}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Loading transition
const LoadingTransition = ({ isLoading, children, className = '' }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`flex items-center justify-center ${className}`}
        >
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-green-600 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export {
  PageTransition,
  LayoutTransition,
  StaggerContainer,
  StaggerItem,
  ModalTransition,
  DrawerTransition,
  LoadingTransition
}

export default PageTransition