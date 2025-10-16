// Animated submit button with disabled state and loading spinner
// Usage: <SubmitButton loading={submitting}>Submit</SubmitButton>
// Enhanced with Lucide icons for better performance and consistency
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Loader2 } from 'lucide-react'


export default function SubmitButton({ loading = false, children = 'Submit', className = '', ...rest }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.button
      type="submit"
      className={`
        w-full px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 ease-in-out
        bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
        shadow-lg hover:shadow-xl focus:shadow-xl
        focus:ring-4 focus:ring-blue-100 focus:outline-none
        disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-md
        transform hover:scale-[1.02] active:scale-[0.98]
        ${className}
      `}
      disabled={loading}
      aria-busy={loading || undefined}
      {...(reduceMotion ? {} : { 
        whileTap: { scale: 0.98 },
        whileHover: { scale: 1.02 }
      })}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          Processing…
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {children}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      )}
    </motion.button>
  )
}