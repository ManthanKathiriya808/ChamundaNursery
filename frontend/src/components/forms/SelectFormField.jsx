// Enhanced select field component with react-hook-form integration and animations
// Includes custom dropdown styling and smooth animations
import React, { forwardRef, useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { Controller } from 'react-hook-form'

const SelectFormField = forwardRef(({
  name,
  control,
  rules = {},
  label,
  placeholder = 'Select an option...',
  options = [],
  hint,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error, isTouched } }) => {
        const hasValue = field.value !== undefined && field.value !== null && field.value !== ''
        const hasError = error && isTouched
        const inputId = `field-${name}`
        const describedBy = hasError ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

        const selectedOption = options.find(option => option.value === field.value)

        return (
          <div className={`relative space-y-1 ${className}`}>
            {/* Select Container */}
            <div className="relative">
              {/* Hidden Native Select for Accessibility */}
              <select
                {...field}
                {...props}
                ref={ref}
                id={inputId}
                disabled={disabled}
                aria-invalid={hasError || undefined}
                aria-describedby={describedBy}
                className="sr-only"
                onFocus={() => setIsOpen(true)}
                onBlur={() => setIsOpen(false)}
              >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Custom Select Button */}
              <motion.button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`
                  w-full px-4 pt-6 pb-2 rounded-xl border-2 transition-all duration-300 ease-in-out
                  bg-white/60 backdrop-blur-sm text-left flex items-center justify-between
                  ${hasError 
                    ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                    : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20'
                  }
                  shadow-sm hover:shadow-md focus:shadow-lg
                  disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                  ${hasValue ? 'pt-6 pb-2' : 'py-4'}
                `}
                initial={reduceMotion ? false : { scale: 1 }}
                whileFocus={reduceMotion ? {} : { scale: 1.01 }}
                whileTap={reduceMotion ? {} : { scale: 0.99 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <span className={`${hasValue ? 'text-gray-900' : 'text-gray-500'}`}>
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
                
                {/* Dropdown Arrow */}
                <motion.svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>

              {/* Floating Label */}
              <motion.label
                htmlFor={inputId}
                className={`
                  absolute left-4 pointer-events-none transition-all duration-300 ease-in-out
                  ${hasValue || isOpen
                    ? 'top-2 text-xs text-gray-600 font-medium'
                    : 'top-4 text-base text-gray-500'
                  }
                  ${hasError ? 'text-red-600' : ''}
                `}
                initial={reduceMotion ? false : { y: 0 }}
                animate={reduceMotion ? {} : {
                  y: hasValue || isOpen ? -8 : 0,
                  scale: hasValue || isOpen ? 0.85 : 1
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {label}
                {rules.required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
              </motion.label>

              {/* Dropdown Options */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 max-h-60 overflow-y-auto"
                    initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.95 }}
                    animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
                    exit={reduceMotion ? {} : { opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    {options.map((option, index) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          field.onChange(option.value)
                          setIsOpen(false)
                        }}
                        className={`
                          w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150
                          ${field.value === option.value ? 'bg-primary/10 text-primary font-medium' : 'text-gray-900'}
                          ${index === 0 ? 'rounded-t-xl' : ''}
                          ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                        `}
                        initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                        animate={reduceMotion ? {} : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.15, delay: index * 0.02 }}
                        whileHover={reduceMotion ? {} : { backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option.label}</span>
                          {field.value === option.value && (
                            <motion.svg
                              className="w-4 h-4 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              initial={reduceMotion ? false : { scale: 0 }}
                              animate={reduceMotion ? {} : { scale: 1 }}
                              transition={{ duration: 0.2, delay: 0.1 }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </motion.svg>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Focus Ring Animation */}
              <motion.div
                className={`
                  absolute inset-0 rounded-xl pointer-events-none
                  ${hasError ? 'ring-2 ring-red-200' : 'ring-2 ring-primary/20'}
                  opacity-0
                `}
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
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
                {error.message}
              </motion.p>
            )}

            {/* Overlay to close dropdown when clicking outside */}
            {isOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
            )}
          </div>
        )
      }}
    />
  )
})

SelectFormField.displayName = 'SelectFormField'

export default SelectFormField