import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  Grid3X3, 
  FileText, 
  User, 
  ShoppingCart, 
  ShieldCheck, 
  Phone, 
  HelpCircle, 
  ChevronDown, 
  Heart, 
  Sprout,
  Search,
  Bell,
  Settings,
  LogOut,
  Package,
  Users,
  BarChart3,
  Zap,
  TreePine,
  Flower,
  Apple,
  Carrot,
  Scissors,
  FlowerIcon,
  Layers
} from 'lucide-react'
import { useCart } from '../hooks/CartProvider.jsx'
import { useData } from '../context/DataProvider.jsx'
import ImageLazy from './ImageLazy.jsx'
import SearchBar from './ui/SearchBar.jsx'
import { StaggerContainer, StaggerItem } from './transitions/PageTransition'
import { useUser, useAuth, useClerkMethods, useIsAdmin, useUserDisplayName } from '../hooks/useAuth'

const EnhancedHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [quickPanelOpen, setQuickPanelOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const { signOut } = useClerkMethods()
  const { openDrawer, items } = useCart()
  const { products } = useData()
  const location = useLocation()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  
  const headerRef = useRef(null)
  const quickPanelRef = useRef(null)

  // Handle scroll for smart sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close quick panel on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (quickPanelRef.current && !quickPanelRef.current.contains(event.target)) {
        setQuickPanelOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileOpen])

  // Navigation items with active route detection
  const primaryNav = [
    { to: '/', label: 'Home', icon: Home, exact: true },
    { to: '/catalog', label: 'Catalog', icon: Grid3X3 },
    { to: '/blog', label: 'Blog', icon: FileText },
    { to: '/care', label: 'Care', icon: Heart },
    { to: '/contact', label: 'Contact', icon: Phone },
  ]

  // User navigation based on authentication status
  const userNav = isSignedIn ? [
    { to: '/account/profile', label: 'Profile', icon: User },
    { to: '/account/orders', label: 'Orders', icon: Package },
    { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: items?.length || 0 },
  ] : [
    { to: '/account/login', label: 'Sign In', icon: User },
    { to: '/account/register', label: 'Sign Up', icon: User },
    { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: items?.length || 0 },
  ]

  // Admin navigation
  const adminNav = user?.publicMetadata?.role === 'admin' ? [
    { to: '/admin', label: 'Dashboard', icon: BarChart3 },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/users', label: 'Users', icon: Users },
  ] : []

  // Quick panel items
  const quickPanelItems = [
    ...(isSignedIn ? [
      {
        label: 'Profile Settings',
        icon: Settings,
        onClick: () => navigate('/account/profile'),
        description: 'Manage your account'
      },
      {
        label: 'Order History',
        icon: Package,
        onClick: () => navigate('/account/orders'),
        description: 'View past orders'
      }
    ] : []),
    ...(user?.publicMetadata?.role === 'admin' ? [
      {
        label: 'Admin Dashboard',
        icon: ShieldCheck,
        onClick: () => navigate('/admin'),
        description: 'Manage the store'
      },
      {
        label: 'Enhanced Products',
        icon: Zap,
        onClick: () => navigate('/admin/products-enhanced'),
        description: 'Advanced product management'
      }
    ] : []),
    {
      label: 'Demo Form',
      icon: FileText,
      onClick: () => navigate('/demo/form'),
      description: 'Test form features'
    },
    {
      label: 'Auth Test',
      icon: ShieldCheck,
      onClick: () => navigate('/test-auth'),
      description: 'Test authentication'
    }
  ]

  // Check if route is active
  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  // Search suggestions
  const searchSuggestions = [
    'Indoor Plants', 'Outdoor Plants', 'Bonsai Trees', 'Fruit Plants',
    'Vegetable Seeds', 'Garden Tools', 'Plant Pots', 'Fertilizers',
    'Succulents', 'Flowering Plants', 'Herbs', 'Bamboo Plants'
  ]

  const handleSearch = (query) => {
    navigate(`/catalog?search=${encodeURIComponent(query)}`)
    setSearchOpen(false)
  }

  return (
    <>
      {/* Top announcement bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white text-center py-2 text-sm"
      >
        🌱 Free delivery on orders over ₹500 | Use code: PLANT20 for 20% off
      </motion.div>

      {/* Main header */}
      <motion.header
        ref={headerRef}
        className={`fixed top-8 left-0 right-0 z-40 bg-white border-b transition-all duration-300 ${
          isScrolled ? 'shadow-lg border-gray-200' : 'border-gray-100'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center space-x-2">
                <ImageLazy 
                  src="/logo.svg" 
                  alt="Chamunda Nursery" 
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-gray-900 hidden sm:block">
                  Chamunda Nursery
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {primaryNav.map((item) => {
                const Icon = item.icon
                const isActive = isActiveRoute(item.to, item.exact)
                
                return (
                  <motion.div
                    key={item.to}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <NavLink
                      to={item.to}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-green-100 text-green-700 shadow-sm'
                          : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"
                          initial={false}
                        />
                      )}
                    </NavLink>
                  </motion.div>
                )
              })}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <SearchBar
                placeholder="Search plants, seeds, tools..."
                onSearch={handleSearch}
                suggestions={searchSuggestions}
                size="sm"
                className="w-full"
              />
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart */}
              <motion.button
                onClick={openDrawer}
                className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="h-5 w-5" />
                {items?.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {items.length}
                  </motion.span>
                )}
              </motion.button>

              {/* Quick Panel */}
              <div className="relative" ref={quickPanelRef}>
                <motion.button
                  onClick={() => setQuickPanelOpen(!quickPanelOpen)}
                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Zap className="h-5 w-5" />
                </motion.button>

                <AnimatePresence>
                  {quickPanelOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
                      </div>
                      
                      <StaggerContainer className="py-2">
                        {quickPanelItems.map((item, index) => {
                          const Icon = item.icon
                          return (
                            <StaggerItem key={index}>
                              <button
                                onClick={() => {
                                  item.onClick()
                                  setQuickPanelOpen(false)
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center space-x-3"
                              >
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <Icon className="h-4 w-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                  <p className="text-xs text-gray-500">{item.description}</p>
                                </div>
                              </button>
                            </StaggerItem>
                          )
                        })}
                      </StaggerContainer>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                {isSignedIn ? (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/account/profile"
                      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <img
                        src={user?.imageUrl}
                        alt={user?.fullName}
                        className="h-6 w-6 rounded-full border border-gray-200"
                      />
                      <span className="hidden sm:block text-sm font-medium">
                        {user?.firstName}
                      </span>
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/account/login"
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/account/register"
                      className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-gray-100 py-3"
              >
                <SearchBar
                  placeholder="Search plants, seeds, tools..."
                  onSearch={handleSearch}
                  suggestions={searchSuggestions}
                  size="sm"
                  className="w-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Navigation Bar */}
        <div className="hidden lg:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Categories" className="py-3">
              <div className="flex items-center space-x-6">
                {/* Categories dropdown */}
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                  <Layers className="w-5 h-5" />
                </div>
                
                {/* Quick category links with specific icons */}
                <div className="flex items-center space-x-4 text-sm overflow-x-auto">
                  {/* All category */}
                  <Link
                    to="/catalog"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 whitespace-nowrap transition-colors"
                  >
                    <Grid3X3 className="h-3 w-3" />
                    <span>All</span>
                  </Link>
                  
                  {/* Indoor */}
                  <Link
                    to="/catalog?category=indoor"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 whitespace-nowrap transition-colors"
                  >
                    <Home className="h-3 w-3" />
                    <span>Indoor</span>
                  </Link>
                  
                  {/* Outdoor */}
                  <Link
                    to="/catalog?category=outdoor"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 whitespace-nowrap transition-colors"
                  >
                    <TreePine className="h-3 w-3" />
                    <span>Outdoor</span>
                  </Link>
                  
                  {/* Bonsai */}
                  <Link
                    to="/catalog?category=bonsai"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 whitespace-nowrap transition-colors"
                  >
                    <Sprout className="h-3 w-3" />
                    <span>Bonsai</span>
                  </Link>
                  
                  {/* Fruits */}
                  <Link
                    to="/catalog?category=fruits"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 whitespace-nowrap transition-colors"
                  >
                    <Apple className="h-3 w-3" />
                    <span>Fruits</span>
                  </Link>
                  
                  {/* Vegetables */}
                  <Link
                    to="/catalog?category=vegetables"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 whitespace-nowrap transition-colors"
                  >
                    <Carrot className="h-3 w-3" />
                    <span>Vegetables</span>
                  </Link>
                  
                  {/* Seeds */}
                  <Link
                    to="/catalog?category=seeds"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 whitespace-nowrap transition-colors"
                  >
                    <Flower className="h-3 w-3" />
                    <span>Seeds</span>
                  </Link>
                  
                  {/* Tools */}
                  <Link
                    to="/catalog?category=tools"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 whitespace-nowrap transition-colors"
                  >
                    <Scissors className="h-3 w-3" />
                    <span>Tools</span>
                  </Link>
                  
                  {/* Pots */}
                  <Link
                    to="/catalog?category=pots"
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50 whitespace-nowrap transition-colors"
                  >
                    <Package className="h-3 w-3" />
                    <span>Pots</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white"
            >
              <div className="px-4 py-4 space-y-2">
                <StaggerContainer>
                  {primaryNav.map((item) => {
                    const Icon = item.icon
                    const isActive = isActiveRoute(item.to, item.exact)
                    
                    return (
                      <StaggerItem key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </StaggerItem>
                    )
                  })}
                  
                  {userNav.map((item) => {
                    const Icon = item.icon
                    const isActive = isActiveRoute(item.to)
                    
                    return (
                      <StaggerItem key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-green-100 text-green-700'
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge > 0 && (
                            <span className="bg-green-600 text-white text-xs rounded-full px-2 py-0.5">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </StaggerItem>
                    )
                  })}

                  {adminNav.map((item) => {
                    const Icon = item.icon
                    const isActive = isActiveRoute(item.to)
                    
                    return (
                      <StaggerItem key={item.to}>
                        <Link
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-purple-100 text-purple-700'
                              : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </StaggerItem>
                    )
                  })}
                </StaggerContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}

export default EnhancedHeader