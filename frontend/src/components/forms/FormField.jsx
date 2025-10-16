// Enhanced form field component with react-hook-form integration and animations
// This component provides:
// - Full react-hook-form integration with Controller
// - Enhanced animations for focus states and validation
// - Floating label animation
// - Better accessibility features
// - Support for various input types
// - Enhanced icons for validation states
// - Icon support for better UX
import React, { forwardRef, useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Controller } from 'react-hook-form'
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  Lock,
  Building,
  Edit3
} from 'lucide-react'

const FormField = forwardRef(({
  name,
  control,
  rules = {},
  type = 'text',
  label,
  placeholder = '',
  hint,
  autoComplete,
  className = '',
  disabled = false,
  icon: Icon,
  showValidationAnimation = true,
  showPasswordToggle = true,
  ...props
}, ref) => {
  const reduceMotion = useReducedMotion()
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const isPasswordField = type === 'password'
  const inputType = isPasswordField && showPassword ? 'text' : type

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

        return (
          <div className={`relative space-y-1 ${className}`}>
            {/* Input Container */}
            <div className="relative">
              <motion.input
                {...field}
                {...props}
                ref={ref}
                id={inputId}
                type={inputType}
                placeholder={hasValue || isFocused ? placeholder : ''}
                autoComplete={autoComplete}
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
                className={`
                  peer w-full px-4 pt-6 pb-2 rounded-xl border-2 transition-all duration-300 ease-in-out
                  bg-white/60 backdrop-blur-sm
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
                  ${Icon || isPasswordField ? 'pr-12' : ''}
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
                    : 'top-1/2 -translate-y-1/2 text-base'
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

              {/* Icon or Password Toggle */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {/* Validation Icon */}
                {showValidationAnimation && isValidField && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
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

                {/* Password Toggle */}
                {isPasswordField && showPasswordToggle && (
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-primary transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </motion.button>
                )}

                {/* Custom Icon */}
                {Icon && !isPasswordField && (
                  <motion.div
                    className={`
                      ${hasError 
                        ? 'text-red-500' 
                        : isValidField 
                        ? 'text-green-500' 
                        : isFocused 
                        ? 'text-primary' 
                        : 'text-gray-400'
                      }
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
                  <Edit3 className="w-4 h-4 text-blue-500" />
                </motion.div>
              )}
            </div>

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

FormField.displayName = 'FormField'

export default FormField