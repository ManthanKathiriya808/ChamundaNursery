// Header with responsive navigation and multi-level category dropdowns
import React, { useState, useRef, useEffect } from 'react'
import ImageLazy from './ImageLazy.jsx'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Menu, X, Home, Grid3X3, FileText, User, ShoppingCart, ShieldCheck, Phone, HelpCircle, ChevronDown, Heart, Sprout, Settings } from 'lucide-react'
import { useCart } from '../hooks/CartProvider.jsx'
import { useUser, useAuth, useUserDisplayName } from '../hooks/useAuth.js'
import { useData } from '../context/DataProvider.jsx'
import { useCategories } from '../hooks/usePublicData.js'
import HamburgerMenu from './animations/HamburgerMenu.jsx'
import DropdownMenu from './ui/DropdownMenu.jsx'
import CartIcon from './animations/CartIcon.jsx'
import SearchBar from './ui/SearchBar.jsx'
import { AvatarButton } from './ui/Avatar.jsx'

export default function Header() {
  // Modern ecommerce header with top announcement, main bar, and category nav
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { openDrawer, items } = useCart()
  const { user, isLoaded } = useUser()
  const { isSignedIn, signOut } = useAuth()
  const displayName = useUserDisplayName()
  const { products } = useData()
  const { data: categoriesData } = useCategories()
  const reduceMotion = useReducedMotion()
  const accountRef = useRef(null)
  const headerRef = useRef(null)
  const navigate = useNavigate()

  // Handle cart button click - navigate to cart page
  const handleCartClick = () => {
    navigate('/cart')
  }

  // Generate categories from API data or fallback to products
  const categories = React.useMemo(() => {
    if (categoriesData?.categories && categoriesData.categories.length > 0) {
      // Use API categories - show all categories for header display
      return categoriesData.categories
        .filter(cat => cat.status === 'active') // Only show active categories
        .map(cat => ({
          id: cat.slug,
          name: cat.name,
          count: 0, // Will be updated when we have product counts
          level: cat.level || 0,
          parent_id: cat.parent_id
        }))
        .sort((a, b) => {
          // Sort by level first (main categories first), then by name
          if (a.level !== b.level) return a.level - b.level
          return a.name.localeCompare(b.name)
        })
    }
    
    // Fallback: Generate categories from products
    if (!products || products.length === 0) return []
    
    const categoryMap = new Map()
    
    products.forEach(product => {
      if (product.category) {
        const existing = categoryMap.get(product.category)
        if (existing) {
          existing.count += 1
        } else {
          categoryMap.set(product.category, {
            id: product.category.toLowerCase().replace(/\s+/g, '-'),
            name: product.category,
            count: 1
          })
        }
      }
    })
    
    return Array.from(categoryMap.values()).sort((a, b) => b.count - a.count)
  }, [categoriesData?.categories, products])

  // Handle scroll for smart sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Generate search suggestions from dynamic categories or fallback to hardcoded ones
  const searchSuggestions = React.useMemo(() => {
    if (categoriesData?.categories && categoriesData.categories.length > 0) {
      // Use dynamic categories for search suggestions
      const suggestions = categoriesData.categories
        .slice(0, 8) // Limit to 8 suggestions
        .map(cat => cat.name)
      
      // Add some generic plant-related terms
      const genericTerms = ['Bonsai Trees', 'Fruit Plants', 'Vegetable Seeds', 'Fertilizers']
      return [...suggestions, ...genericTerms].slice(0, 12)
    }
    
    // Fallback to hardcoded suggestions
    return [
      'Indoor Plants', 'Outdoor Plants', 'Bonsai Trees', 'Fruit Plants',
      'Vegetable Seeds', 'Garden Tools', 'Plant Pots', 'Fertilizers',
      'Succulents', 'Flowering Plants', 'Herbs', 'Bamboo Plants'
    ]
  }, [categoriesData?.categories])

  // Sample recent searches (in production, get from localStorage or user data)
  const recentSearches = ['Roses', 'Tomato Seeds', 'Garden Soil']

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
    { to: '/about', label: 'About', icon: FileText },
    { to: '/contact', label: 'Contact Us', icon: Phone },
  ]

  // More dropdown menu items
  const moreMenuItems = [
    { to: '/blog', label: 'Blog', icon: FileText },
    { to: '/care', label: 'Plant Care Guide', icon: Heart },
    { divider: true },
    { to: '/legal', label: 'Legal Information', icon: ShieldCheck },
    { to: '/privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { to: '/terms', label: 'Terms of Service', icon: ShieldCheck },
    { divider: true },
    { to: '/faq', label: 'FAQ', icon: HelpCircle },
  ]
  const isAuthed = isSignedIn && user
  const isAdmin = isAuthed && user?.publicMetadata?.role === 'admin'
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

  // Prepare dropdown menu items
  const accountMenuItems = [
    ...accountNav.map(item => ({
      to: item.to,
      label: item.label,
      icon: item.icon
    })),
    ...adminNav.map(item => ({
      to: item.to,
      label: item.label,
      icon: item.icon
    })),
    ...(isAuthed ? [
      { divider: true },
      { 
        label: 'View Cart', 
        icon: ShoppingCart, 
        onClick: openDrawer,
        badge: items?.length > 0 ? items.length : null
      },
      { 
        label: 'Logout', 
        icon: User, 
        onClick: signOut 
      }
    ] : [
      { divider: true },
      { 
        label: 'View Cart', 
        icon: ShoppingCart, 
        onClick: openDrawer,
        badge: items?.length > 0 ? items.length : null
      }
    ])
  ]

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
    <motion.header 
      ref={headerRef} 
      className={`
        sticky top-0 z-40 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-neutral-200' 
          : 'bg-white/95 backdrop-blur border-b border-neutral-200'
        }
      `}
      animate={{
        y: isScrolled ? 0 : 0,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.95)'
      }}
      transition={{ duration: 0.3 }}
    >
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
        <div className="hidden md:block flex-1 max-w-md">
          <SearchBar
            placeholder="Search plants, seeds, tools…"
            suggestions={searchSuggestions}
            recentSearches={recentSearches}
            size="md"
          />
        </div>
        {/* Desktop nav */}
        <nav aria-label="Primary" className="ml-auto hidden md:flex items-center gap-2">
          {primaryNav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} className="px-3 py-2 rounded hover:bg-softGray/60 link-hover inline-flex items-center gap-2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" to={to}>
              <Icon className="h-4 w-4 text-neutral-600" aria-hidden />
              <span>{label}</span>
            </NavLink>
          ))}
          
          {/* More dropdown */}
          <DropdownMenu
            trigger={
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span>More</span>
        
              </div>
            }
            items={moreMenuItems}
            align="right"
            variant="minimal"
            ariaLabel="More menu"
          />

          {/* Account dropdown */}
          <DropdownMenu
            trigger={
              <div className="flex items-center gap-2">
                {isAuthed ? (
                  <>
                    <AvatarButton user={user} size="sm" />
                    <span className="hidden lg:inline text-sm font-medium text-neutral-700">
                      Hi, {displayName.split(' ')[0]}
                    </span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    <span>Account</span>
                  </>
                )}
              </div>
            }
            items={accountMenuItems}
            align="right"
            variant="minimal"
            ariaLabel="Account menu"
          />

          {/* Admin icon - only visible to admins */}
          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-2 rounded hover:bg-softGray/60 link-hover inline-flex items-center gap-2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              title="Admin Dashboard"
            >
              <Settings className="h-4 w-4 text-neutral-600" aria-hidden />
              <span className="hidden lg:inline">Admin</span>
            </Link>
          )}

          {/* Cart button with animation */}
          <CartIcon
            itemCount={items?.length || 0}
            onClick={handleCartClick}
            className="ml-2"
          />
        </nav>
        {/* Mobile menu toggle */}
        <HamburgerMenu
          isOpen={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
          size="md"
          variant="primary"
          className="md:hidden ml-auto"
          ariaLabel={mobileOpen ? 'Close menu' : 'Open menu'}
        />
      </div>

      {/* Category navbar with horizontal slider */}
      <div className="hidden md:block border-t border-neutral-200">
        <nav aria-label="Categories" className="page-container py-2">
          <div className="flex items-center gap-4">
            {/* All categories link */}
            <NavLink
              to="/catalog"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-neutral-700 hover:bg-softGray/60 whitespace-nowrap flex-shrink-0 font-medium border border-neutral-200 hover:border-neutral-300"
            >
              <Grid3X3 className="w-4 h-4" />
              <span>All</span>
            </NavLink>
            
            {/* Categories slider */}
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-3 text-sm overflow-x-auto scrollbar-hide pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {categories.map((category) => (
                  <NavLink
                    key={category.id}
                    to={`/catalog?category=${category.id}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-neutral-700 hover:bg-softGray/60 whitespace-nowrap flex-shrink-0 transition-colors duration-200"
                  >
                    <Sprout className="h-4 w-4 text-neutral-600" aria-hidden />
                    <span>{category.name} {categoryEmoji[category.name.toLowerCase()] || ''}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
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
                  
                  {/* More menu items */}
                  <div className="mt-2 border-t border-neutral-200 pt-2">
                    <div className="px-4 py-2">
                      <span className="text-sm font-medium text-neutral-500 uppercase tracking-wide">More</span>
                    </div>
                    {moreMenuItems.filter(item => !item.divider).map(({ to, label, icon: Icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-softGray/60 min-h-[48px]"
                      >
                        <Icon className="h-5 w-5 text-neutral-700" aria-hidden />
                        <span className="text-base">{label}</span>
                      </NavLink>
                    ))}
                  </div>
                  
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
                        onClick={() => { setMobileOpen(false); signOut() }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-softGray/60 min-h-[44px]"
                      >
                        <User aria-hidden />
                        <span className="text-base">Logout</span>
                      </button>
                    )}
                    <button
                          onClick={handleCartClick}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-softGray/60 min-h-[44px]"
                    >
                      <ShoppingCart aria-hidden />
                      <span className="text-base">View Cart</span>
                    </button>
                  </div>
                </div>
                {/* Enhanced categories grid with animations */}
                <div className="px-2 pb-4">
                  <div className="text-xs uppercase tracking-wide text-neutral-600 px-3 mb-3">Categories</div>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.slice(0, 8).map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                      >
                        <NavLink
                          className="flex flex-col items-center gap-2 rounded-lg border border-neutral-200 bg-white p-4 shadow-soft hover:shadow-premium transition-all duration-200 hover:scale-105 min-h-[80px]"
                          to={`/catalog?category=${category.id}`}
                          onClick={() => setMobileOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary text-sm font-medium">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">{category.name}</div>
                            <div className="text-xs text-neutral-600">{category.count} items</div>
                          </div>
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}