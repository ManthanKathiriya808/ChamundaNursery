/**
 * Sync Manager Utility
 * 
 * Handles bidirectional synchronization between Clerk and PostgreSQL database
 * Provides utilities for:
 * - Fetching all users from Clerk
 * - Syncing Clerk users to database
 * - Updating roles in both systems
 * - Resolving sync conflicts
 */

import { toast } from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Get authentication headers for API calls
 */
function getAuthHeaders() {
  const token = localStorage.getItem('auth.token')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  }
}

/**
 * Fetch all users from database
 */
export async function fetchDatabaseUsers() {
  try {
    const response = await fetch(`${BASE_URL}/api/admin-sync/users`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch database users: ${response.status}`)
    }

    const data = await response.json()
    return data.users
  } catch (error) {
    console.error('Error fetching database users:', error)
    toast.error('Failed to fetch database users')
    throw error
  }
}

/**
 * Fetch all users from Clerk (requires Clerk instance)
 */
export async function fetchClerkUsers(clerk) {
  try {
    if (!clerk) {
      throw new Error('Clerk instance is required')
    }

    // Note: This requires Clerk's backend API or admin access
    // For now, we'll use the current user and any cached data
    const users = []
    
    // Get current user if available
    if (clerk.user) {
      users.push({
        clerkUserId: clerk.user.id,
        email: clerk.user.primaryEmailAddress?.emailAddress || clerk.user.emailAddresses?.[0]?.emailAddress,
        name: clerk.user.fullName || `${clerk.user.firstName || ''} ${clerk.user.lastName || ''}`.trim() || clerk.user.username || 'User',
        role: clerk.user.publicMetadata?.role || clerk.user.privateMetadata?.role || 'customer',
        createdAt: clerk.user.createdAt,
        lastSignInAt: clerk.user.lastSignInAt
      })
    }

    return users
  } catch (error) {
    console.error('Error fetching Clerk users:', error)
    toast.error('Failed to fetch Clerk users')
    throw error
  }
}

/**
 * Sync users from Clerk to database
 */
export async function syncClerkToDatabase(clerkUsers) {
  try {
    const response = await fetch(`${BASE_URL}/api/admin-sync/sync-from-clerk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ users: clerkUsers })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Sync failed: ${response.status}`)
    }

    const result = await response.json()
    
    toast.success(
      `Sync completed: ${result.results.created.length} created, ${result.results.updated.length} updated`
    )

    return result
  } catch (error) {
    console.error('Error syncing Clerk to database:', error)
    toast.error('Failed to sync users to database')
    throw error
  }
}

/**
 * Update user role in database
 */
export async function updateUserRoleInDatabase(userId, newRole) {
  try {
    const response = await fetch(`${BASE_URL}/api/admin-sync/user/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role: newRole })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Role update failed: ${response.status}`)
    }

    const result = await response.json()
    toast.success(`User role updated to ${newRole}`)
    
    return result.user
  } catch (error) {
    console.error('Error updating user role in database:', error)
    toast.error('Failed to update user role in database')
    throw error
  }
}

/**
 * Update user role in Clerk metadata
 */
export async function updateUserRoleInClerk(clerkUser, newRole) {
  try {
    if (!clerkUser) {
      throw new Error('Clerk user is required')
    }

    await clerkUser.update({
      publicMetadata: {
        ...clerkUser.publicMetadata,
        role: newRole
      }
    })

    toast.success(`Clerk role updated to ${newRole}`)
    return true
  } catch (error) {
    console.error('Error updating user role in Clerk:', error)
    toast.error('Failed to update user role in Clerk')
    throw error
  }
}

/**
 * Sync user role in both Clerk and database
 */
export async function syncUserRole(clerkUser, databaseUserId, newRole) {
  const results = {
    clerk: false,
    database: false,
    errors: []
  }

  // Update in Clerk first
  try {
    await updateUserRoleInClerk(clerkUser, newRole)
    results.clerk = true
  } catch (error) {
    results.errors.push(`Clerk update failed: ${error.message}`)
  }

  // Update in database
  try {
    await updateUserRoleInDatabase(databaseUserId, newRole)
    results.database = true
  } catch (error) {
    results.errors.push(`Database update failed: ${error.message}`)
  }

  if (results.clerk && results.database) {
    toast.success(`Role successfully updated to ${newRole} in both systems`)
  } else if (results.errors.length > 0) {
    toast.error(`Partial sync failure: ${results.errors.join(', ')}`)
  }

  return results
}

/**
 * Get sync status from database
 */
export async function getSyncStatus() {
  try {
    const response = await fetch(`${BASE_URL}/api/admin-sync/sync-status`, {
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      throw new Error(`Failed to get sync status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error getting sync status:', error)
    toast.error('Failed to get sync status')
    throw error
  }
}

