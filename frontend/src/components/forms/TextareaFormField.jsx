// Enhanced textarea field component with react-hook-form integration and animations
// Similar to FormField but optimized for multi-line text input
// Features:
// - Enhanced icons for validation states
// - Icon support for better UX
// - Character count with visual feedback
// - Auto-resize functionality
import React, { forwardRef, useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Controller } from 'react-hook-form'
import { CheckCircle, AlertCircle, MessageSquare } from 'lucide-react'

const TextareaFormField = forwardRef(({
  name,
  control,
  rules = {},
  label,
  placeholder = '',
  hint,
  rows = 4,
  className = '',
  disabled = false,
  icon: Icon = MessageSquare,
  showValidationAnimation = true,
  autoResize = false,
  maxRows = 8,
  ...props
}, ref) => {
  const reduceMotion = useReducedMotion()
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef(null)

  // Auto-resize functionality
  const adjustHeight = () => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      const scrollHeight = textarea.scrollHeight
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight)
      const maxHeight = lineHeight * maxRows
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }

  useEffect(() => {
    if (autoResize) {
      adjustHeight()
    }
  }, [autoResize])

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error, isTouched, isValid } }) => {
        const hasValue = field.value && field.value.length > 0
        const hasError = error && isTouched
        const isValidField = isValid && isTouched && hasValue && !hasError
        const inputId = `field-${name}`
        const describedBy = hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

        // Character count calculations
        const currentLength = field.value?.length || 0
        const maxLength = rules.maxLength
        const isNearLimit = maxLength && currentLength > maxLength * 0.8
        const isOverLimit = maxLength && currentLength >= maxLength

        return (
          <div className={`relative space-y-1 ${className}`}>
            {/* Textarea Container */}
            <div className="relative">
              <motion.textarea
                {...field}
                {...props}
                ref={(el) => {
                  textareaRef.current = el
                  if (ref) {
                    if (typeof ref === 'function') ref(el)
                    else ref.current = el
                  }
                }}
                id={inputId}
                rows={autoResize ? 1 : rows}
                placeholder={hasValue || isFocused ? placeholder : ''}
                disabled={disabled}
                aria-invalid={hasError || undefined}
                aria-describedby={describedBy}
                onFocus={(e) => {
                  setIsFocused(true)
                  props.onFocus?.(e)
                }}
                onBlur={(e) => {
                  setIsFocused(false)
                  props.onBlur?.(e)
                }}
                onInput={(e) => {
                  field.onChange(e)
                  if (autoResize) adjustHeight()
                  props.onInput?.(e)
                }}
                className={`
                  peer w-full px-4 pt-6 pb-2 rounded-xl border-2 transition-all duration-300 ease-in-out
                  bg-white/60 backdrop-blur-sm ${autoResize ? 'resize-none' : 'resize-y'}
                  ${hasError 
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                    : isValidField
                    ? 'border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                    : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20'
                  }
                  placeholder:text-gray-400 text-gray-900
                  shadow-sm hover:shadow-md focus:shadow-lg
                  disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                  ${hasValue || isFocused ? 'pt-6 pb-2' : 'py-4'}
                  pr-12
                `}
                initial={reduceMotion ? false : { scale: 1 }}
                whileFocus={reduceMotion ? {} : { scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />

              {/* Floating Label */}
              <motion.label
                htmlFor={inputId}
                className={`
                  absolute left-4 pointer-events-none transition-all duration-300 ease-in-out
                  ${hasValue || isFocused
                    ? 'top-2 text-xs font-medium'
                    : 'top-4 text-base'
                  }
                  ${hasError 
                    ? 'text-red-600' 
                    : isValidField 
                    ? 'text-green-600' 
                    : isFocused 
                    ? 'text-primary' 
                    : 'text-gray-500'
                  }
                `}
                initial={reduceMotion ? false : { y: 0 }}
                animate={reduceMotion ? {} : {
                  y: hasValue || isFocused ? -8 : 0,
                  scale: hasValue || isFocused ? 0.85 : 1
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {label}
                {rules.required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
              </motion.label>

              {/* Icon and Validation Indicators */}
              <div className="absolute right-4 top-6 flex items-center gap-2">
                {/* Validation Animation */}
                {showValidationAnimation && isValidField && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                )}

                {/* Error Animation */}
                {showValidationAnimation && hasError && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </motion.div>
                )}

                {/* Custom Icon */}
                {Icon && !isValidField && !hasError && (
                  <motion.div
                    className={`
                      ${isFocused ? 'text-primary' : 'text-gray-400'}
                    `}
                    initial={{ scale: 1 }}
                    animate={{ scale: isFocused ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                )}
              </div>

              {/* Focus Ring Animation */}
              <motion.div
                className={`
                  absolute inset-0 rounded-xl pointer-events-none
                  ${hasError 
                    ? 'ring-2 ring-red-200' 
                    : isValidField 
                    ? 'ring-2 ring-green-200' 
                    : 'ring-2 ring-primary/20'
                  }
                  opacity-0
                `}
                animate={{ opacity: isFocused ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />

              {/* Typing Animation */}
              {showValidationAnimation && isFocused && hasValue && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
                </motion.div>
              )}
            </div>

            {/* Character Count */}
            {maxLength && (
              <div className="flex justify-end">
                <motion.span 
                  className={`text-xs font-medium ${
                    isOverLimit 
                      ? 'text-red-500' 
                      : isNearLimit 
                      ? 'text-yellow-600'
                      : 'text-gray-400'
                  }`}
                  animate={{ 
                    scale: isOverLimit ? [1, 1.1, 1] : 1,
                    color: isOverLimit ? '#ef4444' : isNearLimit ? '#d97706' : '#9ca3af'
                  }}
                  transition={{ 
                    scale: { duration: 0.3, repeat: isOverLimit ? Infinity : 0, repeatType: 'reverse' },
                    color: { duration: 0.2 }
                  }}
                >
                  {currentLength}/{maxLength}
                </motion.span>
              </div>
            )}

            {/* Hint Text */}
            {hint && !hasError && (
              <motion.p
                id={`${inputId}-hint`}
                className="text-sm text-gray-500 flex items-center gap-1 px-1"
                initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {hint}
              </motion.p>
            )}

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {hasError && (
                <motion.p
                  id={`${inputId}-error`}
                  role="alert"
                  className="text-sm text-red-600 flex items-center gap-1 font-medium px-1"
                  initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.95 }}
                  animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? {} : { opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <motion.svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={reduceMotion ? false : { rotate: -10 }}
                    animate={reduceMotion ? {} : { rotate: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </motion.svg>
                  {error?.message || error || 'Invalid input'}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence mode="wait">
              {isValidField && !hasError && (
                <motion.p
                  className="text-sm text-green-600 flex items-center gap-1 font-medium px-1"
                  initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.95 }}
                  animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? {} : { opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Looks good!
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        )
      }}
    />
  )
})

TextareaFormField.displayName = 'TextareaFormField'

export default TextareaFormField