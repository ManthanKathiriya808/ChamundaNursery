// Enhanced responsive dashboard with modern icons and improved UX
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  Package, 
  Eye,
  Calendar,
  BarChart3,
  Activity,
  RefreshCw,
  Loader2,
  MessageSquare,
  Settings,
  Shield
} from 'lucide-react'
import { fetchDashboardStats } from '../services/api'
import UserRoleManager from '../components/admin/UserRoleManager'

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [dashboardData, setDashboardData] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const loadDashboardData = async () => {
    try {
      setError(null)
      const data = await fetchDashboardStats()
      setDashboardData(data)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard error:', err)
    }
  }

  useEffect(() => {
    const initDashboard = async () => {
      await loadDashboardData()
      setIsLoading(false)
    }
    initDashboard()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadDashboardData()
    setRefreshing(false)
  }

  // Create dynamic stats from real data
  const createStatsFromData = (data) => {
    if (!data?.summary) return []
    
    const { summary } = data
    return [
      { 
        label: 'Total Sales', 
        value: `₹${summary.totalSales.toLocaleString()}`, 
        trend: '+0%', 
        icon: DollarSign,
        color: 'from-green-500 to-emerald-600',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600'
      },
      { 
        label: 'Orders', 
        value: summary.orders.toString(), 
        trend: '+0%', 
        icon: ShoppingCart,
        color: 'from-blue-500 to-cyan-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600'
      },
      { 
        label: 'Avg. Order Value', 
        value: `₹${summary.avgOrderValue}`, 
        trend: '+0%', 
        icon: TrendingUp,
        color: 'from-purple-500 to-indigo-600',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600'
      },
      { 
        label: 'Users', 
        value: summary.users.toString(), 
        trend: '+0%', 
        icon: Users,
        color: 'from-orange-500 to-red-600',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600'
      },
      { 
        label: 'Products', 
        value: summary.products.toString(), 
        trend: '+0%', 
        icon: Package,
        color: 'from-teal-500 to-cyan-600',
        bgColor: 'bg-teal-50',
        textColor: 'text-teal-600'
      },
      { 
        label: 'Reviews', 
        value: summary.reviews.toString(), 
        trend: '+0%', 
        icon: MessageSquare,
        color: 'from-pink-500 to-rose-600',
        bgColor: 'bg-pink-50',
        textColor: 'text-pink-600'
      },
    ]
  }

  const stats = dashboardData ? createStatsFromData(dashboardData) : []
  const recentOrders = dashboardData?.recentOrders || []

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Shield }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto" />

            <motion.p
              className="mt-4 text-gray-600 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Loading Dashboard...
            </motion.p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Timeframe Selector - only show on overview tab */}
            {activeTab === 'overview' && (
              <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
                {['7d', '30d', '90d'].map((period) => (
                  <motion.button
                    key={period}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      selectedTimeframe === period
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTimeframe(period)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : 'Last 90 days'}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Refresh Button - only show on overview tab */}
            {activeTab === 'overview' && (
              <motion.button
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                onClick={handleRefresh}
                disabled={refreshing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex space-x-1 bg-white rounded-lg border border-gray-200 p-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <motion.button
                key={tab.id}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <AnimatePresence>
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon
                    return (
                      <motion.div
                        key={stat.label}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.1,
                          type: 'spring',
                          stiffness: 200,
                          damping: 20
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-600">{stat.trend}</span>
                            </div>
                          </div>
                          <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                            <IconComponent className={`w-6 h-6 ${stat.textColor}`} />
                          </div>
                        </div>

                        {/* Mini Chart Animation */}
                        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${60 + index * 15}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Recent Orders */}
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="w-6 h-6 text-primary" />
                      <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                    </div>
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Eye className="w-4 h-4" />
                      View All
                    </motion.button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <AnimatePresence>
                        {dashboardData?.recentOrders?.map((order, index) => {
                          const statusColors = {
                            'completed': 'bg-green-100 text-green-800',
                            'pending': 'bg-yellow-100 text-yellow-800',
                            'cancelled': 'bg-red-100 text-red-800'
                          }
                          return (
                            <motion.tr
                              key={order.id}
                              className="hover:bg-gray-50 transition-colors"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ 
                                duration: 0.3, 
                                delay: index * 0.05 
                              }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {order.user_name ? order.user_name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{order.user_name || 'Unknown User'}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(order.created_at).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900">₹{order.total_amount}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <motion.span
                                  className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.2 + index * 0.05 }}
                                >
                                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
                                </motion.span>
                              </td>
                            </motion.tr>
                          )
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {/* Empty State (if no orders) */}
                {(!dashboardData?.recentOrders || dashboardData.recentOrders.length === 0) && (
                  <motion.div
                    className="flex flex-col items-center justify-center py-12"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Package className="w-16 h-16 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No orders yet</h3>
                    <p className="text-gray-600 text-center max-w-md">
                      When customers place orders, they'll appear here for you to manage.
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {[
                  { label: 'Add Product', icon: Package, color: 'from-green-500 to-emerald-600' },
                  { label: 'View Orders', icon: ShoppingCart, color: 'from-blue-500 to-cyan-600' },
                  { label: 'Manage Users', icon: Users, color: 'from-purple-500 to-indigo-600' },
                  { label: 'Analytics', icon: Activity, color: 'from-orange-500 to-red-600' }
                ].map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <motion.button
                      key={action.label}
                      className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 text-left group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900">{action.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">Quick access</p>
                    </motion.button>
                  )
                })}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UserRoleManager />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}