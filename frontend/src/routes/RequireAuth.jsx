import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useUser from '../hooks/useUser.js'

export default function RequireAuth({ children }) {
  const { user } = useUser()
  const location = useLocation()
  const isAuthed = !!user?.isAuthenticated
  if (!isAuthed) {
    return <Navigate to="/account/login" state={{ from: location }} replace />
  }
  return children
}