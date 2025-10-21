// Enhanced admin sidebar with modern navigation and icons
import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  Star, 
  Upload, 
  FileText,
  Settings,
  Home
} from 'lucide-react'
import ImageLazy from '../components/ImageLazy.jsx'
import useUser from '../hooks/useUser.js'

export default function AdminSidebar() {
  const { user } = useUser()
  const isAdmin = user.role === 'admin' || user.isAdmin === true

  const navigationItems = [
    { to: '/admin', icon: BarChart3, label: 'Dashboard', exact: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
    { to: '/admin/blog', icon: FileText, label: 'Blog & Plant Care' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/reviews', icon: Star, label: 'Reviews' },
    { to: '/admin/bulk-upload', icon: Upload, label: 'Bulk Upload' },
  ]

  return (
    <nav aria-label="Admin navigation" className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <ImageLazy src="/logo.png" alt="Chamunda Nursery" className="h-10 w-10 rounded-lg" />
          <div>
            <h1 className="font-bold text-lg text-neutral-900">Admin Panel</h1>
            <p className="text-sm text-neutral-500">Chamunda Nursery</p>
          </div>
        </div>
      </div>

      {/* Role-based access notification - Removed Demo Mode */}
      {/* Demo mode notification removed for production */}

      {/* Navigation */}
      <div className="flex-1 p-4">
        <ul className="space-y-1">
          {navigationItems.map((item, index) => (
            <motion.li 
              key={item.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.to}
                end={item.exact}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-green-100 text-green-700 shadow-sm' 
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }
                  ${item.className || ''}
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-all duration-200"
        >
          <Home className="w-5 h-5" />
          <span>Back to Store</span>
        </NavLink>
      </div>
    </nav>
  )
}