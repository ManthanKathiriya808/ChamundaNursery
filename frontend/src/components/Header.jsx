// Header with responsive navigation and multi-level category dropdowns
import React, { useState, useRef, useEffect } from 'react'
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

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-neutral-200">
      <div className="page-container flex items-center gap-4">
        {/* Logo - placeholder in public/logo.svg */}
        <Link to="/" className="flex items-center gap-2" aria-label="Go to home">
          <img src="/logo.svg" alt="Chamunda Nursery logo" className="h-10 w-10" />
          <span className="sr-only">Chamunda Nursery</span>
        </Link>

        {/* Primary navigation with multi-level dropdown */}
        <nav className="ml-auto" aria-label="Primary navigation" role="navigation">
          <ul className="flex items-center gap-4" role="menubar">
            <li role="none" className="relative" ref={menuRef} onKeyDown={onMenuKeyDown}>
              <button
                className="btn btn-outline"
                aria-haspopup="true"
                aria-expanded={shopOpen}
                onClick={() => setShopOpen((v) => !v)}
              >
                Shop
              </button>

              {/* Level 1 dropdown */}
              {shopOpen && (
                <div role="menu" aria-label="Shop categories" className="absolute left-0 mt-2 w-[320px] rounded-lg border border-neutral-200 bg-white shadow-lg p-3">
                  <div className="grid grid-cols-1 gap-3">
                    {/* Plants group with sub-menu */}
                    <div className="">
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

                    {/* Supplies group with sub-menu */}
                    <div className="">
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

            {/* Static nav links */}
            <li role="none"><NavLink role="menuitem" className="link-hover" to="/catalog">Catalog</NavLink></li>
            <li role="none"><NavLink role="menuitem" className="link-hover" to="/cart">Cart</NavLink></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}