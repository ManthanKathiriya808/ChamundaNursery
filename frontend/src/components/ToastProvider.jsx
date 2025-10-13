// Simple toast provider using React Context for real-time notifications
import React, { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = (type, message) => {
    setToasts((t) => [...t, { id: Date.now(), type, message }])
    setTimeout(() => setToasts((t) => t.slice(1)), 3000)
  }
  const value = useMemo(() => ({ push }), [])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="fixed right-4 bottom-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} role="alert" className={`rounded-md px-3 py-2 shadow-premium text-white ${t.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}