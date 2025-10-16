/**
 * Protected Route Component with Clerk Integration
 * 
 * This component provides comprehensive route protection using Clerk's authentication system.
 * It handles different authentication states and provides smooth user experience
 * with loading states and redirects.
 * 
 * Features:
 * - Automatic redirect to sign-in for unauthenticated users
 * - Loading states with custom spinner
 * - Role-based access control (admin routes)
 * - Smooth animations with Framer Motion
 * - Custom error handling
 * - Breadcrumb integration
 * - URL preservation for post-login redirects
 * 
 * Usage Examples:
 * 
 * Basic protection (requires authentication):
 * <ProtectedRoute>
 *   <UserDashboard />
 * </ProtectedRoute>
 * 
 * Admin-only protection:
 * <ProtectedRoute adminOnly={true}>
 *   <AdminPanel />
 * </ProtectedRoute>
 * 
 * Specific role requirement:
 * <ProtectedRoute requiredRole="moderator">
 *   <ModeratorTools />
 * </ProtectedRoute>
 * 
 * Custom fallback URL:
 * <ProtectedRoute fallbackUrl="/custom-login">
 *   <ProtectedContent />
 * </ProtectedRoute>
 */

import React from 'react'
import { useAuth, useUser } from '../../hooks/useAuth'
import { motion } from 'framer-motion'
import { Navigate, useLocation } from 'react-router-dom'
import { Leaf, Shield, Lock, AlertTriangle } from 'lucide-react'

/**
 * Loading Spinner Component
 * 
 * Displays a branded loading spinner while Clerk authentication is initializing.
 * Uses Framer Motion for smooth animations and maintains brand consistency.
 */
function AuthLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-white to-green-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        {/* Rotating leaf icon as loading indicator */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
        >
          <Leaf className="h-8 w-8 text-green-600" />
        </motion.div>
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">
          Authenticating...
        </h2>
        <p className="text-neutral-600">
          Please wait while we verify your access
        </p>
      </motion.div>
    </div>
  )
}

/**
 * Access Denied Component
 * 
 * Displays when a user tries to access a route they don't have permission for.
 * Provides clear feedback about the required role and current user status.
 * 
 * @param {string} requiredRole - The role required to access the route
 * @param {string} userRole - The current user's role
 */
function AccessDenied({ requiredRole, userRole }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-white to-green-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Warning icon */}
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Access Denied
          </h1>
          
          <p className="text-neutral-600 mb-6">
            You don't have permission to access this page.
            {requiredRole && (
              <span className="block mt-2 text-sm">
                Required role: <span className="font-semibold text-red-600">{requiredRole}</span>
                {userRole && (
                  <>
                    <br />
                    Your role: <span className="font-semibold text-neutral-700">{userRole}</span>
                  </>
                )}
              </span>
            )}
          </p>
          
          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-neutral-200 text-neutral-700 py-2 px-4 rounded-lg hover:bg-neutral-300 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/**
 * Main Protected Route Component
 * 
 * This is the core component that handles all route protection logic.
 * It integrates with Clerk's authentication system and provides role-based access control.
 * 
 * @param {React.ReactNode} children - The protected content to render
 * @param {string|null} requiredRole - Specific role required (e.g., 'admin', 'moderator')
 * @param {string} fallbackUrl - URL to redirect to if not authenticated
 * @param {boolean} adminOnly - Shorthand for requiring admin role
 * @param {string} pageTitle - Title for the protected page (for analytics/debugging)
 */
function ProtectedRoute({ 
  children, 
  requiredRole = null,
  fallbackUrl = '/account/login',
  adminOnly = false,
  pageTitle = 'Protected Page'
}) {
  // Clerk authentication hooks
  const { isLoaded, isSignedIn, userId } = useAuth()
  const { user } = useUser()
  const location = useLocation()

  // Show loading spinner while Clerk is initializing
  // This prevents flash of unauthenticated content
  if (!isLoaded) {
    return <AuthLoadingSpinner />
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    // Store the attempted URL for redirect after sign-in
    // This ensures users return to their intended destination
    const returnUrl = `${location.pathname}${location.search}`
    return <Navigate to={`${fallbackUrl}?redirect_url=${encodeURIComponent(returnUrl)}`} replace />
  }

  // Check for admin-only routes
  if (adminOnly) {
    // Get user role from Clerk's publicMetadata
    // This is set in the Clerk dashboard or via API
    const userRole = user?.publicMetadata?.role || 'user'
    
    if (userRole !== 'admin') {
      return <AccessDenied requiredRole="admin" userRole={userRole} />
    }
  }

  // Check for specific role requirements
  if (requiredRole) {
    const userRole = user?.publicMetadata?.role || 'user'
    
    if (userRole !== requiredRole) {
      return <AccessDenied requiredRole={requiredRole} userRole={userRole} />
    }
  }

  // Render the protected content with smooth animation
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Higher-Order Component for Route Protection
 * 
 * Wraps any component with authentication protection.
 * Useful for programmatic route protection or when you can't modify JSX structure.
 * 
 * @param {React.Component} Component - The component to protect
 * @param {Object} options - Protection options (same as ProtectedRoute props)
 * @returns {React.Component} - Protected component
 * 
 * Usage:
 * const ProtectedDashboard = withAuth(Dashboard, { adminOnly: true })
 */
export function withAuth(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

/**
 * User Route Component
 * 
 * Simplified component for protecting user-level routes.
 * Requires authentication but no specific role.
 * 
 * @param {React.ReactNode} children - Content to protect
 * @param {Object} props - Additional props passed to ProtectedRoute
 */
function UserRoute({ children, ...props }) {
  return (
    <ProtectedRoute {...props}>
      {children}
    </ProtectedRoute>
  )
}

/**
 * Admin Route Component
 * 
 * Simplified component for protecting admin-only routes.
 * Automatically sets adminOnly=true.
 * 
 * @param {React.ReactNode} children - Content to protect
 * @param {Object} props - Additional props passed to ProtectedRoute
 */
function AdminRoute({ children, ...props }) {
  return (
    <ProtectedRoute adminOnly={true} {...props}>
      {children}
    </ProtectedRoute>
  )
}

/**
 * Custom Hook for Authentication Status
 * 
 * Provides a convenient way to access authentication state throughout the app.
 * Combines Clerk's useAuth and useUser hooks with additional computed properties.
 * 
 * @returns {Object} Authentication status and user information
 * 
 * Usage:
 * const { isAuthenticated, isAdmin, userRole } = useAuthStatus()
 */
export function useAuthStatus() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  const { user } = useUser()
  
  return {
    // Basic Clerk states
    isLoaded,
    isSignedIn,
    userId,
    user,
    
    // Computed properties for convenience
    userRole: user?.publicMetadata?.role || 'user',
    isAdmin: user?.publicMetadata?.role === 'admin',
    isAuthenticated: isLoaded && isSignedIn,
    isLoading: !isLoaded,
  }
}

/**
 * Route Protection Configuration
 * 
 * Centralized configuration for which routes require protection.
 * This makes it easy to manage route security across the application.
 */
export const routeProtection = {
  // Routes that require any authentication
  user: [
    '/cart',
    '/checkout',
    '/account/profile',
    '/account/orders',
    '/account/settings',
  ],
  
  // Routes that require admin role
  admin: [
    '/admin',
    '/admin/dashboard',
    '/admin/products',
    '/admin/products-enhanced',
    '/admin/orders',
    '/admin/users',
    '/admin/analytics',
    '/admin/settings',
  ],
  
  // Routes that require specific roles
  moderator: [
    '/admin/reviews',
    '/admin/content',
  ],
}

/**
 * Utility function to check if a route requires admin access
 * 
 * @param {string} pathname - The route pathname to check
 * @returns {boolean} - True if the route requires admin access
 */
export function isAdminRoute(pathname) {
  return routeProtection.admin.some(route => {
    // Convert route patterns (e.g., '/admin/:id') to regex
    const routePattern = route.replace(/:[^/]+/g, '[^/]+')
    const regex = new RegExp(`^${routePattern}$`)
    return regex.test(pathname)
  })
}

// Export the main components
export default ProtectedRoute
export { UserRoute, AdminRoute }