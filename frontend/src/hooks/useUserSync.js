/**
 * Custom hook for syncing Clerk users with PostgreSQL database
 * 
 * This hook automatically syncs user data from Clerk to our backend database
 * whenever a user signs in or signs up. It handles:
 * - New user creation in database
 * - Existing user updates
 * - Role assignment (customer by default, admin if specified)
 * - JWT token generation for backend authentication
 */

import { useEffect, useState } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export function useUserSync() {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncError, setSyncError] = useState(null)
  const [dbUser, setDbUser] = useState(null)

  useEffect(() => {
    // Only sync if user is loaded, signed in, and we haven't synced yet
    if (isLoaded && isSignedIn && user && !isSyncing && !dbUser) {
      syncUserToDatabase()
    }
  }, [isLoaded, isSignedIn, user, isSyncing, dbUser])

  const syncUserToDatabase = async () => {
    if (!user) return

    setIsSyncing(true)
    setSyncError(null)

    try {
      // Prepare user data for sync
      const userData = {
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User',
        role: 'customer' // Default role, can be overridden
      }

      // Check if user has admin role in Clerk metadata
      if (user.publicMetadata?.role === 'admin' || user.privateMetadata?.role === 'admin') {
        userData.role = 'admin'
      }

      console.log('Syncing user to database:', userData)

      // Call the clerk-sync endpoint
      const response = await fetch(`${BASE_URL}/api/clerk-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Sync failed: ${response.status}`)
      }

      const result = await response.json()
      
      // Store user data and token in localStorage for backend authentication
      localStorage.setItem('auth.user', JSON.stringify(result.user))
      localStorage.setItem('auth.token', result.token)
      
      setDbUser(result.user)
      
      console.log('User synced successfully:', result.user)
      
      // Show success toast for new users
      if (result.user && !localStorage.getItem('user_sync_completed')) {
        toast.success(`Welcome ${result.user.name}! Your account has been set up. 🌱`)
        localStorage.setItem('user_sync_completed', 'true')
      }

    } catch (error) {
      console.error('User sync error:', error)
      setSyncError(error.message)
      toast.error('Failed to sync user data. Please refresh the page.')
    } finally {
      setIsSyncing(false)
    }
  }

  // Function to manually trigger sync (useful for role updates)
  const resyncUser = async (newRole = null) => {
    if (!user) return

    setIsSyncing(true)
    setSyncError(null)

    try {
      const userData = {
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User',
        role: newRole || dbUser?.role || 'customer'
      }

      const response = await fetch(`${BASE_URL}/api/clerk-sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Sync failed: ${response.status}`)
      }

      const result = await response.json()
      
      localStorage.setItem('auth.user', JSON.stringify(result.user))
      localStorage.setItem('auth.token', result.token)
      
      setDbUser(result.user)
      
      if (newRole) {
        toast.success(`Role updated to ${newRole} successfully! 🎉`)
      }

    } catch (error) {
      console.error('User resync error:', error)
      setSyncError(error.message)
      toast.error('Failed to update user data.')
    } finally {
      setIsSyncing(false)
    }
  }

  // Clear sync data when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      setDbUser(null)
      setSyncError(null)
      localStorage.removeItem('auth.user')
      localStorage.removeItem('auth.token')
      localStorage.removeItem('user_sync_completed')
    }
  }, [isSignedIn])

  return {
    dbUser,
    isSyncing,
    syncError,
    resyncUser,
    isReady: isLoaded && !isSyncing
  }
}

export default useUserSync