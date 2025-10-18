import React, { useEffect } from 'react'
import useUIStore from '../stores/uiStore'

const NotificationSystem = () => {
  const { notifications, removeNotification } = useUIStore()

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    notifications.forEach(notification => {
      if (notification.autoRemove !== false) {
        setTimeout(() => {
          removeNotification(notification.id)
        }, 5000)
      }
    })
  }, [notifications, removeNotification])

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`
            max-w-sm p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
            ${notification.type === 'success' ? 'bg-green-500 text-white' : ''}
            ${notification.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${notification.type === 'warning' ? 'bg-yellow-500 text-white' : ''}
            ${notification.type === 'info' ? 'bg-blue-500 text-white' : ''}
          `}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {notification.title && (
                <h4 className="font-semibold text-sm mb-1">
                  {notification.title}
                </h4>
              )}
              <p className="text-sm opacity-90">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-3 text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export { NotificationSystem }
export default NotificationSystem