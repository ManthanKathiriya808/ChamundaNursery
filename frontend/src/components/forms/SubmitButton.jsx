// Animated submit button with disabled state and spinner
// Usage: <SubmitButton loading={submitting}>Submit</SubmitButton>
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function SubmitButton({ loading = false, children = 'Submit', className = '', ...rest }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.button
      type="submit"
      className={`btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      disabled={loading}
      aria-busy={loading || undefined}
      {...(reduceMotion ? {} : { whileTap: { scale: 0.98 } })}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
            <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" opacity="0.75" />
          </svg>
          Processing…
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}