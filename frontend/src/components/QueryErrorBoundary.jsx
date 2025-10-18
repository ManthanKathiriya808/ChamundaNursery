/**
 * Query Error Boundary Component
 * 
 * Specialized error boundary for React Query errors
 * Provides retry functionality and better error handling for data fetching
 */

import React from 'react'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { motion } from 'framer-motion'

const QueryErrorFallback = ({ 
  error, 
  resetErrorBoundary, 
  isNetworkError = false,
  retryCount = 0 
}) => {
  const handleRetry = () => {
    resetErrorBoundary()
  }

  const getErrorMessage = () => {
    if (isNetworkError) {
      return "Unable to connect to the server. Please check your internet connection."
    }
    
    if (error?.message?.includes('404')) {
      return "The requested resource was not found."
    }
    
    if (error?.message?.includes('403')) {
      return "You don't have permission to access this resource."
    }
    
    if (error?.message?.includes('500')) {
      return "Server error occurred. Please try again later."
    }
    
    return "Failed to load data. Please try again."
  }

  const getErrorIcon = () => {
    if (isNetworkError) {
      return <WifiOff className="w-8 h-8 text-orange-600" />
    }
    return <AlertCircle className="w-8 h-8 text-red-600" />
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isNetworkError ? 'bg-orange-100' : 'bg-red-100'
          }`}
        >
          {getErrorIcon()}
        </motion.div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isNetworkError ? 'Connection Error' : 'Loading Error'}
        </h3>
        
        <p className="text-gray-600 text-sm mb-6">
          {getErrorMessage()}
        </p>

        <button
          onClick={handleRetry}
          disabled={retryCount >= 3}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            retryCount >= 3
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          {retryCount >= 3 ? 'Max retries reached' : 'Try Again'}
        </button>

        {retryCount > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            Retry attempt: {retryCount}/3
          </p>
        )}
      </motion.div>
    </div>
  )
}

const QueryErrorBoundary = ({ children, fallback }) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => {
            // Check if it's a network error
            const isNetworkError = 
              error?.message?.includes('fetch') ||
              error?.message?.includes('Network') ||
              error?.code === 'NETWORK_ERROR'

            if (fallback) {
              return fallback({ error, resetErrorBoundary, isNetworkError })
            }

            return (
              <QueryErrorFallback
                error={error}
                resetErrorBoundary={resetErrorBoundary}
                isNetworkError={isNetworkError}
              />
            )
          }}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

// Simple error boundary for the QueryErrorBoundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, retryCount: 0 }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Query Error Boundary caught an error:', error, errorInfo)
  }

  componentDidUpdate(prevProps, prevState) {
    const { hasError } = this.state
    const { onReset } = this.props
    
    if (hasError && prevState.hasError && onReset) {
      // Reset was called
      if (prevState.retryCount !== this.state.retryCount) {
        onReset()
      }
    }
  }

  render() {
    const { hasError, error, retryCount } = this.state
    const { fallbackRender, children } = this.props

    if (hasError) {
      const resetErrorBoundary = () => {
        this.setState(prevState => ({
          hasError: false,
          error: null,
          retryCount: prevState.retryCount + 1
        }))
      }

      return fallbackRender({
        error,
        resetErrorBoundary,
        retryCount
      })
    }

    return children
  }
}

// Hook for handling query errors manually
export const useQueryErrorHandler = () => {
  const handleQueryError = (error) => {
    console.error('Query error:', error)
    
    // You can add custom error handling logic here
    // For example, showing toast notifications, logging to external services, etc.
    
    return {
      isNetworkError: error?.message?.includes('fetch') || 
                     error?.message?.includes('Network') ||
                     error?.code === 'NETWORK_ERROR',
      isAuthError: error?.status === 401 || error?.status === 403,
      isServerError: error?.status >= 500,
      isClientError: error?.status >= 400 && error?.status < 500
    }
  }

  return { handleQueryError }
}

export default QueryErrorBoundary