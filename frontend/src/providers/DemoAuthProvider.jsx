/**
 * Demo Authentication Provider for Development
 * 
 * This component provides a mock authentication system for development
 * when Clerk keys are not configured. It simulates the Clerk API
 * to allow testing of authentication flows without requiring real keys.
 */

import React, { createContext, useContext, useState, useEffect } from 'react'

// Mock user data for demo
const DEMO_USERS = {
  'demo@chamundanursery.com': {
    id: 'demo_user_1',
    email: 'demo@chamundanursery.com',
    firstName: 'Demo',
    lastName: 'User',
    role: 'user',
    imageUrl: '/logo.svg'
  },
  'admin@chamundanursery.com': {
    id: 'demo_admin_1',
    email: 'admin@chamundanursery.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    imageUrl: '/logo.svg'
  }
}

const DemoAuthContext = createContext()

export function useDemoAuth() {
  const context = useContext(DemoAuthContext)
  if (!context) {
    throw new Error('useDemoAuth must be used within DemoAuthProvider')
  }
  return context
}

export default function DemoAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      const savedUser = localStorage.getItem('demo_user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsSignedIn(true)
      }
      setIsLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const signIn = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userData = DEMO_USERS[email]
    if (userData && password === 'demo123') {
      setUser(userData)
      setIsSignedIn(true)
      localStorage.setItem('demo_user', JSON.stringify(userData))
      return { success: true }
    }
    
    throw new Error('Invalid credentials. Use demo@chamundanursery.com or admin@chamundanursery.com with password: demo123')
  }

  const signUp = async (email, password, firstName, lastName) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newUser = {
      id: `demo_user_${Date.now()}`,
      email,
      firstName,
      lastName,
      role: 'user',
      imageUrl: '/logo.svg'
    }
    
    setUser(newUser)
    setIsSignedIn(true)
    localStorage.setItem('demo_user', JSON.stringify(newUser))
    return { success: true }
  }

  const signOut = async () => {
    setUser(null)
    setIsSignedIn(false)
    localStorage.removeItem('demo_user')
  }

  const value = {
    user,
    isLoaded,
    isSignedIn,
    signIn,
    signUp,
    signOut,
    // Mock Clerk methods
    openSignIn: () => window.location.href = '/account/login',
    openSignUp: () => window.location.href = '/account/register',
    openUserProfile: () => window.location.href = '/account/profile',
  }

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  )
}

// Mock Clerk hooks for demo mode
export function useUser() {
  const { user, isLoaded } = useDemoAuth()
  return { user, isLoaded }
}

export function useAuth() {
  const { isSignedIn, isLoaded, signOut } = useDemoAuth()
  return { isSignedIn, isLoaded, signOut }
}

export function useClerk() {
  const { openSignIn, openSignUp, openUserProfile, signOut } = useDemoAuth()
  return { openSignIn, openSignUp, openUserProfile, signOut }
}