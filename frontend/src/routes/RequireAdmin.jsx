import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useUser from '../hooks/useUser.js'

export default function RequireAdmin({ children }) {
  const { user } = useUser()
  const location = useLocation()
  const isAdmin = user?.isAuthenticated && (user.role === 'admin' || user.isAdmin === true)
  if (!isAdmin) {
    // Redirect to login, preserving attempted location
    return <Navigate to="/account/login" state={{ from: location }} replace />
  }
  return children
}