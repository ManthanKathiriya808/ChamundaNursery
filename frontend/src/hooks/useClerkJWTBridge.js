/**
 * Clerk JWT Bridge Hook
 * 
 * This hook bridges Clerk authentication with the custom JWT system
 * by generating JWT tokens when users sign in through Clerk and
 * storing them for API calls.
 */

import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'

export const useClerkJWTBridge = () => {
  // Check if we're in demo mode by checking if Clerk is available
  const isDemoMode = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
                     import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_your_publishable_key_here'

  let isSignedIn = false
  let user = null
  let getToken = null

  // Only use Clerk hooks if not in demo mode
  if (!isDemoMode) {
    try {
      const auth = useAuth()
      const userData = useUser()
      isSignedIn = auth.isSignedIn
      user = userData.user
      getToken = auth.getToken
    } catch (error) {
      // Fallback if Clerk hooks fail
      console.warn('Clerk hooks not available, falling back to demo mode')
    }
  }

  useEffect(() => {
    const syncClerkUser = async () => {
      // Skip sync in demo mode
      if (isDemoMode) {
        console.log('Clerk JWT Bridge: Demo mode, skipping sync')
        return
      }

      console.log('Clerk JWT Bridge: Sync triggered', { isSignedIn, hasUser: !!user })

      if (isSignedIn && user && getToken) {
        try {
          console.log('Clerk JWT Bridge: Getting Clerk token...')
          // Get Clerk session token
          const clerkToken = await getToken()
          
          console.log('Clerk JWT Bridge: Syncing with backend...', {
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            name: user.fullName || user.firstName || 'User'
          })
          
          // Sync with backend to get JWT token
          const response = await fetch('http://localhost:4000/api/auth/clerk-sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${clerkToken}`
            },
            body: JSON.stringify({
              clerkUserId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              name: user.fullName || user.firstName || 'User'
            })
          })

          if (response.ok) {
            const { token } = await response.json()
            console.log('Clerk JWT Bridge: JWT token received, storing...')
            // Store JWT token for API calls
            localStorage.setItem('auth.token', token)
          } else {
            console.error('Clerk JWT Bridge: Failed to sync with backend', response.status, response.statusText)
          }
        } catch (error) {
          console.error('Clerk JWT Bridge: Failed to sync Clerk user:', error)
        }
      } else {
        console.log('Clerk JWT Bridge: User signed out, clearing token')
        // Clear token when signed out
        localStorage.removeItem('auth.token')
      }
    }

    syncClerkUser()
  }, [isSignedIn, user, getToken, isDemoMode])

  return { isSignedIn, user }
}