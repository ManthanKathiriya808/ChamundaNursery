// UserProvider: simple auth state placeholder using React Context
import React, { createContext, useEffect, useMemo, useState } from 'react'

export const UserContext = createContext(null)

export default function UserProvider({ children }) {
  const [user, setUser] = useState({ isAuthenticated: false, id: null, name: '', email: '', role: 'customer' })

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  const TOKEN_KEY = 'auth.token'
  const USER_KEY = 'auth.user'

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(USER_KEY)
      const token = localStorage.getItem(TOKEN_KEY)
      if (rawUser && token) {
        const parsed = JSON.parse(rawUser)
        setUser({ ...parsed, isAuthenticated: true })
      }
    } catch {}
  }, [])

  const login = async ({ email, password }) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error('Login failed')
    const { user: u, token } = await res.json()
    const next = { id: u.id, name: u.name, email: u.email, role: u.role, isAuthenticated: true }
    try {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(next))
    } catch {}
    setUser(next)
    return { ok: true }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY)
      if (token) {
        await fetch(`${BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } catch {}
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch {}
    setUser({ isAuthenticated: false, id: null, name: '', email: '', role: 'customer' })
    return { ok: true }
  }

  const register = async ({ name, email, password }) => {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) throw new Error('Registration failed')
    const { user: u, token } = await res.json()
    const next = { id: u.id, name: u.name, email: u.email, role: u.role, isAuthenticated: true }
    try {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(next))
    } catch {}
    setUser(next)
    return { ok: true }
  }

  const value = useMemo(() => ({ user, login, logout, register }), [user])
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}