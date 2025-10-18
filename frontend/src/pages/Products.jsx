import React, { useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useProducts, useProductSearch } from '../hooks/queries/useProducts'
import { useCategories } from '../hooks/queries/useCategories'
import useUIStore from '../stores/uiStore'
import useCartStore from '../stores/cartStore'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import SearchBar from '../components/ui/SearchBar'
import FilterSidebar from '../components/FilterSidebar'
import Pagination from '../components/Pagination'

const Products = () => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'name',
    search: '',
    page: 1,
    limit: 12
  })
  
  const [showFilters, setShowFilters] = useState(false)
  
  // Zustand stores
  const { loading } = useUIStore()
  const { addItem } = useCartStore()
  
  // React Query hooks
  const { data: products = [], isLoading: productsLoading, error: productsError } = useProducts(filters)
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()
  const { data: searchResults = [], isLoading: searchLoading } = useProductSearch(filters.search)
  
  // Use search results if searching, otherwise use filtered products
  const displayProducts = filters.search ? searchResults : products
  
  const isLoading = productsLoading || categoriesLoading || searchLoading
  
  // Filter handlers
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }
  
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
  }
  
  const handleSort = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }))
  }
  
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }
  
  // Add to cart handler
  const handleAddToCart = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.thumbnail,
      quantity: 1
    })
  }
  
  // Memoized sorted and filtered products
  const sortedProducts = useMemo(() => {
    if (!Array.isArray(displayProducts)) return []
    
    const sorted = [...displayProducts]
    
    switch (filters.sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0))
      case 'price-high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      default:
        return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    }
  }, [displayProducts, filters.sortBy])
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
  
  if (productsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
          <p className="text-gray-600">{productsError.message}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Products • Chamunda Nursery</title>
        <meta name="description" content="Browse our extensive collection of plants, seeds, and gardening supplies." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-gray-600">Discover premium plants and gardening essentials for your green space.</p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search products..."
            value={filters.search}
          />
        </div>
        
        {/* Filters and Sort */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClose={() => setShowFilters(false)}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & Sort */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {sortedProducts.length} products found
                </span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
            
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}
            
            {/* Products Grid */}
            {!isLoading && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              >
                {sortedProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard
                      product={product}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {/* Empty State */}
            {!isLoading && sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {filters.search ? 'Try adjusting your search terms' : 'Try adjusting your filters'}
                </p>
                {(filters.search || filters.category) && (
                  <button
                    onClick={() => setFilters({ ...filters, search: '', category: '', page: 1 })}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
            
            {/* Pagination */}
            {!isLoading && sortedProducts.length > 0 && (
              <Pagination
                currentPage={filters.page}
                totalPages={Math.ceil(sortedProducts.length / filters.limit)}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products