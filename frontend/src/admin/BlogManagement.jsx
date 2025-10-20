import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import Select from 'react-select'
import { 
  useBlogPosts, 
  useCreateBlogPost, 
  useUpdateBlogPost, 
  useDeleteBlogPost,
  useBlogTags,
  useSearchBlogPosts
} from '../hooks/queries/useBlog'
import { useImageUpload } from '../hooks/queries/useImageUpload'
import useUIStore from '../stores/uiStore'
import LoadingSpinner from '../components/LoadingSpinner'
import ImagePreviewGrid from '../components/admin/ImagePreviewGrid'

/**
 * Blog post form validation schema
 * Defines validation rules for blog post creation and editing
 */
const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z.string().min(1, 'Slug is required').max(200, 'Slug too long'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt too long'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  publishedAt: z.string().optional(),
  tags: z.array(z.string()).default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  readingTime: z.number().min(1).default(5),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  category: z.enum(['care-guide', 'tips', 'seasonal', 'troubleshooting', 'general']).default('general')
})

/**
 * Quill editor configuration
 * Customizes the WYSIWYG editor with plant care specific features
 */
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false,
  }
}

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'color', 'background', 'list', 'bullet', 'indent',
  'align', 'blockquote', 'code-block', 'link', 'image', 'video'
]

/**
 * Blog Post Card Component
 * Displays individual blog post with actions
 */
