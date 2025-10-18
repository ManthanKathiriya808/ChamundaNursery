import React from 'react'
import { User } from 'lucide-react'

/**
 * Avatar component that displays user profile image or initials fallback
 * @param {Object} props
 * @param {Object} props.user - User object from Clerk
 * @param {string} props.size - Size variant: 'sm', 'md', 'lg'
 * @param {string} props.className - Additional CSS classes
 */
export default function Avatar({ user, size = 'md', className = '' }) {
  // Size configurations
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  }

  // Get user's initials from name or email
  const getInitials = (user) => {
    if (!user) return 'U'
    
    // Try to get initials from first and last name
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    }
    
    // Try to get initials from full name
    if (user.fullName) {
      const names = user.fullName.trim().split(' ')
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
      }
      return names[0].charAt(0).toUpperCase()
    }
    
    // Fallback to email initial
    if (user.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress.charAt(0).toUpperCase()
    }
    
    return 'U'
  }

  // Get profile image URL
  const getProfileImageUrl = (user) => {
    if (!user) return null
    
    // Clerk provides imageUrl for profile pictures
    if (user.imageUrl) {
      return user.imageUrl
    }
    
    // Check if user has profile image URL
    if (user.profileImageUrl) {
      return user.profileImageUrl
    }
    
    return null
  }

  const initials = getInitials(user)
  const profileImageUrl = getProfileImageUrl(user)
  const baseClasses = `${sizeClasses[size]} rounded-full flex items-center justify-center font-medium transition-all duration-200`

  // If user has a profile image, show it
  if (profileImageUrl) {
    return (
      <div className={`${baseClasses} ${className}`}>
        <img
          src={profileImageUrl}
          alt={user?.fullName || user?.firstName || 'Profile'}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            // If image fails to load, hide it and show initials fallback
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        {/* Fallback initials (hidden by default, shown if image fails) */}
        <div 
          className="w-full h-full rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center font-medium"
          style={{ display: 'none' }}
        >
          {initials}
        </div>
      </div>
    )
  }

  // Show initials with a nice gradient background
  return (
    <div className={`${baseClasses} bg-gradient-to-br from-green-500 to-green-600 text-white ${className}`}>
      {initials}
    </div>
  )
}

/**
 * Avatar with dropdown trigger styling
 */
export function AvatarButton({ user, size = 'md', className = '', onClick, isOpen = false }) {
  const baseClasses = `cursor-pointer hover:ring-2 hover:ring-green-200 hover:ring-offset-2 transition-all duration-200 ${isOpen ? 'ring-2 ring-green-300 ring-offset-2' : ''}`
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className}`}
      aria-label="User menu"
    >
      <Avatar user={user} size={size} />
    </button>
  )
}