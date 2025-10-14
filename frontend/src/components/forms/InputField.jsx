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
  const ringColor = error ? 'ring-red-500' : 'ring-primary'

  return (
    <div className={`field ${className}`}>
      <label htmlFor={inputId} className="label">
        {label}{required && <span aria-hidden="true" className="text-red-600">*</span>}
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
        className={`input input-bordered ${error ? 'border-red-500 focus:border-red-500' : ''}`}
        initial={reduceMotion ? false : { boxShadow: '0 0 0 0 rgba(0,0,0,0)' }}
        animate={reduceMotion ? {} : { boxShadow: error ? '0 0 0 3px rgba(239,68,68,0.35)' : '0 0 0 0 rgba(0,0,0,0)' }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="hint">{hint}</p>
      )}
      {error && (
        <motion.p
          id={`${inputId}-error`}
          role="alert"
          className="error"
          initial={reduceMotion ? false : { opacity: 0, y: -4 }}
          animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}