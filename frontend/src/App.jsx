// Shared app layout: header, main outlet, footer
import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Accessible site header with nav */}
      <Header />
      {/* Main content area with responsive padding */}
      <main role="main" className="flex-1 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      {/* Footer with quick links */}
      <Footer />
    </div>
  )
}