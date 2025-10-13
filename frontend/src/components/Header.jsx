// Header with responsive navigation and multi-level category dropdowns
import React, { useState, useRef, useEffect } from 'react'
import ImageLazy from './ImageLazy.jsx'
import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  // Track dropdown open states for accessibility and keyboard nav
  const [shopOpen, setShopOpen] = useState(false)
  const [plantsOpen, setPlantsOpen] = useState(false)
  const [suppliesOpen, setSuppliesOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menus when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShopOpen(false)
        setPlantsOpen(false)
        setSuppliesOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  // Keyboard navigation helper for menus
  const onMenuKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShopOpen(false)
      setPlantsOpen(false)
      setSuppliesOpen(false)
    }
  }

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-primary via-accent to-primaryDark text-white shadow-premium">
      <div className="page-container flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3" aria-label="Go to home">
          <ImageLazy src="/logo.png" alt="Chamunda Nursery logo" className="h-10 w-10 rounded" />
          <span className="font-display text-xl md:text-2xl font-normal drop-shadow">Chamunda Nursery</span>
        </Link>

        {/* Desktop navigation */}
        <nav className="ml-auto hidden md:block" aria-label="Primary navigation" role="navigation">
          <ul className="flex items-center gap-3" role="menubar">
            <li role="none" className="relative" ref={menuRef} onKeyDown={onMenuKeyDown}>
              <button
                className="btn btn-ghost"
                aria-haspopup="true"
                aria-expanded={shopOpen}
                onClick={() => setShopOpen((v) => !v)}
              >
                Shop
              </button>
              {shopOpen && (
                <div role="menu" aria-label="Shop categories" className="absolute left-0 mt-2 w-[340px] rounded-lg border border-neutral-200 bg-white shadow-lg p-4">
                  <div className="grid grid-cols-1 gap-3">
                    {/* Plants group */}
                    <div>
                      <button
                        className="w-full text-left font-semibold link-hover"
                        aria-haspopup="true"
                        aria-expanded={plantsOpen}
                        onClick={() => setPlantsOpen((v) => !v)}
                      >
                        Plant Categories
                      </button>
                      {plantsOpen && (
                        <ul className="mt-2 space-y-1 pl-3" role="menu">
                          <li><NavLink className="link-hover" to="/catalog?category=indoor">Indoor</NavLink></li>
                          <li><NavLink className="link-hover" to="/catalog?category=outdoor">Outdoor</NavLink></li>
                          <li><NavLink className="link-hover" to="/catalog?category=bonsai">Bonsai</NavLink></li>
                          <li><NavLink className="link-hover" to="/catalog?category=fruits">Fruits</NavLink></li>
                          <li><NavLink className="link-hover" to="/catalog?category=vegetables">Vegetables</NavLink></li>
                        </ul>
                      )}
                    </div>
                    {/* Supplies group */}
                    <div>
                      <button
                        className="w-full text-left font-semibold link-hover"
                        aria-haspopup="true"
                        aria-expanded={suppliesOpen}
                        onClick={() => setSuppliesOpen((v) => !v)}
                      >
                        Supplies
                      </button>
                      {suppliesOpen && (
                        <ul className="mt-2 space-y-1 pl-3" role="menu">
                          <li><NavLink className="link-hover" to="/catalog?category=tools">Tools</NavLink></li>
                          <li><NavLink className="link-hover" to="/catalog?category=seeds">Seeds</NavLink></li>
                          <li><NavLink className="link-hover" to="/catalog?category=pots">Pots</NavLink></li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </li>
            {/* Static nav */}
            <li role="none"><NavLink role="menuitem" className="link-hover text-white" to="/catalog">Catalog</NavLink></li>
            <li role="none"><NavLink role="menuitem" className="link-hover text-white" to="/cart">Cart</NavLink></li>
            <li role="none"><NavLink role="menuitem" className="link-hover text-white" to="/checkout">Checkout</NavLink></li>
            <li role="none"><NavLink role="menuitem" className="link-hover text-white" to="/about">About</NavLink></li>
            <li role="none"><NavLink role="menuitem" className="link-hover text-white" to="/contact">Contact</NavLink></li>
            <li role="none"><NavLink role="menuitem" className="link-hover text-white" to="/admin">Admin</NavLink></li>
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden ml-auto btn btn-ghost" aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen((v) => !v)}>
          Menu
        </button>
      </div>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-white/30 bg-white text-neutral-900">
          <div className="page-container py-3 space-y-2">
            <NavLink className="block link-hover" to="/catalog" onClick={() => setMobileOpen(false)}>Catalog</NavLink>
            <NavLink className="block link-hover" to="/cart" onClick={() => setMobileOpen(false)}>Cart</NavLink>
            <NavLink className="block link-hover" to="/checkout" onClick={() => setMobileOpen(false)}>Checkout</NavLink>
            <NavLink className="block link-hover" to="/about" onClick={() => setMobileOpen(false)}>About</NavLink>
            <NavLink className="block link-hover" to="/contact" onClick={() => setMobileOpen(false)}>Contact</NavLink>
            <NavLink className="block link-hover" to="/admin" onClick={() => setMobileOpen(false)}>Admin</NavLink>
            <div className="pt-2">
              <button className="btn btn-primary w-full" onClick={() => setShopOpen((v) => !v)} aria-expanded={shopOpen}>Shop Categories</button>
              {shopOpen && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <NavLink className="link-hover" to="/catalog?category=indoor" onClick={() => setMobileOpen(false)}>Indoor</NavLink>
                  <NavLink className="link-hover" to="/catalog?category=outdoor" onClick={() => setMobileOpen(false)}>Outdoor</NavLink>
                  <NavLink className="link-hover" to="/catalog?category=bonsai" onClick={() => setMobileOpen(false)}>Bonsai</NavLink>
                  <NavLink className="link-hover" to="/catalog?category=fruits" onClick={() => setMobileOpen(false)}>Fruits</NavLink>
                  <NavLink className="link-hover" to="/catalog?category=vegetables" onClick={() => setMobileOpen(false)}>Vegetables</NavLink>
                  <NavLink className="link-hover" to="/catalog?category=tools" onClick={() => setMobileOpen(false)}>Tools</NavLink>
                  <NavLink className="link-hover" to="/catalog?category=seeds" onClick={() => setMobileOpen(false)}>Seeds</NavLink>
                  <NavLink className="link-hover" to="/catalog?category=pots" onClick={() => setMobileOpen(false)}>Pots</NavLink>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}