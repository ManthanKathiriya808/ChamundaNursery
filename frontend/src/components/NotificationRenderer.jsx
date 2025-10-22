import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import useUIStore from '../stores/uiStore'

/**
 * NotificationRenderer Component
 * 
 * Renders notifications from the UIStore that are created by mutations
 * and other parts of the app. This bridges the gap between UIStore
 * notifications and the visual display.
 */
const NotificationRenderer = () => {
  const { notifications, removeNotification } = useUIStore()

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <AlertCircle className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      case 'info':
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white'
      case 'error':
        return 'bg-red-500 text-white'
      case 'warning':
        return 'bg-yellow-500 text-white'
      case 'info':
      default:
        return 'bg-blue-500 text-white'
    }
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 25 
            }}
            className={`
              relative rounded-lg shadow-lg p-4 pr-10
              ${getColors(notification.type)}
              backdrop-blur-sm
            `}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                {notification.title && (
                  <h4 className="text-sm font-semibold mb-1">
                    {notification.title}
                  </h4>
                )}
                <p className="text-sm opacity-90">
                  {notification.message}
                </p>
              </div>
            </div>
            
            {/* Close button */}
            <button
              onClick={() => removeNotification(notification.id)}
              className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationRenderer