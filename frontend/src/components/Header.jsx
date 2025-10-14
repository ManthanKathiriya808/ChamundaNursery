// Header with responsive navigation and multi-level category dropdowns
import React, { useState, useRef, useEffect } from 'react'
import ImageLazy from './ImageLazy.jsx'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X, Home, Grid3X3, FileText, User, ShoppingCart, ShieldCheck, Phone, HelpCircle, ChevronDown, Heart, Sprout } from 'lucide-react'
import { useCart } from '../hooks/CartProvider.jsx'
import useUser from '../hooks/useUser.js'

export default function Header() {
  // Modern ecommerce header with top announcement, main bar, and category nav
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { openDrawer, items } = useCart()
  const { user, logout } = useUser()
  const reduceMotion = useReducedMotion()
  const accountRef = useRef(null)
  const headerRef = useRef(null)

  // Close account dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (!accountRef.current) return
      if (accountRef.current.contains(e.target)) return
      setAccountOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  // Nav items: update here to extend header/footer to new sections
  const primaryNav = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/catalog', label: 'Catalog', icon: Grid3X3 },
    { to: '/blog', label: 'Blog', icon: FileText },
    { to: '/care', label: 'Care', icon: Heart },
  ]
  const isAuthed = !!user?.isAuthenticated
  const isAdmin = isAuthed && (user.role === 'admin' || user.isAdmin === true)
  const accountNav = isAuthed
    ? [
        { to: '/account/profile', label: 'Profile', icon: User },
        { to: '/account/orders', label: 'Orders', icon: User },
      ]
    : [
        { to: '/account/login', label: 'Login', icon: User },
        { to: '/account/register', label: 'Register', icon: User },
      ]
  const adminNav = isAdmin ? [{ to: '/admin', label: 'Admin Dashboard', icon: ShieldCheck }] : []

  // Emoji map for categories for better quick recognition
  const categoryEmoji = {
    indoor: '🌿',
    outdoor: '🌳',
    bonsai: '🪴',
    fruits: '🍎',
    vegetables: '🥦',
    seeds: '🌱',
    tools: '🧰',
    pots: '🪵',
  }

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Expose actual header height as a CSS variable for layout calculations
  useEffect(() => {
    const updateHeaderVar = () => {
      if (!headerRef.current) return
      const h = headerRef.current.offsetHeight || 0
      document.documentElement.style.setProperty('--header-h', `${h}px`)
    }
    updateHeaderVar()
    window.addEventListener('resize', updateHeaderVar)
    return () => window.removeEventListener('resize', updateHeaderVar)
  }, [])

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-neutral-200">
      {/* Top announcement bar */}
      <div className="bg-earth text-white text-xs sm:text-sm">
        <div className="mx-auto max-w-7xl px-4 py-1 flex items-center justify-center">
          Free shipping over ₹499 • Fresh plants delivered pan‑India
        </div>
      </div>

      {/* Main bar: logo + search + quick links */}
      <div className="page-container py-3 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3" aria-label="Go to home">
          <ImageLazy src="/logo.png" alt="Chamunda Nursery logo" className="h-12 w-12 rounded" />
          <span className="font-display text-xl md:text-2xl font-semibold text-neutral-900">Chamunda Nursery</span>
        </Link>
        {/* Search */}
        <div className="hidden md:block flex-1">
          <label htmlFor="header-search" className="sr-only">Search products</label>
          <input id="header-search" type="search" placeholder="Search plants, seeds, tools…" className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary shadow-soft" />
        </div>
        {/* Desktop nav */}
        <nav aria-label="Primary" className="ml-auto hidden md:flex items-center gap-2">
          {primaryNav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} className="px-3 py-2 rounded hover:bg-softGray/60 link-hover inline-flex items-center gap-2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" to={to}>
              <Icon className="h-4 w-4 text-neutral-600" aria-hidden />
              <span>{label}</span>
            </NavLink>
          ))}
          {/* Account dropdown */}
          <div ref={accountRef} className="relative">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-softGray/60 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((v) => !v)}
            >
              {isAdmin ? <ShieldCheck aria-hidden /> : <User aria-hidden />}
              <span>{isAuthed ? (user?.name ? `Hi, ${user.name.split(' ')[0]}` : 'Account') : 'Account'}</span>
              <ChevronDown className="text-neutral-600" aria-hidden />
            </button>
            <AnimatePresence>
              {accountOpen && (
                <motion.div
                  role="menu"
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? {} : { opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-56 rounded-lg border border-neutral-200 bg-white shadow-premium"
                >
                  <div className="py-1">
                    {accountNav.map(({ to, label }) => (
                      <NavLink key={to} role="menuitem" className="block px-3 py-2 hover:bg-softGray/60" to={to} onClick={() => setAccountOpen(false)}>
                        {label}
                      </NavLink>
                    ))}
                    {adminNav.map(({ to, label }) => (
                      <NavLink key={to} role="menuitem" className="block px-3 py-2 hover:bg-softGray/60" to={to} onClick={() => setAccountOpen(false)}>
                        {label}
                      </NavLink>
                    ))}
                    {isAuthed && (
                      <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-softGray/60" onClick={() => { setAccountOpen(false); logout() }}>
                        Logout
                      </button>
                    )}
                    <button role="menuitem" className="w-full text-left px-3 py-2 hover:bg-softGray/60" onClick={openDrawer}>
                      View Cart
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Cart button (lighter) */}
          <button className="relative ml-2 rounded-md border border-neutral-300 px-3 py-2 hover:bg-neutral-100 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" onClick={openDrawer} aria-label="Open cart">
            <ShoppingCart aria-hidden />
            {items?.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-primary text-white rounded-full px-2 py-0.5">{items.length}</span>
            )}
          </button>
        </nav>
        {/* Mobile menu toggle */}
        <button
          className="md:hidden ml-auto inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-2 text-sm"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X aria-hidden /> : <Menu aria-hidden />}
          Menu
        </button>
      </div>

      {/* Category navbar (restored) */}
      <div className="hidden md:block border-t border-neutral-200">
        <nav aria-label="Categories" className="page-container py-2 overflow-x-auto">
          <ul className="flex items-center gap-4 text-sm">
            {['Indoor','Outdoor','Bonsai','Fruits','Vegetables','Seeds','Tools','Pots'].map((label) => (
              <li key={label}>
                <NavLink
                  to={`/catalog?category=${label.toLowerCase()}`}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-neutral-700 hover:bg-softGray/60"
                >
                  <Sprout className="h-4 w-4 text-neutral-600" aria-hidden />
                  <span>{label} {categoryEmoji[label.toLowerCase()] || ''}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile drawer with animated transitions and quick nav */}
      <AnimatePresence>
        {mobileOpen && (
          <div id="mobile-menu" className="md:hidden">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="fixed left-0 top-0 z-50 h-[100dvh] w-full sm:w-[340px] bg-white border-r border-neutral-200 shadow-premium flex flex-col"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 30 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                  <ImageLazy src="/logo.svg" alt="Chamunda Nursery logo" className="h-10 w-10 rounded" />
                  <span className="font-display text-lg font-semibold">Chamunda Nursery</span>
                </Link>
                <button className="btn btn-outline" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X aria-hidden />
                </button>
              </div>
              {/* Sections */}
              <nav aria-label="Quick navigation" className="flex-1 overflow-y-auto">
                <div className="px-2 py-3">
                  {primaryNav.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-softGray/60 min-h-[48px]"
                    >
                      <Icon className="h-5 w-5 text-neutral-700" aria-hidden />
                      <span className="text-base font-medium">{label}</span>
                    </NavLink>
                  ))}
                  {/* Account & Admin quick nav */}
                  <div className="mt-2 border-t border-neutral-200 pt-2">
                    {accountNav.map(({ to, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-softGray/60 min-h-[44px]"
                      >
                        <User aria-hidden />
                        <span className="text-base">{label}</span>
                      </NavLink>
                    ))}
                    {adminNav.map(({ to, label }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-softGray/60 min-h-[44px]"
                      >
                        <ShieldCheck aria-hidden />
                        <span className="text-base">{label}</span>
                      </NavLink>
                    ))}
                    {isAuthed && (
                      <button
                        onClick={() => { setMobileOpen(false); logout() }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-softGray/60 min-h-[44px]"
                      >
                        <User aria-hidden />
                        <span className="text-base">Logout</span>
                      </button>
                    )}
                    <button
                      onClick={() => { setMobileOpen(false); openDrawer() }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-softGray/60 min-h-[44px]"
                    >
                      <ShoppingCart aria-hidden />
                      <span className="text-base">View Cart</span>
                    </button>
                  </div>
                </div>
                {/* Categories grid (card style) */}
                <div className="px-2 pb-4">
                  <div className="text-xs uppercase tracking-wide text-neutral-600 px-3 mb-2">Categories</div>
                  <div className="grid grid-cols-2 gap-3">
                    {['indoor','outdoor','bonsai','fruits','vegetables','tools','seeds','pots'].map((c) => (
                      <NavLink
                        key={c}
                        className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-4 shadow-soft hover:shadow-premium min-h-[64px]"
                        to={`/catalog?category=${c}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Grid3X3 className="h-5 w-5 text-neutral-700" aria-hidden />
                        <span className="text-base font-medium">{c[0].toUpperCase()+c.slice(1)} {categoryEmoji[c] || ''}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}