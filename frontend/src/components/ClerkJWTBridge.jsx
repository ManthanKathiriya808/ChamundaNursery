import { useClerkJWTBridge } from '../hooks/useClerkJWTBridge'

/**
 * Component that bridges Clerk authentication with the custom JWT system
 * This component should be placed inside ClerkProvider but outside other providers
 */
export const ClerkJWTBridge = ({ children }) => {
  useClerkJWTBridge()
  return children
}

export default ClerkJWTBridge