// Toast provider with animated popups/snackbars, ARIA semantics, and queueing
// Advanced patterns:
// - Animation: AnimatePresence + framer-motion spring
// - State: queue with auto-dismiss and manual close
// - ARIA: aria-live polite + role="alert" for accessible announcements
import React, { createContext, useContext, useMemo, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const reduceMotion = useReducedMotion()
  const push = (type, message, { duration = 3000 } = {}) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, message }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, duration)
  }
  const dismiss = (id) => setToasts((t) => t.filter((x) => x.id !== id))
  const value = useMemo(() => ({ push }), [])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="fixed right-4 bottom-4 space-y-2 z-50">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              role="alert"
              initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={reduceMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? {} : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              className={`relative rounded-md px-3 py-2 shadow-premium text-white ${t.type === 'error' ? 'bg-red-600' : t.type === 'warning' ? 'bg-amber-600' : 'bg-green-600'}`}
            >
              <span>{t.message}</span>
              {/* Manual dismiss for keyboard users */}
              <button
                aria-label="Dismiss notification"
                className="absolute right-1 top-1 rounded p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
                onClick={() => dismiss(t.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}