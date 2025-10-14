// Accessible, animated textarea field with label and validation
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function TextareaField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  required = false,
  hint,
  error,
  onBlur,
  onFocus,
  className = '',
}) {
  const reduceMotion = useReducedMotion()
  const inputId = id || name
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={`field ${className}`}>
      <label htmlFor={inputId} className="label">
        {label}{required && <span aria-hidden="true" className="text-red-600">*</span>}
      </label>
      <motion.textarea
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        placeholder={placeholder}
        rows={rows}
        required={required}
        aria-required={required || undefined}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy}
        className={`input input-bordered resize-y ${error ? 'border-red-500 focus:border-red-500' : ''}`}
        initial={reduceMotion ? false : { opacity: 1 }}
        animate={reduceMotion ? {} : { opacity: 1 }}
        transition={{ duration: 0.2 }}
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