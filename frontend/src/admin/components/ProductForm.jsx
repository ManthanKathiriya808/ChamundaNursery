import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import Select from 'react-select'
import { useImageUpload } from '../../hooks/queries/useImageUpload'
import { useCategories } from '../../hooks/queries/useCategories'
import { ImageUploadSection } from './ImageUploadSection'
import LoadingSpinner from '../../components/LoadingSpinner'

/**
 * Product form validation schema using Zod
 * Ensures all required fields are validated with proper error messages
 */
const productSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must be less than 100 characters'),
  
  slug: z.string()
    .min(1, 'URL slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
    .max(100, 'Slug must be less than 100 characters'),
  
  description: z.string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  
  shortDescription: z.string()
    .max(200, 'Short description must be less than 200 characters')
    .optional(),
  
  price: z.number()
    .min(0.01, 'Price must be greater than 0')
    .max(999999, 'Price must be less than 999,999'),
  
  comparePrice: z.number()
    .min(0, 'Compare price must be 0 or greater')
    .max(999999, 'Compare price must be less than 999,999')
    .optional()
    .nullable(),
  
  inventory: z.number()
    .int('Inventory must be a whole number')
    .min(0, 'Inventory cannot be negative')
    .max(99999, 'Inventory must be less than 99,999'),
  
  sku: z.string()
    .max(50, 'SKU must be less than 50 characters')
    .optional(),
  
  weight: z.number()
    .min(0, 'Weight cannot be negative')
    .max(9999, 'Weight must be less than 9,999 kg')
    .optional()
    .nullable(),
  
  dimensions: z.object({
    length: z.number().min(0).optional().nullable(),
    width: z.number().min(0).optional().nullable(),
    height: z.number().min(0).optional().nullable(),
  }).optional(),
  
  categoryIds: z.array(z.number())
    .min(1, 'At least one category is required'),
  
  tags: z.array(z.string())
    .optional(),
  
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  
  seoTitle: z.string()
    .max(60, 'SEO title must be less than 60 characters')
    .optional(),
  
  seoDescription: z.string()
    .max(160, 'SEO description must be less than 160 characters')
    .optional(),
  
  careInstructions: z.string()
    .max(1000, 'Care instructions must be less than 1000 characters')
    .optional(),
  
  plantType: z.enum(['indoor', 'outdoor', 'succulent', 'flowering', 'foliage', 'herb', 'vegetable', 'fruit', 'tree', 'shrub']).optional(),
  lightRequirement: z.enum(['low', 'medium', 'high', 'bright-indirect']).optional(),
  wateringFrequency: z.enum(['daily', 'weekly', 'bi-weekly', 'monthly']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
})

/**
 * Enhanced Product Form Component
 * Provides comprehensive product creation and editing with:
 * - React Hook Form with Zod validation
 * - Multiple image upload with preview
 * - Dynamic category selection
 * - Real-time validation feedback
 * - Animated form interactions
 */
