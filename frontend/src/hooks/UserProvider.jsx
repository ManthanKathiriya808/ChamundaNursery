// UserProvider: simple auth state placeholder using React Context
import React, { createContext, useMemo, useState } from 'react'

export const UserContext = createContext(null)

export default function UserProvider({ children }) {
  // Minimal user state; replace with real auth later
  const [user, setUser] = useState({ isAuthenticated: false, name: '', email: '' })

  // Placeholder auth actions
  const login = async ({ email }) => {
    // In a real app, call an auth API and set tokens
    setUser({ isAuthenticated: true, name: 'Chamunda User', email })
    return { ok: true }
  }

  const logout = () => setUser({ isAuthenticated: false, name: '', email: '' })

  const register = async ({ name, email }) => {
    // Placeholder: would create account via API
    setUser({ isAuthenticated: true, name, email })
    return { ok: true }
  }

  const value = useMemo(() => ({ user, login, logout, register }), [user])
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}