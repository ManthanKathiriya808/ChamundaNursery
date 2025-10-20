import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  Tag,
  ArrowRight,
  Leaf,
  BookOpen,
  Filter
} from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  useBlogPosts, 
  useFeaturedBlogs, 
  useBlogCategories,
  useApiError 
} from '../hooks/usePublicData.js'
import { 
  BlogCardSkeleton, 
  BlogGridSkeleton, 
  ErrorState 
} from '../components/LoadingSkeletons.jsx'
import { useData } from '../context/DataProvider.jsx'

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [page, setPage] = useState(1)
  const limit = 12

  // Fallback data from context
  const { blogPosts: fallbackBlogPosts } = useData()

  // Dynamic API data with pagination and filtering
  const { 
    data: blogData, 
    isLoading: blogLoading, 
    error: blogError 
  } = useBlogPosts({
    page,
    limit,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    sort: sortBy,
    search: searchTerm.length > 2 ? searchTerm : undefined
  })

  // Featured blog posts
  const { 
    data: featuredData, 
    isLoading: featuredLoading, 
    error: featuredError 
  } = useFeaturedBlogs(2)

  // Blog categories for filtering
  const { 
    data: categoriesData, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useBlogCategories()

  // Error handling
  const blogErrorInfo = useApiError(blogError)
  const featuredErrorInfo = useApiError(featuredError)
  const categoriesErrorInfo = useApiError(categoriesError)

  // Memoized data with fallbacks
  const blogPosts = useMemo(() => {
    return blogData?.posts || fallbackBlogPosts || []
  }, [blogData, fallbackBlogPosts])

  const featuredPosts = useMemo(() => {
    return featuredData || (fallbackBlogPosts?.filter(post => post.featured) || [])
  }, [featuredData, fallbackBlogPosts])

  const categories = useMemo(() => {
    const apiCategories = Array.isArray(categoriesData) ? categoriesData.map(cat => cat.name) : []
    const fallbackCategories = ['Plant Care', 'Plant Selection', 'Seasonal Care', 'Gardening', 'Health & Wellness']
    return ['all', ...(apiCategories.length > 0 ? apiCategories : fallbackCategories)]
  }, [categoriesData])

  // Mock blog data - in real app, this would come from React Query
  const mockBlogPosts = [
    {
      id: 1,
      title: 'Complete Guide to Indoor Plant Care',
      excerpt: 'Learn the essential tips and tricks for keeping your indoor plants healthy and thriving all year round.',
      content: 'Indoor plants can transform your living space...',
      coverImage: '/api/placeholder/400/250',
      author: 'Priya Sharma',
      publishedAt: '2024-01-15',
      readTime: '8 min read',
      category: 'Plant Care',
      tags: ['indoor plants', 'care guide', 'beginners'],
      featured: true
    },
    {
      id: 2,
      title: 'Best Plants for Low Light Conditions',
      excerpt: 'Discover beautiful plants that thrive in low light environments, perfect for apartments and offices.',
      content: 'Not all spaces have abundant natural light...',
      coverImage: '/api/placeholder/400/250',
      author: 'Rajesh Patel',
      publishedAt: '2024-01-12',
      readTime: '6 min read',
      category: 'Plant Selection',
      tags: ['low light', 'indoor plants', 'apartment'],
      featured: false
    },
    {
      id: 3,
      title: 'Seasonal Plant Care: Winter Edition',
      excerpt: 'How to care for your plants during the winter months and keep them healthy until spring.',
      content: 'Winter can be challenging for plants...',
      coverImage: '/api/placeholder/400/250',
      author: 'Amit Kumar',
      publishedAt: '2024-01-10',
      readTime: '5 min read',
      category: 'Seasonal Care',
      tags: ['winter care', 'seasonal', 'plant health'],
      featured: false
    },
    {
      id: 4,
      title: 'Creating Your First Herb Garden',
      excerpt: 'Step-by-step guide to starting your own herb garden, from choosing plants to harvesting.',
      content: 'Growing your own herbs is rewarding...',
      coverImage: '/api/placeholder/400/250',
      author: 'Priya Sharma',
      publishedAt: '2024-01-08',
      readTime: '10 min read',
      category: 'Gardening',
      tags: ['herbs', 'gardening', 'beginners'],
      featured: true
    },
    {
      id: 5,
      title: 'Common Plant Problems and Solutions',
      excerpt: 'Identify and solve the most common issues that affect houseplants, from pests to diseases.',
      content: 'Every plant parent faces challenges...',
      coverImage: '/api/placeholder/400/250',
      author: 'Rajesh Patel',
      publishedAt: '2024-01-05',
      readTime: '7 min read',
      category: 'Plant Care',
      tags: ['problems', 'solutions', 'plant health'],
      featured: false
    },
    {
      id: 6,
      title: 'The Benefits of Air-Purifying Plants',
      excerpt: 'Learn about plants that naturally clean the air in your home and improve your health.',
      content: 'Plants do more than just look beautiful...',
      coverImage: '/api/placeholder/400/250',
      author: 'Amit Kumar',
      publishedAt: '2024-01-03',
      readTime: '6 min read',
      category: 'Health & Wellness',
      tags: ['air purifying', 'health', 'indoor plants'],
      featured: false
    }
  ]

  // Remove static data definitions that conflict with dynamic data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div>
      <Helmet>
        <title>Blog • Chamunda Nursery</title>
        <meta name="description" content="Expert plant care guides, gardening tips, and green living advice from Chamunda Nursery's plant specialists." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] bg-cover bg-center opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Plant Care <span className="text-green-600">Blog</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Expert guides, tips, and inspiration for your plant journey
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setPage(1) // Reset to first page on search
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                {categoriesLoading ? (
                  <div className="w-40 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                ) : categoriesErrorInfo ? (
                  <ErrorState 
                    title="Failed to load categories"
                    message={categoriesErrorInfo.message}
                    onRetry={retryCategories}
                    className="text-sm"
                  />
                ) : (
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value)
                      setPage(1) // Reset to first page on filter change
                    }}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value)
                  setPage(1) // Reset to first page on sort change
                }}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredLoading ? (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Articles</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our most popular and comprehensive plant care guides
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Array.from({ length: 2 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      ) : featuredErrorInfo ? (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <ErrorState 
              title="Failed to load featured articles"
              message={featuredErrorInfo.message}
              onRetry={retryFeatured}
            />
          </div>
        </section>
      ) : featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Articles</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our most popular and comprehensive plant care guides
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.coverImage || post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {post.category}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{post.author}</span>
                      </div>
                      
                      <Link 
                        to={`/blog/${post.id}`}
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {searchTerm || selectedCategory !== 'all' ? 'Search Results' : 'Latest Articles'}
            </h2>
            <p className="text-gray-600">
              {blogLoading ? 'Loading articles...' : `${blogData?.total || blogPosts.length} article${(blogData?.total || blogPosts.length) !== 1 ? 's' : ''} found`}
            </p>
          </motion.div>

          {blogLoading ? (
            <BlogGridSkeleton count={limit} />
          ) : blogErrorInfo ? (
            <ErrorState 
              title="Failed to load articles"
              message={blogErrorInfo.message}
              onRetry={retryBlog}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-gray-100"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.coverImage || post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                        {post.featured && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readTime}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {formatDate(post.publishedAt)}
                          </span>
                          <Link 
                            to={`/blog/${post.id}`}
                            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
                          >
                            Read Article →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {blogData?.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-12">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, blogData.totalPages) }, (_, i) => {
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
                    onClick={() => setPage(p => Math.min(blogData.totalPages, p + 1))}
                    disabled={page === blogData.totalPages}
                    className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}

              {blogPosts.length === 0 && !blogLoading && (
                <div className="text-center py-12">
                  <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search terms or browse all categories
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                      setPage(1)
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated with Plant Care Tips
            </h2>
            <p className="text-green-100 mb-8">
              Get the latest articles and exclusive plant care guides delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <button className="bg-white hover:bg-gray-100 text-green-600 font-semibold px-6 py-3 rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}