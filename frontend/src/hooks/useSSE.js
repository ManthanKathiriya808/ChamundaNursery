import { useEffect, useRef, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'

const useSSE = (url, options = {}) => {
  const eventSourceRef = useRef(null)
  const queryClient = useQueryClient()
  const { onMessage, onError, onOpen, enabled = true } = options

  const connect = useCallback(() => {
    if (!enabled || eventSourceRef.current) return

    try {
      eventSourceRef.current = new EventSource(url)

      eventSourceRef.current.onopen = (event) => {
        console.log('SSE connection opened:', event)
        onOpen?.(event)
      }

      eventSourceRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('SSE message received:', data)
          
          // Handle category-specific events
          if (data.type === 'category_created' || data.type === 'category_updated') {
            // Invalidate categories query to refetch data
            queryClient.invalidateQueries({ queryKey: ['categories'] })
          } else if (data.type === 'category_deleted') {
            // Remove from cache and invalidate
            queryClient.invalidateQueries({ queryKey: ['categories'] })
          }
          
          onMessage?.(data)
        } catch (error) {
          console.error('Error parsing SSE message:', error)
        }
      }

      eventSourceRef.current.onerror = (event) => {
        console.error('SSE connection error:', event)
        onError?.(event)
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            connect()
          }
        }, 5000)
      }
    } catch (error) {
      console.error('Error creating SSE connection:', error)
      onError?.(error)
    }
  }, [url, enabled, onMessage, onError, onOpen, queryClient])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (enabled) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [connect, disconnect, enabled])

  return {
    connect,
    disconnect,
    isConnected: eventSourceRef.current?.readyState === EventSource.OPEN
  }
}

export default useSSE