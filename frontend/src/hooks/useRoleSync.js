/**
 * Role Synchronization Hook
 * 
 * Provides functions to update user roles in both Clerk and database
 * Ensures bidirectional synchronization when roles are changed
 */

import { useState } from 'react'
import { useUser, useClerk } from '@clerk/clerk-react'
import { toast } from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const useRoleSync = () => {
  const { user } = useUser()
  const clerk = useClerk()
  const [loading, setLoading] = useState(false)

  /**
   * Update user role in both Clerk and database
   */
  const updateUserRole = async (userId, newRole, updateSource = 'manual') => {
    if (!user || !clerk) {
      throw new Error('User not authenticated')
    }

    setLoading(true)
    
    try {
      // Get JWT token for API calls
      const token = await user.getToken()
      
      // Update role in database first
      const dbResponse = await fetch(`${API_BASE_URL}/api/admin-sync/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          role: newRole,
          source: updateSource 
        })
      })

      if (!dbResponse.ok) {
        const error = await dbResponse.json()
        throw new Error(error.message || 'Failed to update role in database')
      }

      // Update role in Clerk
      if (userId === user.id) {
        // Update current user's role in Clerk
        await user.update({
          publicMetadata: {
            ...user.publicMetadata,
            role: newRole
          }
        })
      } else {
        // Update another user's role (admin only)
        // This requires Clerk's backend API - we'll call our backend to handle it
        const clerkResponse = await fetch(`${API_BASE_URL}/api/admin-sync/clerk-role`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            clerkId: userId,
            role: newRole
          })
        })

        if (!clerkResponse.ok) {
          const error = await clerkResponse.json()
          console.warn('Failed to update role in Clerk:', error.message)
          // Don't throw here - database update succeeded
        }
      }

      toast.success(`Role updated to ${newRole}`)
      return { success: true, role: newRole }

    } catch (error) {
      console.error('Role update failed:', error)
      toast.error(error.message || 'Failed to update role')
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sync user role from Clerk to database
   */
  const syncRoleFromClerk = async (clerkUser) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)

    try {
      const token = await user.getToken()
      const role = clerkUser.publicMetadata?.role || 'customer'

      const response = await fetch(`${API_BASE_URL}/api/admin-sync/sync-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clerkId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          role: role,
          source: 'clerk'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to sync role from Clerk')
      }

      return { success: true, role }

    } catch (error) {
      console.error('Role sync from Clerk failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Sync user role from database to Clerk
   */
  const syncRoleToClerk = async (dbUser) => {
    if (!user) {
      throw new Error('User not authenticated')
    }

    setLoading(true)

    try {
      const token = await user.getToken()

      const response = await fetch(`${API_BASE_URL}/api/admin-sync/clerk-role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clerkId: dbUser.clerk_id,
          role: dbUser.role,
          source: 'database'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to sync role to Clerk')
      }

      return { success: true, role: dbUser.role }

    } catch (error) {
      console.error('Role sync to Clerk failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Get current user's role from both systems
   */
  const getCurrentUserRoles = async () => {
    if (!user) {
      return { clerk: null, database: null }
    }

    try {
      const token = await user.getToken()
      
      // Get role from Clerk
      const clerkRole = user.publicMetadata?.role || 'customer'

      // Get role from database
      const response = await fetch(`${API_BASE_URL}/api/admin-sync/user-role/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      let databaseRole = null
      if (response.ok) {
        const data = await response.json()
        databaseRole = data.role
      }

      return {
        clerk: clerkRole,
        database: databaseRole,
        synced: clerkRole === databaseRole
      }

    } catch (error) {
      console.error('Failed to get user roles:', error)
      return { clerk: null, database: null, synced: false }
    }
  }

  /**
   * Check if current user has admin privileges
   */
  const isAdmin = () => {
    return user?.publicMetadata?.role === 'admin'
  }

  /**
   * Check if current user can manage roles
   */
  const canManageRoles = () => {
    return isAdmin()
  }

  return {
    updateUserRole,
    syncRoleFromClerk,
    syncRoleToClerk,
    getCurrentUserRoles,
    isAdmin,
    canManageRoles,
    loading
  }
}