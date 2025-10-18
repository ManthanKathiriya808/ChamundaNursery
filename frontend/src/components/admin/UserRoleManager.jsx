/**
 * User Role Manager Component
 * 
 * Allows admins to view and manage user roles, including promoting users to admin
 */

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { 
  Users, Shield, Crown, User, Mail, Calendar, 
  ChevronDown, ChevronUp, Search, Filter, 
  AlertCircle, CheckCircle, Settings, Info
} from 'lucide-react'
import { updateUserRole, isAdmin, getUserRole, ADMIN_SETUP_INSTRUCTIONS } from '../../utils/clerkAdmin'

export default function UserRoleManager() {
  const { user: currentUser } = useUser()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showInstructions, setShowInstructions] = useState(false)
  const [updatingRoles, setUpdatingRoles] = useState(new Set())

  // Mock users data - in real app, this would come from your backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data - replace with actual API call
        const mockUsers = [
          {
            id: 'user_1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'customer',
            createdAt: '2024-01-15',
            lastSignIn: '2024-12-18'
          },
          {
            id: 'user_2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'admin',
            createdAt: '2024-01-10',
            lastSignIn: '2024-12-18'
          },
          {
            id: 'user_3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            role: 'customer',
            createdAt: '2024-02-01',
            lastSignIn: '2024-12-17'
          }
        ]
        
        setUsers(mockUsers)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleRoleUpdate = async (userId, newRole) => {
    if (!currentUser) return

    setUpdatingRoles(prev => new Set([...prev, userId]))

    try {
      // In a real app, you'd need to use Clerk's backend API or admin functions
      // For now, we'll show instructions to the user
      if (newRole === 'admin') {
        toast.success(
          'To promote this user to admin, please follow the instructions in Clerk Dashboard',
          { duration: 5000 }
        )
        setShowInstructions(true)
      } else {
        toast.success('Role update instructions shown. Please use Clerk Dashboard.')
        setShowInstructions(true)
      }

      // Update local state optimistically
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))

    } catch (error) {
      console.error('Failed to update role:', error)
      toast.error('Failed to update user role')
    } finally {
      setUpdatingRoles(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />
      case 'customer':
        return <User className="w-4 h-4 text-blue-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleBadge = (role) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium"
    switch (role) {
      case 'admin':
        return `${baseClasses} bg-yellow-100 text-yellow-800`
      case 'customer':
        return `${baseClasses} bg-blue-100 text-blue-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">User Role Management</h2>
        </div>
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Info className="w-4 h-4" />
          <span>Setup Instructions</span>
        </button>
      </div>

      {/* Instructions Panel */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6"
          >
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  {ADMIN_SETUP_INSTRUCTIONS.title}
                </h3>
                <ol className="space-y-1 text-sm text-blue-800">
                  {ADMIN_SETUP_INSTRUCTIONS.steps.map((step, index) => (
                    <li key={index} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
                <p className="mt-3 text-sm text-blue-700 font-medium">
                  {ADMIN_SETUP_INSTRUCTIONS.note}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="customer">Customers</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sign In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className={getRoleBadge(user.role)}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.lastSignIn).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {user.role === 'customer' ? (
                        <button
                          onClick={() => handleRoleUpdate(user.id, 'admin')}
                          disabled={updatingRoles.has(user.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {updatingRoles.has(user.id) ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          ) : (
                            <Crown className="w-3 h-3 mr-1" />
                          )}
                          Make Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleUpdate(user.id, 'customer')}
                          disabled={updatingRoles.has(user.id)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          {updatingRoles.has(user.id) ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                          ) : (
                            <User className="w-3 h-3 mr-1" />
                          )}
                          Remove Admin
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || roleFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No users have been created yet.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}