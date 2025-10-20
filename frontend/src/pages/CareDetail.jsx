import React, { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Clock, 
  Tag, 
  Calendar,
  Share2,
  BookOpen,
  Leaf,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { usePlantCareArticle, usePlantCareArticles, useApiError } from '../hooks/usePublicData'
import { useData } from '../context/DataContext'
import { BlogCardSkeleton, ErrorState } from '../components/LoadingSkeletons'

export default function CareDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { careGuides: fallbackCareGuides } = useData()

  // Fetch the specific care article
  const { 
    data: careArticle, 
    isLoading: articleLoading, 
    error: articleError 
  } = usePlantCareArticle(id)

  // Fetch related articles
  const { 
    data: relatedData, 
    isLoading: relatedLoading 
  } = usePlantCareArticles({
    limit: 3,
    exclude: id
  })

  // Error handling
  const articleErrorInfo = useApiError(articleError)

  // Memoized article data with fallback
  const article = useMemo(() => {
    if (careArticle) return careArticle
    // Fallback to static data
    return fallbackCareGuides?.find(guide => guide.id === parseInt(id) || guide.id === id)
  }, [careArticle, fallbackCareGuides, id])

  // Related articles with fallback
  const relatedArticles = useMemo(() => {
    if (relatedData?.articles) return relatedData.articles
    // Fallback to static data
    return fallbackCareGuides?.filter(guide => 
      (guide.id !== parseInt(id) && guide.id !== id) && 
      (guide.category === article?.category || guide.difficulty === article?.difficulty)
    ).slice(0, 3) || []
  }, [relatedData, fallbackCareGuides, id, article])

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.description || article?.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  // Loading state
  if (articleLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <BlogCardSkeleton />
            <div className="mt-8 space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (articleErrorInfo && !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <ErrorState 
              title="Care guide not found"
              message={articleErrorInfo.message || "The care guide you're looking for doesn't exist or has been removed."}
              onRetry={retryArticle}
            />
            <div className="mt-8 text-center">
              <Link 
                to="/care"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Care Guides
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Article not found
  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center">
            <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Care Guide Not Found</h1>
            <p className="text-gray-600 mb-8">
              The care guide you're looking for doesn't exist or has been removed.
            </p>
            <Link 
              to="/care"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Care Guides
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{article.title} • Plant Care Guide • Chamunda Nursery</title>
        <meta name="description" content={article.description || article.excerpt || `Learn about ${article.title} with our comprehensive plant care guide.`} />
        <meta property="og:title" content={`${article.title} • Plant Care Guide`} />
        <meta property="og:description" content={article.description || article.excerpt} />
        <meta property="og:image" content={article.coverImage || article.image} />
      </Helmet>

      {/* Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {article.category || 'Plant Care'}
              </span>
              {article.difficulty && (
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  article.difficulty === 'Beginner' ? 'bg-blue-100 text-blue-800' :
                  article.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {article.difficulty}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
              {article.readTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {article.readTime}
                </div>
              )}
              {(article.created_at || article.publishedAt) && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.created_at || article.publishedAt)}
                </div>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 hover:text-green-600 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            {(article.description || article.excerpt) && (
              <p className="text-lg text-gray-700 leading-relaxed">
                {article.description || article.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {(article.coverImage || article.image) && (
        <section className="bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={article.coverImage || article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8">
              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                {article.content ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : article.sections ? (
                  <div className="space-y-8">
                    {article.sections.map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="border-l-4 border-green-500 pl-6"
                      >
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          {section.heading}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {section.body}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : article.steps ? (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Step-by-Step Guide</h3>
                    {article.steps.map((step, index) => (
                      <motion.div
                        key={step.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium">{step.label}</p>
                          {step.description && (
                            <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Content is being updated. Please check back later.</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Tags:</span>
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Care Guides</h2>
                <p className="text-gray-600">Discover more expert plant care advice</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.map((relatedArticle, index) => (
                  <motion.article
                    key={relatedArticle.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-gray-100"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={relatedArticle.coverImage || relatedArticle.image || '/api/placeholder/400/250'}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          {relatedArticle.category || 'Plant Care'}
                        </span>
                        {relatedArticle.difficulty && (
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            relatedArticle.difficulty === 'Beginner' ? 'bg-blue-100 text-blue-800' :
                            relatedArticle.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {relatedArticle.difficulty}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {relatedArticle.description || relatedArticle.excerpt || 'Learn essential care tips for healthy plants.'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {relatedArticle.readTime || '5 min read'}
                        </div>
                        <Link 
                          to={`/care/${relatedArticle.id}`}
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

              <div className="text-center mt-12">
                <Link
                  to="/care"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  View All Care Guides
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

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
                Get More Plant Care Tips
              </h2>
              <p className="text-green-100 mb-8 text-lg">
                Subscribe to receive weekly care guides and expert advice
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