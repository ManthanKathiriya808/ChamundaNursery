import React from 'react'
import { useUser, useAuth, useClerkMethods } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  UserIcon, 
  ShieldCheckIcon, 
  CogIcon, 
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

const TestAuth = () => {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const { signOut } = useClerkMethods()

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const testRoutes = [
    {
      name: 'Home',
      path: '/',
      icon: HomeIcon,
      description: 'Public route - accessible to everyone',
      protected: false
    },
    {
      name: 'Sign In',
      path: '/account/login',
      icon: ArrowRightOnRectangleIcon,
      description: 'Authentication page',
      protected: false
    },
    {
      name: 'Sign Up',
      path: '/auth/signup',
      icon: UserIcon,
      description: 'Registration page',
      protected: false
    },
    {
      name: 'Cart',
      path: '/cart',
      icon: ShoppingCartIcon,
      description: 'User protected route',
      protected: true,
      role: 'user'
    },
    {
      name: 'Profile',
      path: '/account/profile',
      icon: UserIcon,
      description: 'User profile page',
      protected: true,
      role: 'user'
    },
    {
      name: 'Orders',
      path: '/account/orders',
      icon: ClipboardDocumentListIcon,
      description: 'User orders page',
      protected: true,
      role: 'user'
    },
    {
      name: 'Admin Dashboard',
      path: '/admin',
      icon: ShieldCheckIcon,
      description: 'Admin only route',
      protected: true,
      role: 'admin'
    },
    {
      name: 'Admin Products',
      path: '/admin/products',
      icon: CogIcon,
      description: 'Admin products management',
      protected: true,
      role: 'admin'
    },
    {
      name: 'Enhanced Products',
      path: '/admin/products-enhanced',
      icon: CogIcon,
      description: 'Enhanced admin products with react-hook-form',
      protected: true,
      role: 'admin'
    },
    {
      name: 'Admin Users',
      path: '/admin/users',
      icon: UserGroupIcon,
      description: 'Admin user management',
      protected: true,
      role: 'admin'
    },
    {
      name: 'Demo Form',
      path: '/demo/form',
      icon: ClipboardDocumentListIcon,
      description: 'Demo form with react-hook-form validation',
      protected: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌱 Chamunda Nursery - Authentication Test
          </h1>
          <p className="text-lg text-gray-600">
            Test all authentication features and protected routes
          </p>
        </motion.div>

        {/* User Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon className="h-6 w-6 mr-2 text-green-600" />
            Authentication Status
          </h2>
          
          {isSignedIn ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={user?.imageUrl}
                  alt={user?.fullName}
                  className="h-16 w-16 rounded-full border-2 border-green-200"
                />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Welcome, {user?.fullName || user?.firstName}!
                  </p>
                  <p className="text-sm text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
                  <p className="text-sm text-green-600">✅ Signed In</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
                <Link
                  to="/account/profile"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-600 mb-4">❌ Not signed in</p>
              <div className="space-x-4">
                <Link
                  to="/account/login"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/signup"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </motion.div>

        {/* Route Testing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
            <ShieldCheckIcon className="h-6 w-6 mr-2 text-green-600" />
            Route Protection Test
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testRoutes.map((route, index) => {
              const Icon = route.icon
              const canAccess = !route.protected || 
                (route.protected && isSignedIn && (
                  route.role === 'user' || 
                  (route.role === 'admin' && user?.publicMetadata?.role === 'admin')
                ))
              
              return (
                <motion.div
                  key={route.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    canAccess 
                      ? 'border-green-200 bg-green-50 hover:border-green-300' 
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-5 w-5 mt-1 ${
                      canAccess ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{route.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{route.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          route.protected 
                            ? route.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {route.protected 
                            ? route.role === 'admin' ? 'Admin Only' : 'User Protected'
                            : 'Public'
                          }
                        </span>
                        
                        {canAccess ? (
                          <Link
                            to={route.path}
                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                          >
                            Visit →
                          </Link>
                        ) : (
                          <span className="text-sm text-red-600">
                            {!isSignedIn ? 'Sign in required' : 'Access denied'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-blue-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            🧪 Testing Instructions
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Try accessing protected routes while signed out (should redirect to sign-in)</li>
            <li>• Sign in and test user-protected routes (cart, profile, orders)</li>
            <li>• Test admin routes (requires admin role in user metadata)</li>
            <li>• Try the demo form to test react-hook-form validation</li>
            <li>• Test the enhanced admin products page with advanced features</li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default TestAuth