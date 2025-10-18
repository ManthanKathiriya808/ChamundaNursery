/**
 * Clerk JWT Bridge Hook
 * 
 * This hook bridges Clerk authentication with the custom JWT system
 * by generating JWT tokens when users sign in through Clerk and
 * storing them for API calls. Now uses the enhanced user sync functionality.
 */

import { useAuth, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const useClerkJWTBridge = () => {
  // Check if we're in demo mode by checking if Clerk is available
  const isDemoMode = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
                     import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_your_publishable_key_here'

  const [isSyncing, setIsSyncing] = useState(false)
  const [dbUser, setDbUser] = useState(null)

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
    console.log('Clerk JWT Bridge: useEffect triggered', { 
      isDemoMode, 
      isSignedIn, 
      hasUser: !!user, 
      isSyncing,
      clerkUserId: user?.id 
    })
    
    const syncClerkUser = async () => {
      // Skip sync in demo mode
      if (isDemoMode) {
        console.log('Clerk JWT Bridge: Demo mode, skipping sync')
        return
      }

      console.log('Clerk JWT Bridge: Sync triggered', { isSignedIn, hasUser: !!user })

      if (isSignedIn && user && !isSyncing) {
        setIsSyncing(true)
        
        try {
          console.log('Clerk JWT Bridge: Syncing with backend...', {
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User'
          })
          
          // Prepare user data for sync
          const userData = {
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
            name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User',
            role: 'customer' // Default role
          }

          // Check if user has admin role in Clerk metadata
          if (user.publicMetadata?.role === 'admin' || user.privateMetadata?.role === 'admin') {
            userData.role = 'admin'
          }
          
          // Sync with backend to get JWT token (using correct endpoint)
          const response = await fetch(`${BASE_URL}/api/auth/clerk-sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          })

          if (response.ok) {
            const result = await response.json()
            console.log('Clerk JWT Bridge: User synced successfully', result.user)
            
            // Store JWT token and user data for API calls
            localStorage.setItem('auth.token', result.token)
            localStorage.setItem('auth.user', JSON.stringify(result.user))
            setDbUser(result.user)
            
            // Show welcome message for new users
            if (!localStorage.getItem('user_sync_completed')) {
              toast.success(`Welcome ${result.user.name}! Your account has been set up. 🌱`)
              localStorage.setItem('user_sync_completed', 'true')
            }
          } else {
            const errorData = await response.json().catch(() => ({}))
            console.error('Clerk JWT Bridge: Failed to sync with backend', response.status, errorData)
            toast.error('Failed to sync user data. Please refresh the page.')
          }
        } catch (error) {
          console.error('Clerk JWT Bridge: Failed to sync Clerk user:', error)
          toast.error('Failed to sync user data. Please refresh the page.')
        } finally {
          setIsSyncing(false)
        }
      } else if (!isSignedIn) {
        console.log('Clerk JWT Bridge: User signed out, clearing data')
        // Clear data when signed out
        localStorage.removeItem('auth.token')
        localStorage.removeItem('auth.user')
        localStorage.removeItem('user_sync_completed')
        setDbUser(null)
      }
    }

    syncClerkUser()
  }, [isSignedIn, user, isDemoMode])

  return { isSignedIn, user, dbUser, isSyncing }
}