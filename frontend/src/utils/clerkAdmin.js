/**
 * Clerk Admin Utilities
 * 
 * Helper functions for managing admin roles in Clerk and syncing with database
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Update user role in Clerk metadata and sync with database
 * 
 * @param {Object} user - Clerk user object
 * @param {string} newRole - New role ('admin' or 'customer')
 * @returns {Promise<Object>} Updated user data from database
 */
export async function updateUserRole(user, newRole) {
  if (!user) {
    throw new Error('User is required')
  }

  if (!['admin', 'customer'].includes(newRole)) {
    throw new Error('Role must be either "admin" or "customer"')
  }

  try {
    // Update Clerk user metadata
    await user.update({
      publicMetadata: {
        ...user.publicMetadata,
        role: newRole
      }
    })

    console.log(`Updated Clerk metadata for user ${user.id} to role: ${newRole}`)

    // Sync with database
    const userData = {
      clerkUserId: user.id,
      email: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
      name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User',
      role: newRole
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
      throw new Error(errorData.message || `Database sync failed: ${response.status}`)
    }

    const result = await response.json()
    
    // Update localStorage with new user data
    localStorage.setItem('auth.user', JSON.stringify(result.user))
    localStorage.setItem('auth.token', result.token)

    console.log(`Successfully updated user role to ${newRole} in database`)
    
    return result.user

  } catch (error) {
    console.error('Failed to update user role:', error)
    throw error
  }
}

/**
 * Check if a user has admin role
 * 
 * @param {Object} user - Clerk user object
 * @returns {boolean} True if user is admin
 */
export function isAdmin(user) {
  if (!user) return false
  
  return user.publicMetadata?.role === 'admin' || 
         user.privateMetadata?.role === 'admin'
}

/**
 * Get user role from Clerk metadata
 * 
 * @param {Object} user - Clerk user object
 * @returns {string} User role ('admin' or 'customer')
 */
export function getUserRole(user) {
  if (!user) return 'customer'
  
  return user.publicMetadata?.role || 
         user.privateMetadata?.role || 
         'customer'
}

/**
 * Batch update multiple users to admin role
 * This would typically be done through Clerk's backend API
 * 
 * @param {Array} userIds - Array of Clerk user IDs
 * @returns {Promise<Array>} Results of role updates
 */
export async function batchUpdateToAdmin(userIds) {
  const results = []
  
  for (const userId of userIds) {
    try {
      // This would require Clerk's backend API or admin dashboard
      // For now, we'll just return a placeholder
      results.push({
        userId,
        success: false,
        error: 'Batch updates require Clerk backend API access'
      })
    } catch (error) {
      results.push({
        userId,
        success: false,
        error: error.message
      })
    }
  }
  
  return results
}

/**
 * Instructions for manually setting admin role in Clerk Dashboard
 */
export const ADMIN_SETUP_INSTRUCTIONS = {
  title: 'How to Set Admin Role in Clerk Dashboard',
  steps: [
    '1. Go to your Clerk Dashboard (https://dashboard.clerk.com)',
    '2. Navigate to Users section',
    '3. Find the user you want to make admin',
    '4. Click on the user to open their profile',
    '5. Go to the "Metadata" tab',
    '6. In "Public metadata" section, add:',
    '   {"role": "admin"}',
    '7. Save the changes',
    '8. The user will automatically get admin access on next login'
  ],
  note: 'Changes in Clerk metadata will automatically sync to the database when the user logs in next time.'
}

export default {
  updateUserRole,
  isAdmin,
  getUserRole,
  batchUpdateToAdmin,
  ADMIN_SETUP_INSTRUCTIONS
}