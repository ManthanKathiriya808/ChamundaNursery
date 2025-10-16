// Enhanced submit button component with advanced animations and states
// Features:
// - Multiple loading states with Lottie animations
// - Success/error feedback animations
// - Ripple effects and micro-interactions
// - Accessibility improvements
// - Progress indicators
import React, { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Loader2, Check, X, Send, ArrowRight, Sparkles } from 'lucide-react'

const SubmitFormButton = ({
  children,
  isLoading = false,
  isValid = true,
  disabled = false,
  loadingText = 'Processing...',
  successText = 'Success!',
  errorText = 'Try Again',
  variant = 'primary',
  size = 'md',
  icon: Icon = Send,
  showSuccessAnimation = true,
  showLoadingAnimation = true,
  showRippleEffect = true,
  autoResetSuccess = true,
  successDuration = 2000,
  type = 'submit',
  className = '',
  onClick,
  ...props
}) => {
  const reduceMotion = useReducedMotion()
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [ripples, setRipples] = useState([])
  const [isHovered, setIsHovered] = useState(false)
  const [wasLoading, setWasLoading] = useState(false)
  const buttonRef = useRef(null)
  const rippleTimeouts = useRef([])

  // Handle loading state changes
  useEffect(() => {
    if (wasLoading && !isLoading && showSuccessAnimation) {
      setIsSuccess(true)
      if (autoResetSuccess) {
        setTimeout(() => setIsSuccess(false), successDuration)
      }
    }
    setWasLoading(isLoading)
  }, [isLoading, wasLoading, showSuccessAnimation, autoResetSuccess, successDuration])

  // Cleanup ripple timeouts
  useEffect(() => {
    return () => {
      rippleTimeouts.current.forEach(clearTimeout)
    }
  }, [])

  // Handle ripple effect
  const createRipple = (event) => {
    if (!showRippleEffect || reduceMotion) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const newRipple = {
      id: Date.now(),
      x,
      y,
      size
    }

    setRipples(prev => [...prev, newRipple])

    const timeout = setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)

    rippleTimeouts.current.push(timeout)
  }

  const handleClick = (event) => {
    createRipple(event)
    onClick?.(event)
  }

  // Variant styles
  const variants = {
    primary: {
      base: 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg hover:shadow-xl',
      hover: 'hover:from-primary-dark hover:to-primary',
      disabled: 'disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500',
      loading: 'bg-gradient-to-r from-primary/80 to-primary-dark/80',
      success: 'bg-gradient-to-r from-green-500 to-green-600',
      error: 'bg-gradient-to-r from-red-500 to-red-600'
    },
    secondary: {
      base: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-md hover:shadow-lg border border-gray-300',
      hover: 'hover:from-gray-200 hover:to-gray-300',
      disabled: 'disabled:from-gray-50 disabled:to-gray-100 disabled:text-gray-400',
      loading: 'bg-gradient-to-r from-gray-200/80 to-gray-300/80',
      success: 'bg-gradient-to-r from-green-100 to-green-200 text-green-700',
      error: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
    },
    outline: {
      base: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white',
      hover: 'hover:shadow-lg',
      disabled: 'disabled:border-gray-300 disabled:text-gray-400',
      loading: 'border-primary/60 text-primary/60',
      success: 'border-green-500 text-green-500 hover:bg-green-500',
      error: 'border-red-500 text-red-500 hover:bg-red-500'
    }
  }

  // Size styles
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg min-h-[36px]',
    md: 'px-6 py-3 text-base rounded-xl min-h-[44px]',
    lg: 'px-8 py-4 text-lg rounded-2xl min-h-[52px]'
  }

  // Get current state styles
  const getCurrentVariant = () => {
    if (isSuccess) return variants[variant].success
    if (isError) return variants[variant].error
    if (isLoading) return variants[variant].loading
    return variants[variant].base
  }

  // Button content based on state
  const getButtonContent = () => {
    if (isSuccess) {
      return (
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          {showSuccessAnimation ? (
            <Check className="w-5 h-5" />
          ) : (
            <Check className="w-5 h-5" />
          )}
          <span>{successText}</span>
        </motion.div>
      )
    }

    if (isError) {
      return (
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <X className="w-5 h-5" />
          <span>{errorText}</span>
        </motion.div>
      )
    }

    if (isLoading) {
      return (
        <motion.div
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {showLoadingAnimation ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Loader2 className="w-5 h-5 animate-spin" />
          )}
          <span>{loadingText}</span>
        </motion.div>
      )
    }

    return (
      <motion.div
        className="flex items-center justify-center gap-2"
        whileHover={reduceMotion ? {} : { x: 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {Icon && (
          <motion.div
            animate={isHovered && !reduceMotion ? { 
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )}
        <span>{children}</span>
        {isHovered && !isLoading && !disabled && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled || isLoading}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden font-semibold transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-primary/20
        disabled:cursor-not-allowed disabled:shadow-none
        ${getCurrentVariant()}
        ${variants[variant].hover}
        ${variants[variant].disabled}
        ${sizes[size]}
        ${className}
      `}
      initial={reduceMotion ? false : { scale: 1 }}
      whileHover={reduceMotion ? {} : { 
        scale: disabled || isLoading ? 1 : 1.02,
        y: disabled || isLoading ? 0 : -1
      }}
      whileTap={reduceMotion ? {} : { 
        scale: disabled || isLoading ? 1 : 0.98,
        y: disabled || isLoading ? 0 : 1
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {/* Background Shine Effect */}
      {!disabled && !isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
      )}

      {/* Sparkle Effect on Hover */}
      {isHovered && !disabled && !isLoading && (
        <motion.div
          className="absolute top-2 right-2"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 180 }}
          exit={{ scale: 0, rotate: 360 }}
          transition={{ duration: 0.4 }}
        >
          <Sparkles className="w-3 h-3 text-white/60" />
        </motion.div>
      )}

      {/* Ripple Effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Button Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {getButtonContent()}
        </AnimatePresence>
      </div>

      {/* Loading Progress Bar */}
      {isLoading && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
        />
      )}

      {/* Success Celebration Effect */}
      {isSuccess && showSuccessAnimation && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Validation State Indicator */}
      {!isValid && !isLoading && !disabled && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  )
}

export default SubmitFormButton