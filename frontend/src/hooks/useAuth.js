/**
 * Unified Authentication Hook
 * 
 * This hook provides a consistent interface for authentication
 * that works with both Clerk (production) and demo mode (development).
 * It automatically detects which provider is being used and returns
 * the appropriate authentication state and methods.
 */

import { useContext } from 'react'
import { useUser as useClerkUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react'
import { useDemoAuth } from '../providers/DemoAuthProvider'

// Check if we're in demo mode
const isDemoMode = !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
                   import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_your_publishable_key_here'

/**
 * Unified user hook that works with both Clerk and demo mode
 * @returns {Object} User object and loading state
 */
export function useUser() {
  if (isDemoMode && !import.meta.env.PROD) {
    try {
      const { user, isLoaded } = useDemoAuth()
      return { user, isLoaded }
    } catch (error) {
      // Fallback if demo context is not available
      return { user: null, isLoaded: true }
    }
  }

  try {
    return useClerkUser()
  } catch (error) {
    // Fallback if Clerk is not properly configured
    return { user: null, isLoaded: true }
  }
}

/**
 * Unified auth hook that works with both Clerk and demo mode
 * @returns {Object} Authentication state and methods
 */
export function useAuth() {
  if (isDemoMode && !import.meta.env.PROD) {
    try {
      const { isSignedIn, isLoaded, signOut } = useDemoAuth()
      return { isSignedIn, isLoaded, signOut }
    } catch (error) {
      // Fallback if demo context is not available
      return { isSignedIn: false, isLoaded: true, signOut: () => {} }
    }
  }

  try {
    return useClerkAuth()
  } catch (error) {
    // Fallback if Clerk is not properly configured
    return { isSignedIn: false, isLoaded: true, signOut: () => {} }
  }
}

/**
 * Unified clerk methods hook that works with both Clerk and demo mode
 * @returns {Object} Clerk-like methods for opening auth modals
 */
export function useClerkMethods() {
  if (isDemoMode && !import.meta.env.PROD) {
    try {
      const { openSignIn, openSignUp, openUserProfile, signOut } = useDemoAuth()
      return { openSignIn, openSignUp, openUserProfile, signOut }
    } catch (error) {
      // Fallback if demo context is not available
      return {
        openSignIn: () => window.location.href = '/account/login',
        openSignUp: () => window.location.href = '/account/register',
        openUserProfile: () => window.location.href = '/account/profile',
        signOut: () => {}
      }
    }
  }

  try {
    return useClerk()
  } catch (error) {
    // Fallback if Clerk is not properly configured
    return {
      openSignIn: () => window.location.href = '/account/login',
      openSignUp: () => window.location.href = '/account/register',
      openUserProfile: () => window.location.href = '/account/profile',
      signOut: () => {}
    }
  }
}

/**
 * Check if user has admin role
 * @returns {boolean} True if user is admin
 */
export function useIsAdmin() {
  const { user } = useUser()
  
  if (isDemoMode && !import.meta.env.PROD) {
    return user?.role === 'admin'
  }
  
  // For Clerk, check public metadata or custom claims
  return user?.publicMetadata?.role === 'admin' || 
         user?.organizationMemberships?.some(membership => 
           membership.role === 'admin' || membership.role === 'org:admin'
         )
}

/**
 * Get user's display name
 * @returns {string} User's display name
 */
export function useUserDisplayName() {
  const { user } = useUser()
  
  if (!user) return 'Guest'
  
  if (isDemoMode && !import.meta.env.PROD) {
    return `${user.firstName} ${user.lastName}`.trim() || user.email
  }
  
  return user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.primaryEmailAddress?.emailAddress || 'User'
}

/**
 * Get authentication status with role information
 * @returns {Object} Complete authentication status
 */
export function useAuthStatus() {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const isAdmin = useIsAdmin()
  const displayName = useUserDisplayName()
  
  return {
    user,
    isLoaded,
    isSignedIn,
    isAdmin,
    displayName,
    isDemoMode: isDemoMode && !import.meta.env.PROD
  }
}