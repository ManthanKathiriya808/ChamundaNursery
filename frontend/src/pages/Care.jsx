import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  Star,
  User,
  Tag,
  ArrowRight,
  Leaf,
  ChevronDown
} from 'lucide-react'
import { 
  usePlantCareArticles, 
  usePlantCareSearch,
  useApiError 
} from '../hooks/usePublicData.js'
import { 
  BlogCardSkeleton, 
  BlogGridSkeleton, 
  ErrorState 
} from '../components/LoadingSkeletons.jsx'
import { useData } from '../context/DataProvider.jsx'
import { useCategories } from '../hooks/useCategories.js'

export default function Care() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)
  const [limit] = useState(12)

  // Fallback data from context
  const { careGuides: fallbackCareGuides } = useData()

  // Fetch dynamic categories
  const { categories: dynamicCategories, loading: categoriesLoading } = useCategories()

  // Dynamic API data
  const { 
    data: careData, 
    isLoading: careLoading, 
    error: careError 
  } = usePlantCareArticles({
    page,
    limit,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
    sort: sortBy,
    search: searchTerm
  })

  // Search functionality
  const { 
    data: searchResults, 
    isLoading: searchLoading, 
    error: searchError 
  } = usePlantCareSearch(searchTerm, {
    enabled: searchTerm.length > 2
  })

  // Error handling
  const careErrorInfo = useApiError(careError)
  const searchErrorInfo = useApiError(searchError)

  // Memoized data with fallbacks
  const careArticles = useMemo(() => {
    if (searchTerm.length > 2 && searchResults) {
      return searchResults
    }
    if (careData?.articles) {
      return careData.articles
    }
    // Fallback to static data
    return fallbackCareGuides || []
  }, [careData, searchResults, fallbackCareGuides, searchTerm])

  // Categories for filtering - use dynamic categories or fallback to hardcoded ones
  const categories = useMemo(() => {
    if (categoriesLoading) {
      return ['all'] // Show minimal options while loading
    }
    
    if (dynamicCategories && dynamicCategories.length > 0) {
      // Use dynamic categories and add care-specific categories
      const plantCategories = dynamicCategories.map(cat => cat.name)
      const careSpecificCategories = [
        'Seasonal Care',
        'Pest Control', 
        'Soil & Fertilizer',
        'Watering',
        'Pruning',
        'Propagation'
      ]
      return ['all', ...plantCategories, ...careSpecificCategories]
    }
    
    // Fallback to hardcoded categories
    return [
      'all',
      'Indoor Plants',
      'Outdoor Plants',
      'Seasonal Care',
      'Pest Control',
      'Soil & Fertilizer',
      'Watering',
      'Pruning',
      'Propagation'
    ]
  }, [dynamicCategories, categoriesLoading])

  // Difficulty levels
  const difficultyLevels = [
    'all',
    'Beginner',
    'Intermediate',
    'Advanced'
  ]

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'difficulty', label: 'Difficulty' }
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Reset pagination when filters change
  const handleFilterChange = (filterType, value) => {
    setPage(1)
    switch (filterType) {
      case 'search':
        setSearchTerm(value)
        break
      case 'category':
        setSelectedCategory(value)
        break
      case 'difficulty':
        setSelectedDifficulty(value)
        break
      case 'sort':
        setSortBy(value)
        break
    }
  }

  return (
    <div>
      <Helmet>
        <title>Plant Care Guides • Chamunda Nursery</title>
        <meta name="description" content="Expert plant care guides and tips for healthy, thriving plants. Learn proper watering, lighting, and maintenance techniques." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Plant Care Guides
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Expert advice and step-by-step guides to help your plants thrive
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search care guides..."
                  value={searchTerm}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Difficulty Filter */}
                <div className="relative">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {difficultyLevels.map(level => (
                      <option key={level} value={level}>
                        {level === 'all' ? 'All Levels' : level}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Sort Filter */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Care Guides Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' ? 'Search Results' : 'Care Guides'}
              </h2>
              <p className="text-gray-600">
                {careLoading || searchLoading ? 'Loading guides...' : `${careData?.total || careArticles.length} guide${(careData?.total || careArticles.length) !== 1 ? 's' : ''} found`}
              </p>
            </motion.div>

            {careLoading || searchLoading ? (
              <BlogGridSkeleton count={limit} />
            ) : careErrorInfo || searchErrorInfo ? (
              <ErrorState 
                title="Failed to load care guides"
                message={careErrorInfo?.message || searchErrorInfo?.message}
                onRetry={careErrorInfo ? retryCare : retrySearch}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {careArticles.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-gray-100"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.coverImage || article.image || '/api/placeholder/400/250'}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                            {article.category || 'Plant Care'}
                          </span>
                          {article.difficulty && (
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              article.difficulty === 'Beginner' ? 'bg-blue-100 text-blue-800' :
                              article.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {article.difficulty}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {article.description || article.excerpt || 'Learn essential care tips for healthy plants.'}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime || '5 min read'}
                          </div>
                          {article.created_at && (
                            <div className="flex items-center gap-1">
                              <span>{formatDate(article.created_at)}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {article.tags ? article.tags.slice(0, 2).join(', ') : 'Plant Care'}
                            </span>
                          </div>
                          <Link 
                            to={`/care/${article.id}`}
                            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors flex items-center gap-1"
                          >
                            Read Guide
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Pagination */}
                {careData?.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: Math.min(5, careData.totalPages) }, (_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-md border ${
                            page === pageNum
                              ? 'border-green-500 bg-green-500 text-white'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => setPage(p => Math.min(careData.totalPages, p + 1))}
                      disabled={page === careData.totalPages}
                      className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}

                {careArticles.length === 0 && !careLoading && !searchLoading && (
                  <div className="text-center py-12">
                    <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No guides found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or browse all categories
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('all')
                        setSelectedDifficulty('all')
                        setPage(1)
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">
                Get Expert Plant Care Tips
              </h2>
              <p className="text-green-100 mb-8 text-lg">
                Subscribe to receive weekly care guides and seasonal plant tips
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-green-300 focus:outline-none"
                />
                <button className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition-colors">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}