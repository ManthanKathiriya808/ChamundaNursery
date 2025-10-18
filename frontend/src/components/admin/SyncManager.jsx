/**
 * Sync Manager Component
 * 
 * Admin interface for managing synchronization between Clerk and database
 * Features:
 * - View sync status
 * - Manual sync operations
 * - Resolve conflicts
 * - Cleanup orphaned users
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUser, useClerk } from '@clerk/clerk-react'
import { 
  RefreshCw, 
  Database, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Trash2,
  Settings,
  Sync,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import {
  fetchDatabaseUsers,
  fetchClerkUsers,
  syncClerkToDatabase,
  getSyncStatus,
  cleanupOrphanedUsers,
  compareUsers,
  resolveRoleConflicts,
  syncUserRole
} from '../../utils/syncManager'

export default function SyncManager() {
  const { user } = useUser()
  const clerk = useClerk()
  
  const [syncStatus, setSyncStatus] = useState(null)
  const [databaseUsers, setDatabaseUsers] = useState([])
  const [clerkUsers, setClerkUsers] = useState([])
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('status')
  const [showDetails, setShowDetails] = useState(false)

  // Load initial data
  useEffect(() => {
    loadSyncStatus()
    loadUsers()
  }, [])

  const loadSyncStatus = async () => {
    try {
      const status = await getSyncStatus()
      setSyncStatus(status)
    } catch (error) {
      console.error('Failed to load sync status:', error)
    }
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const [dbUsers, clerkUsersData] = await Promise.all([
        fetchDatabaseUsers(),
        fetchClerkUsers(clerk)
      ])
      
      setDatabaseUsers(dbUsers)
      setClerkUsers(clerkUsersData)
      
      // Compare users
      const comp = compareUsers(clerkUsersData, dbUsers)
      setComparison(comp)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSyncClerkToDatabase = async () => {
    if (clerkUsers.length === 0) {
      toast.error('No Clerk users to sync')
      return
    }

    setLoading(true)
    try {
      await syncClerkToDatabase(clerkUsers)
      await loadUsers()
      await loadSyncStatus()
      toast.success('Sync completed successfully')
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolveConflicts = async () => {
    if (!comparison?.roleConflicts?.length) {
      toast.info('No role conflicts to resolve')
      return
    }

    setLoading(true)
    try {
      await resolveRoleConflicts(comparison.roleConflicts, clerk)
      await loadUsers()
      toast.success('Role conflicts resolved')
    } catch (error) {
      console.error('Failed to resolve conflicts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCleanupOrphaned = async () => {
    const confirmed = window.confirm(
      'This will delete users without Clerk IDs that are older than 30 days. Continue?'
    )
    
    if (!confirmed) return

    setLoading(true)
    try {
      await cleanupOrphanedUsers(30)
      await loadUsers()
      await loadSyncStatus()
    } catch (error) {
      console.error('Cleanup failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'status', label: 'Sync Status', icon: Database },
    { id: 'users', label: 'User Comparison', icon: Users },
    { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle },
    { id: 'actions', label: 'Actions', icon: Settings }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sync Manager</h1>
          <p className="text-gray-600">Manage synchronization between Clerk and database</p>
        </div>
        <motion.button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </motion.button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
                {tab.id === 'conflicts' && comparison?.roleConflicts?.length > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {comparison.roleConflicts.length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'status' && (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Sync Status Cards */}
            {syncStatus && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Database className="w-8 h-8 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total DB Users</p>
                      <p className="text-2xl font-bold">{syncStatus.stats.total_db_users}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">With Clerk ID</p>
                      <p className="text-2xl font-bold">{syncStatus.stats.users_with_clerk_id}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Without Clerk ID</p>
                      <p className="text-2xl font-bold">{syncStatus.stats.users_without_clerk_id}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Admin Users</p>
                      <p className="text-2xl font-bold">{syncStatus.stats.admin_users}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {comparison && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Only in Clerk */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Only in Clerk ({comparison.onlyInClerk.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {comparison.onlyInClerk.map((user, index) => (
                      <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-xs text-blue-600">Role: {user.role}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Only in Database */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Only in Database ({comparison.onlyInDatabase.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {comparison.onlyInDatabase.map((user, index) => (
                      <div key={index} className="p-2 bg-red-50 rounded text-sm">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-xs text-red-600">
                          {user.clerk_id ? `Clerk ID: ${user.clerk_id}` : 'No Clerk ID'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* In Both Systems */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Synced Users ({comparison.inBoth.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {comparison.inBoth.map((pair, index) => (
                      <div key={index} className="p-2 bg-green-50 rounded text-sm">
                        <p className="font-medium">{pair.clerk.name}</p>
                        <p className="text-gray-600">{pair.clerk.email}</p>
                        <p className="text-xs text-green-600">
                          Role: {pair.clerk.role === pair.database.role ? 
                            pair.clerk.role : 
                            `${pair.clerk.role} ≠ ${pair.database.role}`
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'conflicts' && (
          <motion.div
            key="conflicts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {comparison?.roleConflicts?.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Role Conflicts</h3>
                    <button
                      onClick={handleResolveConflicts}
                      disabled={loading}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                    >
                      Resolve All Conflicts
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clerk Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Database Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {comparison.roleConflicts.map((conflict, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{conflict.name}</p>
                              <p className="text-sm text-gray-600">{conflict.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {conflict.clerkRole}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              {conflict.databaseRole}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleResolveConflicts([conflict])}
                              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                            >
                              Resolve
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No Conflicts Found</h3>
                <p className="text-gray-600">All user roles are synchronized between Clerk and database.</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'actions' && (
          <motion.div
            key="actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sync Actions */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Operations</h3>
                <div className="space-y-4">
                  <button
                    onClick={handleSyncClerkToDatabase}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    <Sync className="w-4 h-4" />
                    Sync Clerk to Database
                  </button>
                  
                  <button
                    onClick={loadUsers}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Data
                  </button>
                </div>
              </div>

              {/* Cleanup Actions */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cleanup Operations</h3>
                <div className="space-y-4">
                  <button
                    onClick={handleCleanupOrphaned}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cleanup Orphaned Users
                  </button>
                  
                  <p className="text-sm text-gray-600">
                    Removes users without Clerk IDs that are older than 30 days
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}