function BlogPostCard({ post, onEdit, onDelete, onToggleStatus, onToggleFeatured }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'care-guide': return 'bg-blue-100 text-blue-800'
      case 'tips': return 'bg-purple-100 text-purple-800'
      case 'seasonal': return 'bg-orange-100 text-orange-800'
      case 'troubleshooting': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {post.title}
            </h3>
            {post.featured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {post.excerpt}
          </p>

          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
            <span>Reading time: {post.readingTime} min</span>
            <span>Difficulty: {post.difficulty}</span>
            <span>Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
              {post.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
              {post.category.replace('-', ' ')}
            </span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                  +{post.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Featured Image */}
        <div className="flex-shrink-0 ml-4">
          {post.featuredImage ? (
            <img
              src={post.featuredImage.url}
              alt={post.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleStatus(post)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              post.status === 'published'
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {post.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          
          <button
            onClick={() => onToggleFeatured(post)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              post.featured
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {post.featured ? 'Unfeature' : 'Feature'}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(post)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit post"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(post)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete post"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Blog Post Form Component
 * Handles blog post creation and editing with WYSIWYG editor
 */
function BlogPostForm({ post, onSubmit, onCancel, isLoading }) {
  const { showNotification } = useUIStore()
  const { uploadImages, deleteImage } = useImageUpload()
  const { data: availableTags = [] } = useBlogTags()
  const [images, setImages] = useState(post?.images || [])
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage ? [post.featuredImage] : [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      status: post?.status || 'draft',
      featured: post?.featured || false,
      publishedAt: post?.publishedAt || '',
      tags: post?.tags || [],
      seoTitle: post?.seoTitle || '',
      seoDescription: post?.seoDescription || '',
      seoKeywords: post?.seoKeywords || '',
      readingTime: post?.readingTime || 5,
      difficulty: post?.difficulty || 'beginner',
      category: post?.category || 'general'
    }
  })

  const watchTitle = watch('title')
  const watchContent = watch('content')

  // Auto-generate slug from title
  React.useEffect(() => {
    if (watchTitle && !post) {
      const slug = watchTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setValue('slug', slug)
    }
  }, [watchTitle, setValue, post])

  // Auto-calculate reading time from content
  React.useEffect(() => {
    if (watchContent) {
      const wordCount = watchContent.replace(/<[^>]*>/g, '').split(/\s+/).length
      const readingTime = Math.max(1, Math.ceil(wordCount / 200)) // 200 words per minute
      setValue('readingTime', readingTime)
    }
  }, [watchContent, setValue])

  /**
   * Handle image upload for blog content
   */
  const handleImageUpload = async (files) => {
    try {
      const uploadedImages = await uploadImages(files)
      setImages(prev => [...prev, ...uploadedImages])
      showNotification('Images uploaded successfully', 'success')
    } catch (error) {
      showNotification('Failed to upload images', 'error')
    }
  }

  /**
   * Handle featured image upload
   */
  const handleFeaturedImageUpload = async (files) => {
    try {
      const uploadedImages = await uploadImages(files)
      setFeaturedImage(uploadedImages.slice(0, 1))
      showNotification('Featured image uploaded successfully', 'success')
    } catch (error) {
      showNotification('Failed to upload featured image', 'error')
    }
  }

  /**
   * Handle image deletion
   */
  const handleImageDelete = async (imageId) => {
    try {
      await deleteImage(imageId)
      setImages(images.filter(img => img.id !== imageId))
      showNotification('Image deleted successfully', 'success')
    } catch (error) {
      showNotification('Failed to delete image', 'error')
    }
  }

  /**
   * Handle featured image deletion
   */
  const handleFeaturedImageDelete = async (imageId) => {
    try {
      await deleteImage(imageId)
      setFeaturedImage([])
      showNotification('Featured image removed successfully', 'success')
    } catch (error) {
      showNotification('Failed to remove featured image', 'error')
    }
  }

  /**
   * Handle form submission
   */
  const onFormSubmit = (data) => {
    const blogPostData = {
      ...data,
      images,
      featuredImage: featuredImage[0] || null,
      publishedAt: data.status === 'published' && !data.publishedAt 
        ? new Date().toISOString() 
        : data.publishedAt
    }
    onSubmit(blogPostData)
  }

  // Transform available tags for react-select
  const tagOptions = availableTags.map(tag => ({
    value: tag,
    label: `#${tag}`
  }))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {post ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                {...register('title')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter blog post title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                {...register('slug')}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.slug ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="blog-post-url-slug"
              />
              {errors.slug && (
                <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                {...register('excerpt')}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  errors.excerpt ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief description of the blog post..."
              />
              {errors.excerpt && (
                <p className="text-red-500 text-xs mt-1">{errors.excerpt.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="general">General</option>
                  <option value="care-guide">Care Guide</option>
                  <option value="tips">Tips</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="troubleshooting">Troubleshooting</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  {...register('difficulty')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reading Time (min)
                </label>
                <input
                  {...register('readingTime', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  {...register('featured')}
                  type="checkbox"
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Post</span>
              </label>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={tagOptions}
                value={field.value?.map(tag => ({ value: tag, label: `#${tag}` }))}
                onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                placeholder="Select or create tags..."
                className="react-select-container"
                classNamePrefix="react-select"
                isCreatable
              />
            )}
          />
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <ImagePreviewGrid
            images={featuredImage}
            onUpload={handleFeaturedImageUpload}
            onDelete={handleFeaturedImageDelete}
            maxImages={1}
            className="mb-4"
          />
        </div>

        {/* Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content *
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <ReactQuill
                {...field}
                theme="snow"
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write your blog post content here..."
                className="bg-white"
                style={{ minHeight: '300px' }}
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
          )}
        </div>

        {/* Content Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content Images
          </label>
          <ImagePreviewGrid
            images={images}
            onUpload={handleImageUpload}
            onDelete={handleImageDelete}
            className="mb-4"
          />
        </div>

        {/* SEO Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                {...register('seoTitle')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="SEO title for search engines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                {...register('seoDescription')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="SEO description for search engines"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Keywords
              </label>
              <input
                {...register('seoKeywords')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              !isValid || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isLoading && <LoadingSpinner size="sm" />}
            <span>{post ? 'Update Post' : 'Create Post'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  )
}

/**
 * Main Blog Management Component
 * Provides comprehensive blog and plant care content management
 */
export default function BlogManagement() {
  const { showNotification } = useUIStore()
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // API hooks for blog management
  const { data: posts = [], isLoading, error } = useBlogPosts()
  const createPostMutation = useCreateBlogPost()
  const updatePostMutation = useUpdateBlogPost()
  const deletePostMutation = useDeleteBlogPost()

  /**
   * Filter posts based on search and filters
   */
  const filteredPosts = useMemo(() => {
    // Safety check to ensure posts is an array
    if (!Array.isArray(posts)) {
      return []
    }
    
    return posts.filter(post => {
      const matchesSearch = !searchTerm || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [posts, searchTerm, statusFilter, categoryFilter])

  /**
   * Handle blog post form submission
   */
  const handleFormSubmit = async (postData) => {
    try {
      if (editingPost) {
        await updatePostMutation.mutateAsync({
          id: editingPost.id,
          data: postData
        })
        showNotification('Blog post updated successfully', 'success')
      } else {
        await createPostMutation.mutateAsync(postData)
        showNotification('Blog post created successfully', 'success')
      }
      setShowForm(false)
      setEditingPost(null)
    } catch (error) {
      showNotification(
        editingPost ? 'Failed to update blog post' : 'Failed to create blog post',
        'error'
      )
    }
  }

  /**
   * Handle blog post deletion
   */
  const handleDelete = async (post) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        await deletePostMutation.mutateAsync(post.id)
        showNotification('Blog post deleted successfully', 'success')
      } catch (error) {
        showNotification('Failed to delete blog post', 'error')
      }
    }
  }

  /**
   * Handle post status toggle
   */
  const handleToggleStatus = async (post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published'
    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        data: { 
          status: newStatus,
          publishedAt: newStatus === 'published' ? new Date().toISOString() : post.publishedAt
        }
      })
      showNotification(
        `Post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`,
        'success'
      )
    } catch (error) {
      showNotification('Failed to update post status', 'error')
    }
  }

  /**
   * Handle featured toggle
   */
  const handleToggleFeatured = async (post) => {
    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        data: { featured: !post.featured }
      })
      showNotification(
        `Post ${!post.featured ? 'featured' : 'unfeatured'} successfully`,
        'success'
      )
    } catch (error) {
      showNotification('Failed to update featured status', 'error')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load blog posts</h3>
            <p className="text-red-700">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog & Plant Care</h1>
            <p className="text-gray-600 mt-1">
              Create and manage educational content for plant enthusiasts
            </p>
          </div>
          <button
            onClick={() => {
              setEditingPost(null)
              setShowForm(true)
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Post</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-semibold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.837-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {posts.filter(p => p.featured).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="care-guide">Care Guide</option>
                <option value="tips">Tips</option>
                <option value="seasonal">Seasonal</option>
                <option value="troubleshooting">Troubleshooting</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Blog Posts ({filteredPosts.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" text="Loading blog posts..." />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first blog post'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => {
                    setEditingPost(null)
                    setShowForm(true)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredPosts.map((post) => (
                    <BlogPostCard
                      key={post.id}
                      post={post}
                      onEdit={(post) => {
                        setEditingPost(post)
                        setShowForm(true)
                      }}
                      onDelete={handleDelete}
                      onToggleStatus={handleToggleStatus}
                      onToggleFeatured={handleToggleFeatured}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Blog Post Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowForm(false)
                  setEditingPost(null)
                }
              }}
            >
              <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <BlogPostForm
                  post={editingPost}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingPost(null)
                  }}
                  isLoading={createPostMutation.isPending || updatePostMutation.isPending}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}