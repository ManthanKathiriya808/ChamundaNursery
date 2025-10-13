// Hook to consume user context
import { useContext } from 'react'
import { UserContext } from './UserProvider.jsx'

export default function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within <UserProvider>')
  return ctx
}