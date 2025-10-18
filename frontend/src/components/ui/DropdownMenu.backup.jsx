import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * Enhanced Dropdown Menu Component
 * Features smooth animations, keyboard navigation, and accessibility
 * 
 * @param {React.ReactNode} trigger - The trigger element (button content)
 * @param {Array} items - Array of menu items with { to?, href?, label, icon?, onClick?, divider? }
 * @param {string} align - Alignment: 'left', 'right', 'center'
 * @param {string} className - Additional CSS classes for the trigger
 * @param {boolean} disabled - Whether the dropdown is disabled
 * @param {string} variant - Style variant: 'default', 'minimal', 'ghost'
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          setIsOpen(false)
          setFocusedIndex(-1)
          triggerRef.current?.focus()
          break
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex(prev => 
            prev < items.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : items.length - 1
          )
          break
        case 'Enter':
        case ' ':
          if (focusedIndex >= 0) {
            event.preventDefault()
            const item = items[focusedIndex]
            if (item.onClick) {
              item.onClick()
              setIsOpen(false)
            }
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, focusedIndex, items])

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].focus()
    }
  }, [focusedIndex])

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  }

  const variantClasses = {
    default: 'px-3 py-2 rounded-lg hover:bg-neutral-50 border border-neutral-200',
    minimal: 'px-3 py-2 rounded-lg hover:bg-neutral-50',
    ghost: 'px-3 py-2 rounded-lg hover:bg-neutral-100/50'
  }

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

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setFocusedIndex(-1)
    }
  }

  const handleItemClick = (item, index) => {
    // Handle custom onClick first
    if (item.onClick) {
      item.onClick()
    }
    
    // Handle navigation with programmatic routing for better reliability
    if (item.to) {
      setIsOpen(false)
      setFocusedIndex(-1)
      // Use programmatic navigation instead of relying on Link component
      setTimeout(() => {
        navigate(item.to)
      }, 50)
    } else if (item.href) {
      // For external links, use window.location
      setIsOpen(false)
      setFocusedIndex(-1)
      setTimeout(() => {
        if (item.external) {
          window.open(item.href, '_blank')
        } else {
          window.location.href = item.href
        }
      }, 50)
    } else {
      // For regular buttons, close immediately
      setIsOpen(false)
      setFocusedIndex(-1)
    }
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        className={`
          inline-flex items-center gap-2 transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          ${variantClasses[variant]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
        onClick={handleTriggerClick}
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        {trigger}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-neutral-600" />
        </motion.div>
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
              absolute z-50 mt-2 min-w-[200px] max-w-[300px]
              bg-white border border-neutral-200 rounded-xl shadow-xl
              backdrop-blur-sm bg-white/95
              ${alignmentClasses[align]}
            `}
            role="menu"
          >
            <div className="py-2">
              {items.map((item, index) => {
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

                const ItemComponent = item.to ? Link : item.href ? 'a' : 'button'
                const itemProps = item.to 
                  ? { to: item.to }
                  : item.href 
                  ? { href: item.href, target: item.external ? '_blank' : undefined }
                  : { type: 'button' }

                return (
                  <motion.div
                    key={item.label || index}
                    variants={itemVariants}
                    custom={index}
                  >
                    <ItemComponent
                      ref={el => itemRefs.current[index] = el}
                      {...itemProps}
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
                      <span className="text-sm font-medium text-neutral-900">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </ItemComponent>
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