export const ProductForm = ({ 
  product = null, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [tagInput, setTagInput] = useState('')
  
  // Initialize form with react-hook-form and Zod validation
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      description: product?.description || '',
      shortDescription: product?.shortDescription || '',
      price: product?.price || 1, // Set minimum valid price
      comparePrice: product?.comparePrice || null,
      inventory: product?.inventory || 0,
      sku: product?.sku || '',
      weight: product?.weight || null,
      dimensions: product?.dimensions || { length: null, width: null, height: null },
      categoryIds: product?.categories?.map(cat => cat.id) || [],
      tags: product?.tags || [],
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      seoTitle: product?.seoTitle || '',
      seoDescription: product?.seoDescription || '',
      careInstructions: product?.careInstructions || '',
      plantType: product?.plantType || undefined,
      lightRequirement: product?.lightRequirement || undefined,
      wateringFrequency: product?.wateringFrequency || undefined,
      difficulty: product?.difficulty || undefined,
    },
    mode: 'onChange',
  })

  // Debug form validation state
  console.log('Form validation state:', { 
    isValid, 
    errors: Object.keys(errors), 
    errorDetails: errors,
    formValues: watch()
  })

  // Watch form values for dynamic updates
  const watchedName = watch('name')
  const watchedPrice = watch('price')
  const watchedComparePrice = watch('comparePrice')

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !product) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setValue('slug', slug)
      trigger('slug')
    }
  }, [watchedName, setValue, trigger, product])

  // Image upload hook for product images
  const imageUpload = useImageUpload({
    type: 'product',
    maxImages: 8,
    onUploadSuccess: (data) => {
      console.log('Images uploaded successfully:', data)
    }
  })

  // Fetch categories for selection
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()
  const categories = categoriesData?.categories || []

  // Transform categories for react-select
  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name,
    parent: category.parent_id ? categories.find(c => c.id === category.parent_id)?.name : null
  }))

  // Plant type options - updated to match backend validation
  const plantTypeOptions = [
    { value: 'indoor', label: 'Indoor Plant' },
    { value: 'outdoor', label: 'Outdoor Plant' },
    { value: 'succulent', label: 'Succulent' },
    { value: 'flowering', label: 'Flowering Plant' },
    { value: 'foliage', label: 'Foliage Plant' },
    { value: 'herb', label: 'Herb' },
    { value: 'vegetable', label: 'Vegetable' },
    { value: 'fruit', label: 'Fruit Plant' },
    { value: 'tree', label: 'Tree' },
    { value: 'shrub', label: 'Shrub' }
  ]

  // Light requirement options
  const lightOptions = [
    { value: 'low', label: 'Low Light' },
    { value: 'medium', label: 'Medium Light' },
    { value: 'high', label: 'High Light' },
    { value: 'bright-indirect', label: 'Bright Indirect Light' }
  ]

  // Watering frequency options
  const wateringOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' }
  ]

  // Difficulty options
  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ]

  /**
   * Handle form submission with image upload
   */
  const onFormSubmit = async (data) => {
    console.log('Form submitted with data:', data)
    console.log('Current form errors:', errors)
    console.log('Form is valid:', isValid)
    
    try {
      // Include images directly in form data for backend processing
      const formData = {
        ...data,
        images: imageUpload.images, // Pass the actual File objects
        existingImages: product?.images || []
      }

      console.log('Submitting form with images:', formData.images?.length || 0)

      await onSubmit(formData)
      
      // Reset form and images on successful creation
      if (!product) {
        reset()
        imageUpload.clearImages()
        setTagInput('')
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  /**
   * Handle tag addition
   */
  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = watch('tags') || []
      if (!currentTags.includes(tagInput.trim())) {
        setValue('tags', [...currentTags, tagInput.trim()])
        setTagInput('')
      }
    }
  }

  /**
   * Handle tag removal
   */
  const removeTag = (tagToRemove) => {
    const currentTags = watch('tags') || []
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
    >
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">
          {product ? 'Edit Product' : 'Add New Product'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {product ? 'Update product information and images' : 'Create a new product with images and details'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
            Basic Information
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Enter product name"
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-600 text-xs mt-1"
                        >
                          {errors.name.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              />
            </div>

            {/* URL Slug */}
            <div>
              <Controller
                name="slug"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Slug *
                    </label>
                    <input
                      {...field}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.slug ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="product-url-slug"
                    />
                    <AnimatePresence>
                      {errors.slug && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-600 text-xs mt-1"
                        >
                          {errors.slug.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...field}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-vertical ${
                      errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Detailed product description..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    <AnimatePresence>
                      {errors.description && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-red-600 text-xs"
                        >
                          {errors.description.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <span className="text-xs text-gray-500">
                      {watch('description')?.length || 0}/2000
                    </span>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Short Description */}
          <div>
            <Controller
              name="shortDescription"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                      errors.shortDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Brief product summary for listings"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <AnimatePresence>
                      {errors.shortDescription && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-red-600 text-xs"
                        >
                          {errors.shortDescription.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <span className="text-xs text-gray-500">
                      {watch('shortDescription')?.length || 0}/200
                    </span>
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
            Pricing & Inventory
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    <AnimatePresence>
                      {errors.price && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-600 text-xs mt-1"
                        >
                          {errors.price.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              />
            </div>

            {/* Compare Price */}
            <div>
              <Controller
                name="comparePrice"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compare Price (₹)
                    </label>
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.comparePrice ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                    />
                    {watchedComparePrice && watchedPrice && watchedComparePrice > watchedPrice && (
                      <p className="text-green-600 text-xs mt-1">
                        {Math.round(((watchedComparePrice - watchedPrice) / watchedComparePrice) * 100)}% discount
                      </p>
                    )}
                    <AnimatePresence>
                      {errors.comparePrice && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-600 text-xs mt-1"
                        >
                          {errors.comparePrice.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              />
            </div>

            {/* Inventory */}
            <div>
              <Controller
                name="inventory"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inventory *
                    </label>
                    <input
                      {...field}
                      type="number"
                      min="0"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                        errors.inventory ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0"
                    />
                    <AnimatePresence>
                      {errors.inventory && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-600 text-xs mt-1"
                        >
                          {errors.inventory.message}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
            Categories & Tags
          </h4>
          
          {/* Category Selection */}
          <div>
            <Controller
              name="categoryIds"
              control={control}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categories *
                  </label>
                  <Select
                    {...field}
                    isMulti
                    options={categoryOptions}
                    value={categoryOptions.filter(option => field.value?.includes(option.value))}
                    onChange={(selected) => field.onChange(selected?.map(option => option.value) || [])}
                    isLoading={categoriesLoading}
                    placeholder="Select categories..."
                    className={`react-select-container ${errors.categoryIds ? 'react-select-error' : ''}`}
                    classNamePrefix="react-select"
                    formatOptionLabel={(option) => (
                      <div>
                        <span>{option.label}</span>
                        {option.parent && (
                          <span className="text-xs text-gray-500 ml-2">in {option.parent}</span>
                        )}
                      </div>
                    )}
                  />
                  <AnimatePresence>
                    {errors.categoryIds && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-600 text-xs mt-1"
                      >
                        {errors.categoryIds.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              )}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(watch('tags') || []).map((tag, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <ImageUploadSection
          images={imageUpload.previews.map(p => p.file)}
          onImagesChange={(newImages) => {
            imageUpload.clearImages()
            if (newImages.length > 0) {
              imageUpload.addImages(newImages)
            }
          }}
          onImageUpload={async (file, index) => {
            // Handle individual image upload if needed
            console.log('Individual image upload:', file, index)
          }}
          isUploading={imageUpload.isUploading}
          maxImages={8}
        />

        {/* Advanced Options Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium"
          >
            <span>{showAdvanced ? '▼' : '▶'}</span>
            <span>Advanced Options</span>
          </button>
        </div>

        {/* Advanced Options */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Plant Care Information */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                  Plant Care Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Plant Type */}
                  <div>
                    <Controller
                      name="plantType"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Plant Type
                          </label>
                          <Select
                            {...field}
                            options={plantTypeOptions}
                            value={plantTypeOptions.find(option => option.value === field.value)}
                            onChange={(selected) => field.onChange(selected?.value || undefined)}
                            placeholder="Select plant type..."
                            isClearable
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>
                      )}
                    />
                  </div>

                  {/* Light Requirement */}
                  <div>
                    <Controller
                      name="lightRequirement"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Light Requirement
                          </label>
                          <Select
                            {...field}
                            options={lightOptions}
                            value={lightOptions.find(option => option.value === field.value)}
                            onChange={(selected) => field.onChange(selected?.value || undefined)}
                            placeholder="Select light requirement..."
                            isClearable
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>
                      )}
                    />
                  </div>

                  {/* Watering Frequency */}
                  <div>
                    <Controller
                      name="wateringFrequency"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Watering Frequency
                          </label>
                          <Select
                            {...field}
                            options={wateringOptions}
                            value={wateringOptions.find(option => option.value === field.value)}
                            onChange={(selected) => field.onChange(selected?.value || undefined)}
                            placeholder="Select watering frequency..."
                            isClearable
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>
                      )}
                    />
                  </div>

                  {/* Difficulty */}
                  <div>
                    <Controller
                      name="difficulty"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty Level
                          </label>
                          <Select
                            {...field}
                            options={difficultyOptions}
                            value={difficultyOptions.find(option => option.value === field.value)}
                            onChange={(selected) => field.onChange(selected?.value || undefined)}
                            placeholder="Select difficulty..."
                            isClearable
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Care Instructions */}
                <div>
                  <Controller
                    name="careInstructions"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Care Instructions
                        </label>
                        <textarea
                          {...field}
                          rows={3}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-vertical ${
                            errors.careInstructions ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          placeholder="Detailed care instructions for this plant..."
                        />
                        <div className="flex justify-between items-center mt-1">
                          <AnimatePresence>
                            {errors.careInstructions && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-red-600 text-xs"
                              >
                                {errors.careInstructions.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                          <span className="text-xs text-gray-500">
                            {watch('careInstructions')?.length || 0}/1000
                          </span>
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                  Product Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* SKU */}
                  <div>
                    <Controller
                      name="sku"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            SKU
                          </label>
                          <input
                            {...field}
                            type="text"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                              errors.sku ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Product SKU"
                          />
                          <AnimatePresence>
                            {errors.sku && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-600 text-xs mt-1"
                              >
                                {errors.sku.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <Controller
                      name="weight"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Weight (kg)
                          </label>
                          <input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                              errors.weight ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="0.00"
                          />
                          <AnimatePresence>
                            {errors.weight && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-red-600 text-xs mt-1"
                              >
                                {errors.weight.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions (cm)
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    <Controller
                      name="dimensions.length"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.1"
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Length"
                        />
                      )}
                    />
                    <Controller
                      name="dimensions.width"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.1"
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Width"
                        />
                      )}
                    />
                    <Controller
                      name="dimensions.height"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.1"
                          min="0"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Height"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                  SEO Settings
                </h4>
                
                <div className="space-y-4">
                  {/* SEO Title */}
                  <div>
                    <Controller
                      name="seoTitle"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            SEO Title
                          </label>
                          <input
                            {...field}
                            type="text"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors ${
                              errors.seoTitle ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="SEO optimized title"
                          />
                          <div className="flex justify-between items-center mt-1">
                            <AnimatePresence>
                              {errors.seoTitle && (
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="text-red-600 text-xs"
                                >
                                  {errors.seoTitle.message}
                                </motion.p>
                              )}
                            </AnimatePresence>
                            <span className="text-xs text-gray-500">
                              {watch('seoTitle')?.length || 0}/60
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  </div>

                  {/* SEO Description */}
                  <div>
                    <Controller
                      name="seoDescription"
                      control={control}
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            SEO Description
                          </label>
                          <textarea
                            {...field}
                            rows={2}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-vertical ${
                              errors.seoDescription ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="SEO meta description"
                          />
                          <div className="flex justify-between items-center mt-1">
                            <AnimatePresence>
                              {errors.seoDescription && (
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="text-red-600 text-xs"
                                >
                                  {errors.seoDescription.message}
                                </motion.p>
                              )}
                            </AnimatePresence>
                            <span className="text-xs text-gray-500">
                              {watch('seoDescription')?.length || 0}/160
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Status Settings */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                  Status Settings
                </h4>
                
                <div className="flex flex-wrap gap-6">
                  {/* Is Active */}
                  <div className="flex items-center">
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Active Product</span>
                        </label>
                      )}
                    />
                  </div>

                  {/* Is Featured */}
                  <div className="flex items-center">
                    <Controller
                      name="isFeatured"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Featured Product</span>
                        </label>
                      )}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || imageUpload.isUploading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isLoading || imageUpload.isUploading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {(isLoading || imageUpload.isUploading) && <LoadingSpinner size="sm" />}
            <span>
              {isLoading || imageUpload.isUploading 
                ? 'Saving...' 
                : product 
                  ? 'Update Product' 
                  : 'Create Product'
              }
            </span>
          </button>
        </div>
      </form>
    </motion.div>
  )
}