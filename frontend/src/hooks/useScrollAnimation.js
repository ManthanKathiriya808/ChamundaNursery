import { useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * Custom hook for scroll-triggered animations
 * Provides consistent animation variants and in-view detection
 * 
 * Usage:
 * const { ref, inView, variants } = useScrollAnimation()
 * <motion.div ref={ref} variants={variants.fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
 */
export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null)
  const inView = useInView(ref, {
    once: true,
    margin: '-100px',
    ...options
  })

  // Animation variants for different effects
  const variants = {
    // Fade and slide up from bottom
    fadeUp: {
      hidden: { 
        opacity: 0, 
        y: 60,
        transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
      }
    },

    // Fade and slide in from left
    fadeLeft: {
      hidden: { 
        opacity: 0, 
        x: -60,
        transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
      },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
      }
    },

    // Fade and slide in from right
    fadeRight: {
      hidden: { 
        opacity: 0, 
        x: 60,
        transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
      },
      visible: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
      }
    },

    // Scale up with fade
    scaleUp: {
      hidden: { 
        opacity: 0, 
        scale: 0.8,
        transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
      },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
      }
    },

    // Stagger container for child animations
    staggerContainer: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.1
        }
      }
    },

    // Stagger item for use with staggerContainer
    staggerItem: {
      hidden: { 
        opacity: 0, 
        y: 20,
        transition: { duration: 0.4 }
      },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] }
      }
    }
  }

  return { ref, inView, variants }
}

/**
 * Hook specifically for staggered animations of multiple items
 * Use this when you want to animate a list of items with a stagger effect
 */
export const useStaggerAnimation = (options = {}) => {
  const ref = useRef(null)
  const inView = useInView(ref, {
    once: true,
    margin: '-50px',
    ...options
  })

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
        ...options.stagger
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      transition: { duration: 0.4 }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.6, -0.05, 0.01, 0.99] 
      }
    }
  }

  return { ref, inView, containerVariants, itemVariants }
}