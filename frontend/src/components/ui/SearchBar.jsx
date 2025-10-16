import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/**
 * Enhanced Search Bar Component
 * Features animated suggestions, recent searches, and responsive design
 * 
 * @param {string} placeholder - Placeholder text
 * @param {function} onSearch - Search handler function
 * @param {Array} suggestions - Array of search suggestions
 * @param {Array} recentSearches - Array of recent searches
 * @param {string} className - Additional CSS classes
 * @param {boolean} showSuggestions - Whether to show suggestions dropdown
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 */
const SearchBar = ({
  placeholder = 'Search plants, seeds, tools…',
  onSearch,
  suggestions = [],
  recentSearches = [],
  className = '',
  showSuggestions = true,
  size = 'md'
}) => {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])
  const searchRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Size configurations
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg'
  }

  // Filter suggestions based on query
  useEffect(() => {
    if (query.trim()) {
      const filtered = suggestions.filter(item =>
        item.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
      setFilteredSuggestions(filtered)
    } else {
      setFilteredSuggestions([])
    }
  }, [query, suggestions])

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(showSuggestions && (value.trim() || recentSearches.length > 0))
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    if (showSuggestions && (query.trim() || recentSearches.length > 0)) {
      setIsOpen(true)
    }
  }

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery.trim())
      } else {
        navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
      }
      setIsOpen(false)
      setIsFocused(false)
      inputRef.current?.blur()
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
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

  const showDropdown = isOpen && showSuggestions && (filteredSuggestions.length > 0 || (query === '' && recentSearches.length > 0))

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <motion.div
          className={`
            relative flex items-center
            rounded-xl border bg-white/80 backdrop-blur-sm
            shadow-sm hover:shadow-md
            transition-all duration-200
            ${isFocused 
              ? 'border-primary ring-2 ring-primary/20' 
              : 'border-neutral-200 hover:border-neutral-300'
            }
          `}
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <Search className="absolute left-3 w-5 h-5 text-neutral-400" />
          
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`
              w-full pl-10 pr-10 bg-transparent
              focus:outline-none placeholder-neutral-500
              ${sizeClasses[size]}
            `}
            aria-label="Search"
            autoComplete="off"
          />

          {/* Clear Button */}
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="absolute right-3 p-1 rounded-full hover:bg-neutral-100 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="
              absolute top-full left-0 right-0 mt-2 z-50
              bg-white border border-neutral-200 rounded-xl shadow-xl
              backdrop-blur-sm bg-white/95 max-h-80 overflow-y-auto
            "
          >
            {/* Recent Searches */}
            {query === '' && recentSearches.length > 0 && (
              <div className="p-3 border-b border-neutral-100">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700">Recent Searches</span>
                </div>
                {recentSearches.slice(0, 4).map((search, index) => (
                  <motion.button
                    key={search}
                    variants={itemVariants}
                    custom={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="
                      w-full flex items-center gap-3 px-3 py-2 text-left
                      hover:bg-neutral-50 rounded-lg transition-colors
                    "
                  >
                    <Clock className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    <span className="text-sm text-neutral-700">{search}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Filtered Suggestions */}
            {filteredSuggestions.length > 0 && (
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm font-medium text-neutral-700">Suggestions</span>
                </div>
                {filteredSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    variants={itemVariants}
                    custom={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="
                      w-full flex items-center gap-3 px-3 py-2 text-left
                      hover:bg-neutral-50 rounded-lg transition-colors
                    "
                  >
                    <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                    <span className="text-sm text-neutral-700">
                      {suggestion.split(new RegExp(`(${query})`, 'gi')).map((part, i) =>
                        part.toLowerCase() === query.toLowerCase() ? (
                          <mark key={i} className="bg-primary/20 text-primary font-medium">
                            {part}
                          </mark>
                        ) : (
                          part
                        )
                      )}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* No Results */}
            {query && filteredSuggestions.length === 0 && (
              <div className="p-4 text-center text-neutral-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                <p className="text-sm">No suggestions found for "{query}"</p>
                <button
                  onClick={() => handleSearch()}
                  className="mt-2 text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Search anyway
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar