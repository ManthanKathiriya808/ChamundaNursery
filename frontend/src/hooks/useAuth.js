/**
 * Unified Authentication Hook
 * 
 * This hook provides a consistent interface for authentication
 * using Clerk for all environments.
 */

import { useUser as useClerkUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react'

/**
 * Unified user hook using Clerk
 * @returns {Object} User object and loading state
 */
export function useUser() {
  return useClerkUser()
}

/**
 * Unified auth hook using Clerk
 * @returns {Object} Authentication state and methods
 */
export function useAuth() {
  return useClerkAuth()
}

/**
 * Unified clerk methods hook using Clerk
 * @returns {Object} Clerk methods for opening auth modals
 */
export function useClerkMethods() {
  return useClerk()
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