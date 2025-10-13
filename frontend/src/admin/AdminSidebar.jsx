// Admin sidebar with navigation and role-based guard placeholder
import React from 'react'
import ImageLazy from '../components/ImageLazy.jsx'
import { NavLink } from 'react-router-dom'
import useUser from '../hooks/useUser.js'

export default function AdminSidebar() {
  const { user } = useUser()
  const isAdmin = user.role === 'admin' || user.isAdmin === true

  return (
    <nav aria-label="Admin navigation" className="p-4 space-y-2">
      <div className="flex items-center gap-2">
        <ImageLazy src="/logo.png" alt="Chamunda Nursery" className="h-8 w-8" />
        <span className="font-semibold">Admin Panel</span>
      </div>
      {/* Role-based access UI placeholder */}
      {!isAdmin && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-yellow-800">
          <p className="text-sm">You are viewing admin features in demo mode. Some actions are disabled.</p>
        </div>
      )}
      <ul className="space-y-1">
        <li><NavLink className="link-hover inline-block px-3 py-2 rounded hover:bg-neutral-100" to="/admin">Dashboard</NavLink></li>
        <li><NavLink className="link-hover inline-block px-3 py-2 rounded hover:bg-neutral-100" to="/admin/products">Products</NavLink></li>
        <li><NavLink className="link-hover inline-block px-3 py-2 rounded hover:bg-neutral-100" to="/admin/categories">Categories</NavLink></li>
        <li><NavLink className="link-hover inline-block px-3 py-2 rounded hover:bg-neutral-100" to="/admin/orders">Orders</NavLink></li>
        <li><NavLink className="link-hover inline-block px-3 py-2 rounded hover:bg-neutral-100" to="/admin/users">Users</NavLink></li>
        <li><NavLink className="link-hover inline-block px-3 py-2 rounded hover:bg-neutral-100" to="/admin/reviews">Reviews</NavLink></li>
      </ul>
    </nav>
  )
}