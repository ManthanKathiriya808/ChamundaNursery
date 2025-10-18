import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * DropdownMenu Component - Rebuilt from scratch for reliable navigation
 * 
 * Features:
 * - Smooth animations with Framer Motion
 * - Keyboard navigation support
 * - Reliable navigation for login/register/cart
 * - Outside click detection
 * - Customizable styling and positioning
 */
const DropdownMenu = ({
  trigger,
  items = [],
  align = 'right',
  className = '',
  disabled = false,
  variant = 'default',
  ariaLabel = 'Menu'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)
  const itemRefs = useRef([])
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return

      const validItems = items.filter(item => !item.divider)
      
      switch (event.key) {
        case 'Escape':
          setIsOpen(false)
          setFocusedIndex(-1)
          triggerRef.current?.focus()
          break
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex(prev => 
            prev < validItems.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : validItems.length - 1
          )
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (focusedIndex >= 0) {
            const item = validItems[focusedIndex]
            handleItemClick(item, focusedIndex)
          }
          break
        case 'Tab':
          setIsOpen(false)
          setFocusedIndex(-1)
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, focusedIndex, items])

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].focus()
    }
  }, [focusedIndex])

  // Handle item clicks with reliable navigation
  const handleItemClick = (item, index) => {
    console.log('DropdownMenu: Item clicked:', item);
    
    if (item.divider) return;
    
    // Close dropdown first
    setIsOpen(false);
    setFocusedIndex(-1);
    
    // Handle navigation
    if (item.to) {
      console.log('DropdownMenu: Navigating to:', item.to);
      // Use React Router navigate for internal routes
      navigate(item.to);
    } else if (item.href) {
      console.log('DropdownMenu: External link:', item.href);
      // External links
      if (item.external) {
        window.open(item.href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.href;
      }
    } else if (item.onClick) {
      console.log('DropdownMenu: Executing onClick handler');
      // Custom onClick handler (for cart, logout, etc.)
      item.onClick();
    }
    
    // Reset focus after navigation
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  }

  // Handle trigger click
  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setFocusedIndex(-1)
    }
  }

  // Styling variants
  const variantClasses = {
    default: 'px-3 py-2 rounded-lg hover:bg-neutral-50 border border-neutral-200',
    minimal: 'px-3 py-2 rounded-lg hover:bg-neutral-50',
    ghost: 'px-3 py-2 rounded-lg hover:bg-neutral-100/50'
  }

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  }

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: 'easeOut'
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.15,
        ease: 'easeOut'
      }
    })
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        className={`
          inline-flex items-center gap-2 transition-all duration-200
          ${variantClasses[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'bg-neutral-50' : ''}
          ${className}
        `}
        onClick={handleTriggerClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {trigger}
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`
              absolute top-full mt-2 min-w-[200px] z-50
              bg-white rounded-lg shadow-lg border border-neutral-200
              py-2 ${alignmentClasses[align]}
            `}
            role="menu"
            aria-orientation="vertical"
          >
            <div className="max-h-96 overflow-y-auto">
              {items.map((item, index) => {
                // Render divider
                if (item.divider) {
                  return (
                    <motion.div
                      key={`divider-${index}`}
                      variants={itemVariants}
                      custom={index}
                      className="my-1 border-t border-neutral-200"
                    />
                  )
                }

                return (
                  <motion.div
                    key={item.label || index}
                    variants={itemVariants}
                    custom={index}
                  >
                    <button
                      ref={el => itemRefs.current[index] = el}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2.5 text-left
                        hover:bg-neutral-50 focus:bg-neutral-50
                        focus:outline-none transition-colors duration-150
                        ${focusedIndex === index ? 'bg-neutral-50' : ''}
                      `}
                      onClick={() => handleItemClick(item, index)}
                      role="menuitem"
                      tabIndex={-1}
                    >
                      {item.icon && (
                        <item.icon className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium text-neutral-900 flex-1">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DropdownMenu