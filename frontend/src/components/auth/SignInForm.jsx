/**
 * Sign-In Form Component with Clerk Integration
 * 
 * Features:
 * - Clerk's built-in SignIn component with custom styling
 * - Google sign-in integration
 * - Custom theme matching ChamundaNursery brand
 * - Responsive design
 * - Automatic redirects and session management
 */

import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { Leaf } from 'lucide-react'

export default function SignInForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
          >
            <Leaf className="w-8 h-8 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your ChamundaNursery account</p>
        </div>

        {/* Clerk SignIn Component */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-4"
        >
          <SignIn 
            routing="path"
            path="/account/login"
            fallbackRedirectUrl="/"
            signUpUrl="/account/register"
            appearance={{
              theme: {
                primaryColor: '#16a34a', // Green-600
                primaryColorText: '#ffffff',
                backgroundColor: '#ffffff',
                borderRadius: '0.75rem',
              },
              variables: {
                colorPrimary: '#16a34a',
                colorBackground: '#ffffff',
                colorInputBackground: '#ffffff',
                colorInputText: '#111827',
                colorText: '#374151',
                colorTextSecondary: '#6b7280',
                colorSuccess: '#10b981',
                colorDanger: '#ef4444',
                colorWarning: '#f59e0b',
                borderRadius: '0.5rem',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
                fontWeight: '400',
              },
              elements: {
                formButtonPrimary: {
                  backgroundColor: '#16a34a',
                  '&:hover': {
                    backgroundColor: '#15803d',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 10px 25px rgba(22, 163, 74, 0.3)',
                  },
                  transition: 'all 0.2s ease',
                  borderRadius: '0.5rem',
                  fontSize: '14px',
                  fontWeight: '500',
                },
                card: {
                  boxShadow: 'none',
                  border: 'none',
                  backgroundColor: 'transparent',
                },
                headerTitle: {
                  display: 'none',
                },
                headerSubtitle: {
                  display: 'none',
                },
                socialButtonsBlockButton: {
                  border: '1px solid #e5e7eb',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    borderColor: '#16a34a',
                  },
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s ease',
                },
                formFieldInput: {
                  border: '1px solid #d1d5db',
                  '&:focus': {
                    borderColor: '#16a34a',
                    boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.1)',
                  },
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s ease',
                },
                footerActionLink: {
                  color: '#16a34a',
                  '&:hover': {
                    color: '#15803d',
                  },
                },
              },
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

/**
 * Usage Notes:
 * 
 * 1. Environment Setup:
 *    - Add VITE_CLERK_PUBLISHABLE_KEY to .env.local
 *    - Configure Clerk dashboard with your domain
 * 
 * 2. Customization:
 *    - Modify clerkTheme in ClerkProvider.jsx for styling
 *    - Update validation schema for additional fields
 *    - Add custom animations or icons as needed
 * 
 * 3. Backend Integration:
 *    - Clerk handles authentication automatically
 *    - Use useAuth() hook to get user data
 *    - Implement webhook endpoints for user events
 * 
 * 4. Error Handling:
 *    - Clerk errors are automatically mapped to user-friendly messages
 *    - Toast notifications provide immediate feedback
 *    - Form validation prevents invalid submissions
 */