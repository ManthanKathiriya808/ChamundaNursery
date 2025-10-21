import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core'
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable'
import { 
  useSortable 
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/queries/useCategories'
import useUIStore from '../stores/uiStore'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../components/ToastProvider'
import useSSE from '../hooks/useSSE'

/**
 * Category form validation schema
 * Defines validation rules for category creation and editing
 */
const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional()
})

/**
 * Sortable Category Item Component
 * Handles drag-and-drop functionality for category reordering
 */
function SortableCategoryItem({ category, onEdit, onDelete, onToggleActive, level = 0 }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  // Check if this is a true parent category (has no parent_id)
  const isParentCategory = !category.parentId || category.parentId === null
  
  // Determine category type for visual differentiation
  const categoryName = category.name.toLowerCase()
  const isPlantCategory = categoryName.includes('plant') || 
                         categoryName.includes('indoor') || 
                         categoryName.includes('outdoor') || 
                         categoryName.includes('bonsai') || 
                         categoryName.includes('fruit') || 
                         categoryName.includes('vegetable') ||
                         categoryName.includes('seed')
  
  const isSupplyCategory = categoryName.includes('supply') || 
                          categoryName.includes('supplies') || 
                          categoryName.includes('tool') || 
                          categoryName.includes('pot') || 
                          categoryName.includes('fertilizer') ||
                          categoryName.includes('soil')

  // Define styling based on category type
  let categoryStyles = {
    border: 'border-gray-200',
    background: 'bg-white',
    textColor: 'text-gray-900',
    icon: '🏷️',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-600'
  }

  if (isPlantCategory) {
    categoryStyles = {
      border: 'border-green-300',
      background: 'bg-green-50',
      textColor: 'text-green-900',
      icon: '🌱',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-700'
    }
  } else if (isSupplyCategory) {
    categoryStyles = {
      border: 'border-blue-300',
      background: 'bg-blue-50',
      textColor: 'text-blue-900',
      icon: '🧰',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-700'
    }
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        ...style,
        marginLeft: `${level * 24}px`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${categoryStyles.background} border ${categoryStyles.border} rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging ? 'z-50 shadow-lg' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Category Type Icon */}
          <div className={`w-10 h-10 rounded-full ${categoryStyles.iconBg} flex items-center justify-center flex-shrink-0`}>
            <span className="text-lg">{categoryStyles.icon}</span>
          </div>

          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>

          {/* Category Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className={`text-sm font-medium ${categoryStyles.textColor}`}>
                {category.name}
                {isParentCategory && (
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    isPlantCategory ? 'bg-green-200 text-green-800' :
                    isSupplyCategory ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    Parent Category
                  </span>
                )}
                {isPlantCategory && (
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">
                    🌿 Plants
                  </span>
                )}
                {isSupplyCategory && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                    🛠️ Supplies
                  </span>
                )}
              </h3>
              {level > 0 && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Level {level}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{category.slug}</p>
            {category.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{category.description}</p>
            )}
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-xs text-gray-500">
                Products: {category.productCount || 0}
              </span>
              <span className="text-xs text-gray-500">
                Order: {category.sortOrder}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Status Toggle */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleActive(category)
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              category.isActive
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {category.isActive ? 'Active' : 'Inactive'}
          </button>

          {/* Edit Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onEdit(category)
            }}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit category"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(category)
            }}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete category"
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
 * Category Form Component
 * Handles category creation and editing with image upload
 */
function CategoryForm({ category, onSubmit, onCancel, isLoading }) {
  const { showNotification } = useUIStore()
  
  // Fetch all categories for parent selection
  const { data: allCategories = [] } = useCategories()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(categorySchema),
    mode: 'onChange',
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      parentId: category?.parentId || '',
      isActive: category?.isActive ?? true,
      sortOrder: category?.sortOrder || 0,
      seoTitle: category?.seoTitle || '',
      seoDescription: category?.seoDescription || '',
      seoKeywords: category?.seoKeywords || ''
    }
  })
  
  // Filter available parent categories (exclude current category and its children)
  const availableParentCategories = React.useMemo(() => {
    if (!Array.isArray(allCategories)) return []
    
    // If editing, exclude the current category and its descendants
    if (category) {
      const getDescendantIds = (categoryId, categories) => {
        const descendants = []
        const findDescendants = (id) => {
          descendants.push(id)
          categories.forEach(cat => {
            if (cat.parentId === id) {
              findDescendants(cat.id)
            }
          })
        }
        findDescendants(categoryId)
        return descendants
      }
      
      const excludeIds = getDescendantIds(category.id, allCategories)
      return allCategories.filter(cat => !excludeIds.includes(cat.id))
    }
    
    return allCategories
  }, [allCategories, category])

  const watchName = watch('name')

  // Auto-generate slug from name
  React.useEffect(() => {
    if (watchName && !category) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setValue('slug', slug)
    }
  }, [watchName, setValue, category])

  /**
   * Handle form submission
   */
  const onFormSubmit = (data) => {
    onSubmit(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {category ? 'Edit Category' : 'Add New Category'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter category name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
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
              placeholder="category-url-slug"
            />
            {errors.slug && (
              <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Category description..."
          />
        </div>

        {/* Parent Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent Category
          </label>
          <select
            {...register('parentId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">None (Main Category)</option>
            {availableParentCategories
              .filter(cat => !cat.parentId) // Only show main categories as parent options
              .map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select a parent category to create a subcategory
          </p>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <input
              {...register('sortOrder', { valueAsNumber: true })}
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          <div className="flex items-center space-x-4 pt-8">
            <label className="flex items-center">
              <input
                {...register('isActive')}
                type="checkbox"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
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
            <span>{category ? 'Update Category' : 'Create Category'}</span>
          </button>
        </div>
      </form>
    </motion.div>
  )
}

/**
 * Main Categories Management Component
 * Provides comprehensive category management with nesting and reordering
 */
export default function AdminCategories() {
  const { push: showToast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [filterByLevel, setFilterByLevel] = useState('')
  const [sortBy, setSortBy] = useState('sortOrder')

  // API hooks for category management
  const { data: categories = [], isLoading, error } = useCategories({ showInactive })
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const deleteCategoryMutation = useDeleteCategory()

  // SSE connection for real-time updates
  const { isConnected } = useSSE(`${import.meta.env.VITE_API_URL || 'http://localhost:4001'}/api/sse/events`, {
    onMessage: (data) => {
      console.log('Real-time category update:', data)
      if (data.type === 'category_created') {
        showToast('New category created', 'success')
      } else if (data.type === 'category_updated') {
        showToast('Category updated', 'info')
      } else if (data.type === 'category_deleted') {
        showToast('Category deleted', 'warning')
      }
    },
    onError: (error) => {
      console.error('SSE connection error:', error)
    },
    enabled: true
  })

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  /**
   * Build hierarchical category tree from flat array
   */
  const categoryTree = useMemo(() => {
    // Safety check to ensure categories is an array
    if (!Array.isArray(categories)) {
      return []
    }
    
    const buildTree = (parentId = null, level = 0) => {
      return categories
        .filter(cat => cat.parentId === parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(category => ({
          ...category,
          level,
          children: buildTree(category.id, level + 1)
        }))
    }
    return buildTree()
  }, [categories])

  /**
   * Flatten tree for display and filtering
   */
  const flattenedCategories = useMemo(() => {
    const flatten = (tree, result = []) => {
      tree.forEach(category => {
        result.push(category)
        if (category.children?.length > 0) {
          flatten(category.children, result)
        }
      })
      return result
    }
    return flatten(categoryTree)
  }, [categoryTree])

  /**
   * Filter categories based on search, status, level, and sort
   */
  const filteredCategories = useMemo(() => {
    let filtered = flattenedCategories.filter(category => {
      const matchesSearch = !searchTerm || 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = showInactive || category.isActive
      
      const matchesLevel = !filterByLevel || 
        (filterByLevel === 'parent' && (!category.parentId || category.parentId === null)) ||
        (filterByLevel === 'child' && category.parentId) ||
        (filterByLevel === 'level1' && category.level === 1) ||
        (filterByLevel === 'level2' && category.level === 2)
      
      return matchesSearch && matchesStatus && matchesLevel
    })

    // Sort the filtered results
    if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === 'level') {
      filtered.sort((a, b) => a.level - b.level)
    } else if (sortBy === 'status') {
      filtered.sort((a, b) => {
        if (a.isActive === b.isActive) return 0
        return a.isActive ? -1 : 1
      })
    } else {
      // Default: sortOrder
      filtered.sort((a, b) => a.sortOrder - b.sortOrder)
    }

    return filtered
  }, [flattenedCategories, searchTerm, showInactive, filterByLevel, sortBy])

  /**
   * Handle drag end for reordering
   */
  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = filteredCategories.findIndex(cat => cat.id === active.id)
      const newIndex = filteredCategories.findIndex(cat => cat.id === over.id)
      
      const reorderedCategories = arrayMove(filteredCategories, oldIndex, newIndex)
      
      // Update sort orders
      const updates = reorderedCategories.map((category, index) => ({
        id: category.id,
        sortOrder: index
      }))

      try {
        // Update each category's sort order
        await Promise.all(
          updates.map(update => 
            updateCategoryMutation.mutateAsync({
              id: update.id,
              sortOrder: update.sortOrder
            })
          )
        )
        showNotification('Categories reordered successfully', 'success')
      } catch (error) {
        showNotification('Failed to reorder categories', 'error')
      }
    }
  }

  /**
   * Handle category form submission
   */
  const handleFormSubmit = async (categoryData) => {
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategory.id,
          ...categoryData
        })
        showToast('success', 'Category updated successfully')
      } else {
        await createCategoryMutation.mutateAsync(categoryData)
        showToast('success', 'Category created successfully')
      }
      setShowForm(false)
      setEditingCategory(null)
    } catch (error) {
      showToast(
        'error',
        editingCategory ? 'Failed to update category' : 'Failed to create category'
      )
    }
  }

  /**
   * Handle category deletion
   */
  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
      try {
        await deleteCategoryMutation.mutateAsync(category.id)
        showToast('success', 'Category deleted successfully')
      } catch (error) {
        showToast('error', 'Failed to delete category')
      }
    }
  }

  /**
   * Handle category status toggle
   */
  const handleToggleActive = async (category) => {
    try {
      await updateCategoryMutation.mutateAsync({
        id: category.id,
        isActive: !category.isActive
      })
      showToast(
        'success',
        `Category ${!category.isActive ? 'activated' : 'deactivated'} successfully`
      )
    } catch (error) {
      showToast('error', 'Failed to update category status')
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
            <h3 className="text-lg font-medium text-red-900 mb-2">Failed to load categories</h3>
            <p className="text-red-700">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
            <p className="text-gray-600 mt-1">
              Organize your products with hierarchical categories
            </p>
            {/* Real-time connection status */}
            <div className="flex items-center mt-2 text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                {isConnected ? 'Real-time updates active' : 'Real-time updates disconnected'}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null)
              setShowForm(true)
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Category</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {categories.filter(c => c.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Parent Categories</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {categories.filter(c => !c.parentId).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Subcategories</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {categories.filter(c => c.parentId).length}
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
                  placeholder="Search categories by name, slug, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter by Level */}
            <div className="flex items-center space-x-2">
              <label htmlFor="filterByLevel" className="text-sm text-gray-700 whitespace-nowrap">
                Filter by:
              </label>
              <select
                id="filterByLevel"
                value={filterByLevel}
                onChange={(e) => setFilterByLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="">All Categories</option>
                <option value="parent">Parent Categories</option>
                <option value="child">Subcategories</option>
                <option value="level1">Level 1</option>
                <option value="level2">Level 2</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <label htmlFor="sortBy" className="text-sm text-gray-700 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              >
                <option value="sortOrder">Sort Order</option>
                <option value="name">Name</option>
                <option value="level">Level</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Show Inactive Toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showInactive"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="showInactive" className="text-sm text-gray-700 whitespace-nowrap">
                Show Inactive
              </label>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Categories ({filteredCategories.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" text="Loading categories..." />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first category'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => {
                    setEditingCategory(null)
                    setShowForm(true)
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Your First Category
                </button>
              )}
            </div>
          ) : (
            <div className="p-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredCategories.map(cat => cat.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    <AnimatePresence>
                      {filteredCategories.map((category) => (
                        <SortableCategoryItem
                          key={category.id}
                          category={category}
                          level={category.level}
                          onEdit={(cat) => {
                            setEditingCategory(cat)
                            setShowForm(true)
                          }}
                          onDelete={handleDelete}
                          onToggleActive={handleToggleActive}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>

        {/* Category Form Modal */}
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
                  setEditingCategory(null)
                }
              }}
            >
              <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CategoryForm
                  category={editingCategory}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingCategory(null)
                  }}
                  isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}