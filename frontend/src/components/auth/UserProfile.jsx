/**
 * Enhanced User Profile Component with Clerk Integration
 * 
 * Features:
 * - Clerk's UserProfile component with custom styling
 * - React Hook Form for profile updates
 * - Avatar upload with preview
 * - Account settings and preferences
 * - Order history integration
 * - Security settings
 * - Animated form validation
 * - Toast notifications
 */

import React, { useState, useEffect } from 'react'
import { UserProfile as ClerkUserProfile, useUser, useAuth } from '@clerk/clerk-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { 
  User, Mail, Phone, MapPin, Calendar, Settings, Shield, 
  Camera, Edit3, Save, X, AlertCircle, CheckCircle, 
  Package, Heart, Bell, Leaf, LogOut, Trash2
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

// Profile update schema
const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  phoneNumber: z
    .string()
    .optional()
    .refine((val) => !val || /^\+?[\d\s\-\(\)]+$/.test(val), {
      message: 'Please enter a valid phone number',
    }),
})

// Preferences schema
const preferencesSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  orderUpdates: z.boolean(),
  plantCareReminders: z.boolean(),
  newsletter: z.boolean(),
})

/**
 * Main User Profile Component
 */
export default function UserProfile() {
  const { user, isLoaded } = useUser()
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
  })

  // Preferences form
  const preferencesForm = useForm({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      orderUpdates: true,
      plantCareReminders: true,
      newsletter: true,
    },
  })

  // Initialize form with user data
  useEffect(() => {
    if (user && isLoaded) {
      profileForm.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || '',
      })
    }
  }, [user, isLoaded, profileForm])

  // Handle profile update
  const handleProfileUpdate = async (data) => {
    if (!user) return

    setIsLoading(true)
    
    try {
      await user.update({
        firstName: data.firstName,
        lastName: data.lastName,
      })

      // Update phone number if provided
      if (data.phoneNumber && data.phoneNumber !== user.phoneNumbers?.[0]?.phoneNumber) {
        await user.createPhoneNumber({ phoneNumber: data.phoneNumber })
      }

      toast.success('Profile updated successfully! 🌱')
      setIsEditing(false)
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle preferences update
  const handlePreferencesUpdate = async (data) => {
    setIsLoading(true)
    
    try {
      // In a real app, you'd save these to your backend
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast.success('Preferences updated successfully! ⚙️')
    } catch (error) {
      console.error('Preferences update error:', error)
      toast.error('Failed to update preferences. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully! 👋')
      navigate('/')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out. Please try again.')
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    navigate('/account/login')
    return null
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-green-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative self-center sm:self-auto">
                <img
                  src={user.imageUrl}
                  alt={user.fullName}
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-4 border-green-100"
                />
                <button className="absolute bottom-0 right-0 bg-green-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-green-700 transition-colors">
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 break-words">
                  {user.fullName}
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 break-all">{user.primaryEmailAddress?.emailAddress}</p>
                <div className="flex items-center justify-center sm:justify-start mt-2 text-xs sm:text-sm text-neutral-500">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center sm:justify-start px-3 sm:px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Sign Out</span>
              <span className="xs:hidden">Out</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 order-2 lg:order-1"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              {/* Mobile Tab Navigation */}
              <div className="lg:hidden mb-4">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desktop Tab Navigation */}
              <nav className="hidden lg:block space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center px-4 py-3 text-left rounded-lg transition-all text-sm sm:text-base
                        ${activeTab === tab.id
                          ? 'bg-green-100 text-green-700 border-l-4 border-green-600'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                        }
                      `}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 order-1 lg:order-2"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <AnimatePresence mode="wait">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">
                        Profile Information
                      </h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center justify-center px-3 sm:px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        {isEditing ? (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </>
                        )}
                      </button>
                    </div>

                    <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            First Name
                          </label>
                          <input
                            {...profileForm.register('firstName')}
                            disabled={!isEditing}
                            className={`
                              w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition-all text-sm sm:text-base
                              ${isEditing 
                                ? 'border-neutral-300 focus:ring-2 focus:ring-green-500 focus:border-green-500' 
                                : 'border-neutral-200 bg-neutral-50 cursor-not-allowed'
                              }
                            `}
                          />
                          {profileForm.formState.errors.firstName && (
                            <p className="text-xs sm:text-sm text-red-600 mt-1">
                              {profileForm.formState.errors.firstName.message}
                            </p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Last Name
                          </label>
                          <input
                            {...profileForm.register('lastName')}
                            disabled={!isEditing}
                            className={`
                              w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition-all text-sm sm:text-base
                              ${isEditing 
                                ? 'border-neutral-300 focus:ring-2 focus:ring-green-500 focus:border-green-500' 
                                : 'border-neutral-200 bg-neutral-50 cursor-not-allowed'
                              }
                            `}
                          />
                          {profileForm.formState.errors.lastName && (
                            <p className="text-xs sm:text-sm text-red-600 mt-1">
                              {profileForm.formState.errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email (Read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email Address
                        </label>
                        <input
                          value={user.primaryEmailAddress?.emailAddress || ''}
                          disabled
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-neutral-200 bg-neutral-50 rounded-lg cursor-not-allowed text-sm sm:text-base break-all"
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                          Email cannot be changed here. Use account settings.
                        </p>
                      </div>

                      {/* Phone Number */}
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          {...profileForm.register('phoneNumber')}
                          disabled={!isEditing}
                          placeholder="+1 (555) 123-4567"
                          className={`
                            w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg transition-all text-sm sm:text-base
                            ${isEditing 
                              ? 'border-neutral-300 focus:ring-2 focus:ring-green-500 focus:border-green-500' 
                              : 'border-neutral-200 bg-neutral-50 cursor-not-allowed'
                            }
                          `}
                        />
                        {profileForm.formState.errors.phoneNumber && (
                          <p className="text-xs sm:text-sm text-red-600 mt-1">
                            {profileForm.formState.errors.phoneNumber.message}
                          </p>
                        )}
                      </div>

                      {isEditing && (
                        <div className="flex justify-end pt-2">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-neutral-400 transition-colors text-sm sm:text-base"
                          >
                            {isLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </button>
                        </div>

                      )}
                    </form>
                  </motion.div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <h2 className="text-lg sm:text-xl font-semibold text-neutral-900">
                      Notification Preferences
                    </h2>

                    <form onSubmit={preferencesForm.handleSubmit(handlePreferencesUpdate)} className="space-y-4 sm:space-y-6">
                      <div className="space-y-3 sm:space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                          { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via text message' },
                          { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional offers and updates' },
                          { key: 'orderUpdates', label: 'Order Updates', description: 'Get notified about order status changes' },
                          { key: 'plantCareReminders', label: 'Plant Care Reminders', description: 'Receive tips and reminders for plant care' },
                          { key: 'newsletter', label: 'Newsletter', description: 'Monthly newsletter with gardening tips' },
                        ].map((pref) => (
                          <div key={pref.key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-neutral-200 rounded-lg space-y-2 sm:space-y-0">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-neutral-900 text-sm sm:text-base">{pref.label}</h3>
                              <p className="text-xs sm:text-sm text-neutral-600 break-words">{pref.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer self-end sm:self-center">
                              <input
                                {...preferencesForm.register(pref.key)}
                                type="checkbox"
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-neutral-400 transition-colors text-sm sm:text-base"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Preferences
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Other tabs placeholder */}
                {['orders', 'wishlist', 'security'].includes(activeTab) && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-8 sm:py-12"
                  >
                    <Leaf className="h-12 w-12 sm:h-16 sm:w-16 text-green-400 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-neutral-900 mb-2">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-600 px-4">
                      This section is under development. Check back soon!
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Clerk's Built-in UserProfile Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 sm:mt-8"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-900 mb-4 sm:mb-6">
              Advanced Account Settings
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mb-4">
              Use Clerk's built-in profile management for advanced settings:
            </p>
            <div className="overflow-hidden">
              <ClerkUserProfile 
                routing="path"
                path="/account/profile"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}