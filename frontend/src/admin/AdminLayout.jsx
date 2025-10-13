// Admin layout with sidebar and accessible main content
import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar.jsx'

export default function AdminLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[260px_1fr] bg-neutral-50 text-neutral-900">
      <aside className="border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white">
        <AdminSidebar />
      </aside>
      <main role="main" className="p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}