/**
 * Clean up orphaned users (users without clerk_id)
 */
export async function cleanupOrphanedUsers(days = 30) {
  try {
    const response = await fetch(`${BASE_URL}/api/admin-sync/cleanup-orphaned?days=${days}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Cleanup failed: ${response.status}`)
    }

    const result = await response.json()
    toast.success(result.message)
    
    return result
  } catch (error) {
    console.error('Error cleaning up orphaned users:', error)
    toast.error('Failed to cleanup orphaned users')
    throw error
  }
}

/**
 * Compare Clerk and database users to find discrepancies
 */
export function compareUsers(clerkUsers, databaseUsers) {
  const comparison = {
    onlyInClerk: [],
    onlyInDatabase: [],
    inBoth: [],
    roleConflicts: []
  }

  // Create maps for easier lookup
  const clerkMap = new Map(clerkUsers.map(u => [u.clerkUserId, u]))
  const dbMap = new Map(databaseUsers.map(u => [u.clerk_id, u]))

  // Find users only in Clerk
  clerkUsers.forEach(clerkUser => {
    if (!dbMap.has(clerkUser.clerkUserId)) {
      comparison.onlyInClerk.push(clerkUser)
    }
  })

  // Find users only in database
  databaseUsers.forEach(dbUser => {
    if (dbUser.clerk_id && !clerkMap.has(dbUser.clerk_id)) {
      comparison.onlyInDatabase.push(dbUser)
    } else if (!dbUser.clerk_id) {
      comparison.onlyInDatabase.push(dbUser)
    }
  })

  // Find users in both and check for role conflicts
  databaseUsers.forEach(dbUser => {
    if (dbUser.clerk_id && clerkMap.has(dbUser.clerk_id)) {
      const clerkUser = clerkMap.get(dbUser.clerk_id)
      
      comparison.inBoth.push({
        clerk: clerkUser,
        database: dbUser
      })

      // Check for role conflicts
      if (clerkUser.role !== dbUser.role) {
        comparison.roleConflicts.push({
          clerkUserId: clerkUser.clerkUserId,
          email: clerkUser.email,
          name: clerkUser.name,
          clerkRole: clerkUser.role,
          databaseRole: dbUser.role
        })
      }
    }
  })

  return comparison
}

/**
 * Auto-resolve role conflicts (database takes precedence)
 */
export async function resolveRoleConflicts(conflicts, clerk) {
  const results = []

  for (const conflict of conflicts) {
    try {
      // Get the Clerk user object
      const clerkUser = clerk.user?.id === conflict.clerkUserId ? clerk.user : null
      
      if (clerkUser) {
        // Update Clerk to match database
        await updateUserRoleInClerk(clerkUser, conflict.databaseRole)
        results.push({
          clerkUserId: conflict.clerkUserId,
          success: true,
          resolvedTo: conflict.databaseRole
        })
      } else {
        results.push({
          clerkUserId: conflict.clerkUserId,
          success: false,
          error: 'Clerk user not accessible'
        })
      }
    } catch (error) {
      results.push({
        clerkUserId: conflict.clerkUserId,
        success: false,
        error: error.message
      })
    }
  }

  const successCount = results.filter(r => r.success).length
  toast.success(`Resolved ${successCount} of ${conflicts.length} role conflicts`)

  return results
}