// Accessible, animated input field with label and validation
// How to add new fields with validation:
// - Use this component for text/email/password/etc. Provide `name`, `label`,
//   `value`, and `onChange`. Pass `error` string when invalid, and optional
//   `hint` for helper text.
// - In your page, keep a `form` state object and a `errors` object. Update
//   values via `onChange`, compute `errors` in a `validate()` function.
// - This component wires proper ARIA: `aria-invalid`, `aria-describedby`,
//   and associates `<label>` with the input by `id`.
// How to make forms dynamic (backend or dummy data):
// - On submit, call your API (e.g., `fetch('/api/...')`). While waiting,
//   disable the submit button and show a toast via `useToast()`.
// - For demo, mock a Promise with `setTimeout` and return a fake response,
//   then update UI based on the result.
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function InputField({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  hint,
  error,
  autoComplete,
  onBlur,
  onFocus,
  className = '',
}) {
  const reduceMotion = useReducedMotion()
  const inputId = id || name
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}{required && <span aria-hidden="true" className="text-red-500 ml-1">*</span>}
      </label>
      <motion.input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        aria-required={required || undefined}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy}
        className={`
          w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ease-in-out
          bg-white/50 backdrop-blur-sm
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
            : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
          }
          placeholder:text-gray-400 text-gray-900
          shadow-sm hover:shadow-md focus:shadow-lg
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
        `}
        initial={reduceMotion ? false : { scale: 1 }}
        whileFocus={reduceMotion ? {} : { scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />

      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-sm text-gray-500 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {hint}
        </p>
      )}
      {error && (
        <motion.p
          id={`${inputId}-error`}
          role="alert"
          className="text-sm text-red-600 flex items-center gap-1 font-medium"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error?.message || error || 'Invalid input'}
        </motion.p>
      )}
    </div>
  )
}