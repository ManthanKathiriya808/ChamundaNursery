/**
 * Custom Clerk Provider with ChamundaNursery theme integration
 * 
 * This component wraps the Clerk authentication provider with custom styling
 * that matches the nursery's brand colors and design system.
 * 
 * Features:
 * - Custom theme colors matching the nursery brand
 * - Responsive design for mobile and desktop
 * - Integration with existing Tailwind CSS classes
 * - Support for custom icons and animations
 * - Development demo mode when Clerk keys are not configured
 */

import React from 'react'
import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react'
import { Leaf } from 'lucide-react'
import DemoAuthProvider from './DemoAuthProvider'

// Get the publishable key from environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key")
}

// Development mode check - allow demo without real Clerk key
const isDevelopmentDemo = PUBLISHABLE_KEY === 'pk_test_your_publishable_key_here'

/**
 * Custom theme configuration for Clerk components
 * Matches ChamundaNursery's design system with green/cream color palette
 */
const clerkTheme = {
  layout: {
    socialButtonsVariant: 'iconButton',
    socialButtonsPlacement: 'bottom',
    showOptionalFields: true,
    logoImageUrl: '/logo.svg', // Use the nursery logo
    logoLinkUrl: '/',
  },
  variables: {
    // Primary colors - matching nursery green theme
    colorPrimary: '#22c55e', // green-500
    colorPrimaryHover: '#16a34a', // green-600
    colorPrimaryActive: '#15803d', // green-700
    
    // Background colors - matching cream/neutral theme
    colorBackground: '#fefce8', // cream background
    colorInputBackground: '#ffffff',
    colorInputText: '#374151', // neutral-700
    
    // Text colors
    colorText: '#374151', // neutral-700
    colorTextSecondary: '#6b7280', // neutral-500
    colorTextOnPrimaryBackground: '#ffffff',
    
    // Border and accent colors
    colorNeutral: '#e5e7eb', // neutral-200
    colorDanger: '#ef4444', // red-500
    colorSuccess: '#22c55e', // green-500
    colorWarning: '#f59e0b', // amber-500
    
    // Typography
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    // Border radius - matching Tailwind defaults
    borderRadius: '0.5rem', // rounded-lg
    
    // Spacing
    spacingUnit: '1rem',
  },
  elements: {
    // Main container styling
    rootBox: {
      backgroundColor: 'transparent',
    },
    
    // Card styling for auth forms
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '0.75rem', // rounded-xl
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
      border: '1px solid #e5e7eb', // border-neutral-200
      padding: '2rem',
    },
    
    // Header styling
    headerTitle: {
      color: '#374151', // neutral-700
      fontSize: '1.5rem', // text-2xl
      fontWeight: '600', // font-semibold
      marginBottom: '0.5rem',
    },
    
    headerSubtitle: {
      color: '#6b7280', // neutral-500
      fontSize: '0.875rem', // text-sm
      marginBottom: '1.5rem',
    },
    
    // Form elements
    formFieldInput: {
      backgroundColor: '#ffffff',
      border: '1px solid #d1d5db', // border-neutral-300
      borderRadius: '0.5rem', // rounded-lg
      padding: '0.75rem 1rem',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease-in-out',
      '&:focus': {
        borderColor: '#22c55e', // green-500
        boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
        outline: 'none',
      },
      '&:hover': {
        borderColor: '#9ca3af', // neutral-400
      },
    },
    
    formFieldLabel: {
      color: '#374151', // neutral-700
      fontSize: '0.875rem', // text-sm
      fontWeight: '500', // font-medium
      marginBottom: '0.5rem',
    },
    
    // Button styling
    formButtonPrimary: {
      backgroundColor: '#22c55e', // green-500
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem', // rounded-lg
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: '#16a34a', // green-600
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      '&:active': {
        backgroundColor: '#15803d', // green-700
        transform: 'translateY(0)',
      },
      '&:disabled': {
        backgroundColor: '#9ca3af', // neutral-400
        cursor: 'not-allowed',
        transform: 'none',
      },
    },
    
    // Social buttons
    socialButtonsBlockButton: {
      border: '1px solid #d1d5db', // border-neutral-300
      borderRadius: '0.5rem',
      padding: '0.75rem',
      backgroundColor: '#ffffff',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        backgroundColor: '#f9fafb', // neutral-50
        borderColor: '#9ca3af', // neutral-400
      },
    },
    
    // Links
    footerActionLink: {
      color: '#22c55e', // green-500
      textDecoration: 'none',
      fontWeight: '500',
      '&:hover': {
        color: '#16a34a', // green-600
        textDecoration: 'underline',
      },
    },
    
    // Error messages
    formFieldErrorText: {
      color: '#ef4444', // red-500
      fontSize: '0.75rem', // text-xs
      marginTop: '0.25rem',
    },
    
    // Loading states
    spinner: {
      color: '#22c55e', // green-500
    },
  },
}

/**
 * ClerkProvider wrapper with development demo mode
 * 
 * In development mode without valid Clerk keys, this component
 * falls back to a demo authentication provider for testing.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {React.ReactElement} Themed Clerk provider or demo provider
 */
export default function ClerkProvider({ children }) {
  // Use demo provider in development when Clerk key is not configured
  if (isDevelopmentDemo) {
    return (
      <DemoAuthProvider>
        <div className="demo-mode-banner bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Leaf className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm">
                <strong>Demo Mode:</strong> Using mock authentication. 
                Configure VITE_CLERK_PUBLISHABLE_KEY for production.
                <br />
                <span className="text-xs">
                  Demo credentials: demo@chamundanursery.com / admin@chamundanursery.com (password: demo123)
                </span>
              </p>
            </div>
          </div>
        </div>
        {children}
      </DemoAuthProvider>
    )
  }

  return (
    <BaseClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      {children}
    </BaseClerkProvider>
  )
}

/**
 * Custom loading component with nursery branding
 * Used during Clerk initialization
 */
export function ClerkLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cream">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Leaf className="w-8 h-8 text-green-500 animate-pulse" />
          <div className="absolute inset-0 w-8 h-8 border-2 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-neutral-600 text-sm font-medium">Loading ChamundaNursery...</p>
      </div>
    </div>
  )
}

/**
 * HOC for protecting routes that require authentication
 * 
 * @param {React.ComponentType} Component - Component to protect
 * @returns {React.ComponentType} Protected component
 */
export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    // This will be implemented with Clerk's useAuth hook
    // For now, return the component as-is
    return <Component {...props} />
  }
}

/**
 * Configuration object for Clerk routing
 * Maps application routes to Clerk's expected paths
 */
export const clerkRoutes = {
  signIn: '/account/login',
  signUp: '/account/register',
  userProfile: '/account/profile',
  afterSignIn: '/',
  afterSignUp: '/catalog',
  afterSignOut: '/',
}

/**
 * Helper function to get user-friendly error messages
 * 
 * @param {string} clerkError - Clerk error code
 * @returns {string} User-friendly error message
 */
export function getClerkErrorMessage(clerkError) {
  const errorMessages = {
    'form_identifier_not_found': 'No account found with this email address.',
    'form_password_incorrect': 'Incorrect password. Please try again.',
    'form_identifier_exists': 'An account with this email already exists.',
    'form_password_pwned': 'This password has been found in a data breach. Please choose a different password.',
    'form_password_length_too_short': 'Password must be at least 8 characters long.',
    'form_username_invalid_character': 'Username contains invalid characters.',
    'form_param_format_invalid': 'Please enter a valid email address.',
  }
  
  return errorMessages[clerkError] || 'An error occurred. Please try again.'
}