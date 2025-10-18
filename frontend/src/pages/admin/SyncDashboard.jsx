/**
 * Admin Dashboard Page
 * 
 * Comprehensive admin dashboard with React Query and Zustand integration
 * Provides tools for managing products, orders, users, and analytics
 */

import React, { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  Settings,
  Bell,
  Calendar,
  Activity
} from 'lucide-react'
import { useProducts } from '../../hooks/queries/useProducts'
import { useOrders } from '../../hooks/queries/useOrders'
import { useUIStore } from '../../stores/uiStore'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { NotificationSystem } from '../../components/NotificationSystem'

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('7d')
  
  const { data: products, isLoading: productsLoading } = useProducts()
  const { data: orders, isLoading: ordersLoading } = useOrders()
  const { showNotification } = useUIStore()

  // Show loading while Clerk loads
  if (!isLoaded) {
    return <LoadingSpinner size="large" text="Loading admin dashboard..." />
  }

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin'
  
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  // Mock analytics data - in real app, this would come from React Query
  const analytics = {
    totalRevenue: 45230,
    totalOrders: 156,
    totalProducts: products?.length || 0,
    totalUsers: 1247,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    productsGrowth: 5.2,
    usersGrowth: 15.7,
    recentOrders: orders?.slice(0, 5) || [],
    topProducts: products?.slice(0, 5) || [],
    salesData: [
      { name: 'Mon', sales: 4000 },
      { name: 'Tue', sales: 3000 },
      { name: 'Wed', sales: 5000 },
      { name: 'Thu', sales: 4500 },
      { name: 'Fri', sales: 6000 },
      { name: 'Sat', sales: 5500 },
      { name: 'Sun', sales: 4800 }
    ]
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const StatCard = ({ title, value, change, icon: Icon, color = 'green' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className={`flex items-center mt-2 text-sm ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {change >= 0 ? '+' : ''}{change}% from last period
          </div>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  )

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString()}`}
          change={analytics.revenueGrowth}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={analytics.totalOrders}
          change={analytics.ordersGrowth}
          icon={ShoppingCart}
          color="blue"
        />
        <StatCard
          title="Total Products"
          value={analytics.totalProducts}
          change={analytics.productsGrowth}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Total Users"
          value={analytics.totalUsers}
          change={analytics.usersGrowth}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Sales chart would be rendered here</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {analytics.recentOrders.map((order, index) => (
              <div key={order.id || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Order #{order.id || `ORD-${index + 1}`}</p>
                  <p className="text-sm text-gray-500">{order.customerName || 'Customer Name'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{order.total || '1,299'}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status || 'pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {analytics.topProducts.map((product, index) => (
            <div key={product.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <img
                src={product.image || '/api/placeholder/150/150'}
                alt={product.name || 'Product'}
                className="w-full h-32 object-cover rounded-lg mb-3"
              />
              <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                {product.name || 'Product Name'}
              </h4>
              <p className="text-green-600 font-semibold">₹{product.price || '299'}</p>
              <p className="text-xs text-gray-500 mt-1">{product.sales || '45'} sold</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Products Management</h2>
        <button
          onClick={() => showNotification('Product creation feature coming soon!', 'info')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {productsLoading ? (
          <LoadingSpinner text="Loading products..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.slice(0, 10).map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image || '/api/placeholder/40/40'}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">ID: {product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.category}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">₹{product.price}</td>
                    <td className="py-3 px-4 text-gray-600">{product.stock || 'In Stock'}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationSystem />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <img
                  src={user?.imageUrl || '/api/placeholder/32/32'}
                  alt={user?.fullName || 'Admin'}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-900">
                  {user?.fullName || 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Orders Management</h3>
            <p className="text-gray-600">Orders management interface coming soon</p>
          </div>
        )}
        {activeTab === 'users' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Users Management</h3>
            <p className="text-gray-600">Users management interface coming soon</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-gray-600">Advanced analytics dashboard coming soon</p>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Admin settings panel coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}