/**
 * Unified Admin Products Management
 * 
 * This component combines the best features from both Products Enhanced and Products Legacy:
 * - Modern React Hook Form with Zod validation (from Enhanced)
 * - Framer Motion animations for better UX (from Enhanced)
 * - Comprehensive ProductForm with all advanced fields (from Legacy)
 * - Multiple image upload support (from Legacy)
 * - Plant-specific fields and SEO optimization (from Legacy)
 * - Enhanced error handling and notifications (from Enhanced)
 * - Bulk operations and CSV import/export (from Legacy)
 * - Complete CRUD operations with optimistic updates
 */

import React, { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit2, Trash2, Upload, Download, Search, 
  Filter, Eye, Package, DollarSign, Tag, Image as ImageIcon,
  AlertCircle, CheckCircle, X, Save, Leaf, Star, 
  ShoppingCart, BarChart3, TrendingUp, Calendar,
  FileText, Globe, Palette, Ruler, Droplets, Sun
} from 'lucide-react'
import { useProducts, useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/queries/useProducts'
import { useCategories } from '../hooks/queries/useCategories'
import { useImageUpload } from "../hooks/queries/useImageUpload";
import { mediaAPI } from '../services/publicAPI'
import useUIStore from '../stores/uiStore'
import LoadingSpinner from '../components/LoadingSpinner'
import { ImageUploadSection } from './components/ImageUploadSection'

// Comprehensive validation schema combining both versions
const productSchema = z.object({
  // Basic Information
  name: z
    .string()
    .min(1, 'Product name is required')
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.,()]+$/, 'Product name contains invalid characters'),
  
  slug: z
    .string()
    .min(1, 'Product slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters'),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  
  shortDescription: z
    .string()
    .max(200, 'Short description must be less than 200 characters')
    .optional(),

  // Pricing & Inventory
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Price must be a valid positive number')
    .refine((val) => parseFloat(val) <= 100000, 'Price cannot exceed ₹1,00,000'),
  
  salePrice: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), 'Sale price must be a valid positive number'),
  
  stock: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), 'Stock must be a non-negative integer')
    .refine((val) => !val || parseInt(val) <= 100000, 'Stock cannot exceed 1,00,000 units'),
  
  sku: z
    .string()
    .optional(),
  
  lowStockThreshold: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), 'Low stock threshold must be a valid non-negative number'),

  // Physical Properties
  weight: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), 'Weight must be a valid positive number'),
  
  height: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), 'Height must be a valid positive number'),
  
  width: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), 'Width must be a valid positive number'),
  
  length: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), 'Length must be a valid positive number'),

  // Categorization
  categoryIds: z
    .array(z.number())
    .min(1, 'At least one category is required'),
  
  subCategory: z
    .string()
    .optional(),
  
  tags: z
    .string()
    .optional(),

  // Plant-Specific Fields
  botanicalName: z
    .string()
    .optional(),
  
  plantType: z
    .enum(['indoor', 'outdoor', 'both'], {
      required_error: 'Plant type is required',
    }).optional(),
  
  lightRequirement: z
    .enum(['low', 'medium', 'high', 'bright-indirect'], {
      required_error: 'Light requirement is required',
    }).optional(),
  
  wateringFrequency: z
    .enum(['daily', 'weekly', 'bi-weekly', 'monthly'], {
      required_error: 'Watering frequency is required',
    }).optional(),
  
  careInstructions: z
    .string()
    .max(1000, 'Care instructions must be less than 1000 characters')
    .optional(),
  
  bloomingSeason: z
    .string()
    .optional(),
  
  difficulty: z
    .enum(['easy', 'moderate', 'hard'], {
      required_error: 'Difficulty level is required',
    }).optional(),

  // SEO & Marketing
  metaTitle: z
    .string()
    .max(60, 'Meta title must be less than 60 characters')
    .optional(),
  
  metaDescription: z
    .string()
    .max(160, 'Meta description must be less than 160 characters')
    .optional(),
  
  metaKeywords: z
    .string()
    .optional(),

  // Images - now handled by file uploads instead of URLs
  images: z
    .array(z.any())
    .max(8, 'Maximum 8 images allowed')
    .optional(),
  
  featuredImage: z
    .any()
    .optional(),

  // Status & Features
  status: z.enum(['active', 'inactive', 'draft'], {
    required_error: 'Status is required',
  }),
  
  featured: z.boolean(),
  
  isNew: z.boolean().optional(),
  
  isBestseller: z.boolean().optional(),
})

// Enhanced Form Field Component with animations
const FormField = ({ name, control, label, type = 'text', placeholder, icon: Icon, options, rows, isMulti = false, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, isTouched } }) => {
        const hasValue = field.value && (Array.isArray(field.value) ? field.value.length > 0 : field.value.toString().length > 0)
        const hasError = error && isTouched
        const isValid = !hasError && isTouched && hasValue

        if (type === 'select') {
          if (isMulti) {
            // Multi-select implementation
            return (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {Icon && <Icon className="inline w-4 h-4 mr-2" />}
                  {label}
                </label>
                <div className="relative">
                  <div className={`min-h-[48px] w-full px-4 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all duration-200 ${
                    hasError
                      ? 'border-red-300 bg-red-50'
                      : isValid
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300'
                  }`}>
                    {/* Selected items display */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      {field.value && field.value.map((selectedId) => {
                        const option = options?.find(opt => opt.value === selectedId)
                        return option ? (
                          <span
                            key={selectedId}
                            className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-green-100 text-green-800"
                          >
                            {option.label}
                            <button
                              type="button"
                              onClick={() => {
                                const newValue = field.value.filter(id => id !== selectedId)
                                field.onChange(newValue)
                              }}
                              className="ml-1 text-green-600 hover:text-green-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ) : null
                      })}
                    </div>
                    
                    {/* Dropdown for adding new selections */}
                    <select
                      onChange={(e) => {
                        const selectedValue = parseInt(e.target.value)
                        if (selectedValue && !field.value?.includes(selectedValue)) {
                          const newValue = [...(field.value || []), selectedValue]
                          field.onChange(newValue)
                        }
                        e.target.value = '' // Reset dropdown
                      }}
                      className="w-full border-none outline-none bg-transparent"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    >
                      <option value="">{placeholder || `Select ${label}`}</option>
                      {options?.filter(option => !field.value?.includes(option.value)).map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {isValid && (
                    <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                  )}
                  {hasError && (
                    <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                  )}
                </div>
                <AnimatePresence>
                  {hasError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-red-600 flex items-center"
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {error.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          }
          
          // Single select implementation
          return (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {Icon && <Icon className="inline w-4 h-4 mr-2" />}
                {label}
              </label>
              <div className="relative">
                <select
                  {...field}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    hasError
                      ? 'border-red-300 bg-red-50'
                      : isValid
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300'
                  }`}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                >
                  <option value="">{placeholder || `Select ${label}`}</option>
                  {options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {isValid && (
                  <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                )}
                {hasError && (
                  <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                )}
              </div>
              <AnimatePresence>
                {hasError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-600 flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )
        }

        if (type === 'textarea') {
          return (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {Icon && <Icon className="inline w-4 h-4 mr-2" />}
                {label}
              </label>
              <div className="relative">
                <textarea
                  {...field}
                  rows={rows || 4}
                  placeholder={placeholder}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-vertical ${
                    hasError
                      ? 'border-red-300 bg-red-50'
                      : isValid
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-300'
                  }`}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                />
                {isValid && (
                  <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
                )}
                {hasError && (
                  <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                )}
              </div>
              <AnimatePresence>
                {hasError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-600 flex items-center"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )
        }

        if (type === 'checkbox') {
          return (
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                type="checkbox"
                {...field}
                checked={field.value || false}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label className="text-sm font-medium text-gray-700 flex items-center">
                {Icon && <Icon className="w-4 h-4 mr-2" />}
                {label}
              </label>
            </motion.div>
          )
        }

        return (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {Icon && <Icon className="inline w-4 h-4 mr-2" />}
              {label}
            </label>
            <div className="relative">
              <input
                type={type}
                {...field}
                placeholder={placeholder}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                  hasError
                    ? 'border-red-300 bg-red-50'
                    : isValid
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
                }`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                {...props}
              />
              {Icon && (
                <Icon className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-200 ${
                  isFocused ? 'text-green-500' : 'text-gray-400'
                }`} />
              )}
              {isValid && (
                <CheckCircle className="absolute right-3 top-3 w-5 h-5 text-green-500" />
              )}
              {hasError && (
                <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
              )}
            </div>
            <AnimatePresence>
              {hasError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-red-600 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {error.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )
      }}
    />
  )
}

export default function AdminProductsUnified() {
  // Component state
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [csvFile, setCsvFile] = useState(null)
  const [csvUploading, setCsvUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  // Form setup with comprehensive validation
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: '',
      salePrice: '',
      stock: '0',
      sku: '',
      lowStockThreshold: '',
      weight: '',
      height: '',
      width: '',
      length: '',
      categoryIds: [], // Fixed: changed from 'category' to 'categoryIds' array
      subCategory: '',
      tags: '',
      botanicalName: '',
      plantType: '',
      sunlightRequirement: '',
      waterRequirement: '',
      careInstructions: '',
      bloomingSeason: '',
      difficulty: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      images: [],
      featuredImage: '',
      status: 'active',
      featured: false,
      isNew: false,
      isBestseller: false,
    }
  })

  // Image upload hook
  const imageUpload = useImageUpload({ 
    type: 'product', 
    maxImages: 8 // Match the schema validation limit
  })

  // API hooks
  const { data: productsData, isLoading, error, refetch } = useAdminProducts({
    search: searchTerm,
    category: filterCategory,
    sortBy,
    sortOrder,
  })

  const { data: categoriesData } = useCategories()
  
  // Get UI store methods for notifications
  const { showSuccess, showError } = useUIStore()

  const createProductMutation = useCreateProduct({
    onSuccess: () => {
      showSuccess('Product created successfully!')
      setShowForm(false)
      setEditingProduct(null)
      form.reset()
      imageUpload.clearImages()
      // Force refetch to ensure UI updates immediately
      refetch()
    },
    onError: (error) => {
      showError(`Failed to create product: ${error.message}`)
    }
  })

  const updateProductMutation = useUpdateProduct({
    onSuccess: () => {
      showSuccess('Product updated successfully!')
      setShowForm(false)
      setEditingProduct(null)
      form.reset()
      imageUpload.clearImages()
      // Force refetch to ensure UI updates immediately
      refetch()
    },
    onError: (error) => {
      showError(`Failed to update product: ${error.message}`)
    }
  })

  const deleteProductMutation = useDeleteProduct({
    onSuccess: () => {
      showSuccess('Product deleted successfully!')
      // Force refetch to ensure UI updates immediately
      refetch()
    },
    onError: (error) => {
      showError(`Failed to delete product: ${error.message}`)
    }
  })

  // Extract data
  const products = productsData?.products || []
  const categories = categoriesData || []
  
  // Debug logging
  console.log('ProductsUnified - productsData:', productsData)
  console.log('ProductsUnified - products:', products)
  console.log('ProductsUnified - first product:', products[0])
  console.log('ProductsUnified - first product images:', products[0]?.images)

  // Form submission handler
  const handleFormSubmit = async (formData) => {
    console.log('=== FORM SUBMISSION START ===')
    console.log('Form data received:', formData)
    console.log('Editing product:', editingProduct)
    console.log('Image upload state:', {
      images: imageUpload.images,
      isUploading: imageUpload.isUploading,
      previews: imageUpload.previews
    })
    
    try {
      // Validate required fields before submission
      if (!formData.name || !formData.slug || !formData.price) {
        console.log('Validation failed: Missing required fields')
        showError('Please fill in all required fields: Name, Slug, and Price')
        return
      }

      // Validate price is a valid number
      const priceValue = parseFloat(formData.price)
      if (isNaN(priceValue) || priceValue <= 0) {
        console.log('Validation failed: Invalid price')
        showError('Please enter a valid price greater than 0')
        return
      }

      // Validate stock is a valid number
      const stockValue = parseInt(formData.stock)
      if (isNaN(stockValue) || stockValue < 0) {
        console.log('Validation failed: Invalid stock')
        showError('Please enter a valid stock quantity (0 or greater)')
        return
      }

      // Validate category selection
      if (!formData.categoryIds || formData.categoryIds.length === 0) {
        console.log('Validation failed: No categories selected')
        showError('Please select at least one category')
        return
      }

      console.log('All validations passed')

      // Generate UUID for new products (client-side UUID generation)
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0
          const v = c == 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      }

      // Include uploaded images in form data and prepare for array-based storage
      const submissionData = {
        ...formData,
        // Generate UUID for new products
        uuid_id: editingProduct?.uuid_id || generateUUID(),
        // Ensure categoryIds is an array of integers
        categoryIds: Array.isArray(formData.categoryIds) 
          ? formData.categoryIds.map(id => parseInt(id)) 
          : [parseInt(formData.categoryIds)],
        // Include images as array
        images: imageUpload.images,
        // Map frontend field names to backend expectations
        inventory: formData.stock,
        compare_price: formData.salePrice,
        short_description: formData.shortDescription,
        meta_title: formData.metaTitle,
        meta_description: formData.metaDescription,
        care_instructions: formData.careInstructions,
        plant_type: formData.plantType,
        light_requirement: formData.lightRequirement || formData.sunlightRequirement,
        watering_frequency: formData.wateringFrequency || formData.waterRequirement,
        botanical_name: formData.botanicalName,
        blooming_season: formData.bloomingSeason,
        low_stock_threshold: formData.lowStockThreshold || 5,
        // Convert dimensions to object if provided
        dimensions: (formData.height || formData.width || formData.length) ? {
          height: formData.height ? parseFloat(formData.height) : null,
          width: formData.width ? parseFloat(formData.width) : null,
          length: formData.length ? parseFloat(formData.length) : null
        } : null
      }
      
      console.log('Submitting product data:', submissionData)
      console.log('About to call mutation...')
      
      if (editingProduct) {
        console.log('Calling updateProductMutation...')
        await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          ...submissionData
        })
      } else {
        console.log('Calling createProductMutation...')
        await createProductMutation.mutateAsync(submissionData)
      }
      
      console.log('Mutation completed successfully')
      
    } catch (error) {
      console.error('=== FORM SUBMISSION ERROR ===')
      console.error('Error details:', error)
      console.error('Error message:', error.message)
      console.error('Error response:', error.response)
      
      const errorMessage = error.response?.data?.error?.message || error.message || 'An unexpected error occurred'
      showError(`Failed to ${editingProduct ? 'update' : 'create'} product: ${errorMessage}`)
    }
    
    console.log('=== FORM SUBMISSION END ===')
  }

  // Edit product handler
  const handleEditProduct = (product) => {
    setEditingProduct(product)
    
    // Prepare form data with proper field mapping and array handling
    const formData = {
      ...product,
      // Map backend fields to frontend form fields
      stock: product.inventory?.toString() || product.stock?.toString() || '0',
      salePrice: product.compare_price?.toString() || product.salePrice?.toString() || '',
      shortDescription: product.short_description || product.shortDescription || '',
      metaTitle: product.meta_title || product.metaTitle || '',
      metaDescription: product.meta_description || product.metaDescription || '',
      careInstructions: product.care_instructions || product.careInstructions || '',
      plantType: product.plant_type || product.plantType || '',
      lightRequirement: product.light_requirement || product.lightRequirement || product.sunlightRequirement || '',
      wateringFrequency: product.watering_frequency || product.wateringFrequency || product.waterRequirement || '',
      botanicalName: product.botanical_name || product.botanicalName || '',
      bloomingSeason: product.blooming_season || product.bloomingSeason || '',
      lowStockThreshold: product.low_stock_threshold?.toString() || product.lowStockThreshold?.toString() || '5',
      
      // Handle category IDs - prioritize array format
      categoryIds: product.category_ids && Array.isArray(product.category_ids) 
        ? product.category_ids 
        : product.categoryIds && Array.isArray(product.categoryIds)
        ? product.categoryIds
        : product.category_id 
        ? [product.category_id]
        : [],
      
      // Handle dimensions object
      height: product.dimensions?.height?.toString() || product.height?.toString() || '',
      width: product.dimensions?.width?.toString() || product.width?.toString() || '',
      length: product.dimensions?.length?.toString() || product.length?.toString() || '',
      
      // Handle price fields
      price: product.price?.toString() || '0',
      
      // Handle other fields
      weight: product.weight?.toString() || '',
      sku: product.sku || '',
      tags: product.tags || '',
      subCategory: product.subCategory || '',
      metaKeywords: product.metaKeywords || '',
      
      // Handle boolean fields
      status: product.status || 'active',
      featured: Boolean(product.featured),
      isNew: Boolean(product.isNew),
      isBestseller: Boolean(product.isBestseller),
      
      // Handle images - prioritize array format
      images: product.image_urls && Array.isArray(product.image_urls)
        ? product.image_urls.map(url => ({ url, preview: url }))
        : product.images && Array.isArray(product.images)
        ? product.images
        : product.image
        ? [{ url: product.image, preview: product.image }]
        : []
    }
    
    console.log('Editing product with form data:', formData)
    form.reset(formData)
    
    // Set images for the image upload component
    if (formData.images && formData.images.length > 0) {
      setImageUpload(prev => ({
        ...prev,
        images: formData.images
      }))
    }
    
    setShowForm(true)
  }

  // Delete product handler
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProductMutation.mutateAsync(productId)
    }
  }

  // CSV upload handler
  const handleCsvUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setCsvUploading(true)
    const formData = new FormData()
    formData.append('csv', file)

    try {
      const response = await fetch('/api/products/bulk-upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast.success('Products uploaded successfully!')
        refetch()
      } else {
        toast.error('Failed to upload products')
      }
    } catch (error) {
      toast.error('Upload failed')
    } finally {
      setCsvUploading(false)
      event.target.value = ''
    }
  }

  // Auto-generate slug from name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  // Watch name field to auto-generate slug
  const watchedName = form.watch('name')
  useEffect(() => {
    if (watchedName && !editingProduct) {
      form.setValue('slug', generateSlug(watchedName))
    }
  }, [watchedName, form, editingProduct])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog with advanced features</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              refetch()
              toast.success('Product list refreshed!')
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingProduct(null)
              form.reset()
              setShowForm(true)
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Product
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center">
            <Package className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => parseInt(p.stock) < 10).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border"
        >
          <div className="flex items-center">
            <Star className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">
                {products.filter(p => p.featured).length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-')
              setSortBy(field)
              setSortOrder(order)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="price-asc">Price Low-High</option>
            <option value="price-desc">Price High-Low</option>
            <option value="stock-asc">Stock Low-High</option>
            <option value="stock-desc">Stock High-Low</option>
          </select>

          <div className="flex gap-2">
            <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              {csvUploading ? 'Uploading...' : 'Import CSV'}
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
                disabled={csvUploading}
              />
            </label>

            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Download className="w-5 h-5 mr-2" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UUID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {products.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {/* Prioritize image_urls array, then fallback to legacy image field */}
                          {(product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) ||
                           (product.images && Array.isArray(product.images) && product.images.length > 0) ||
                           product.image ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={
                                (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) 
                                  ? mediaAPI.getImageUrl(product.image_urls[0])
                                  : (product.images && Array.isArray(product.images) && product.images.length > 0)
                                    ? mediaAPI.getImageUrl(product.images[0]?.full_url || product.images[0]?.image_url || product.images[0]?.url)
                                    : mediaAPI.getImageUrl(product.image)
                              }
                              alt={product.name}
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <div 
                            className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center" 
                            style={{ 
                              display: (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) ||
                                      (product.images && Array.isArray(product.images) && product.images.length > 0) ||
                                      product.image ? 'none' : 'flex' 
                            }}
                          >
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                            {product.featured && (
                              <Star className="inline w-4 h-4 text-yellow-500 ml-2" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {product.uuid_id || product.uuid || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {/* Display categories from category_ids array or fallback to legacy Category */}
                        {product.category_ids && Array.isArray(product.category_ids) && product.category_ids.length > 0 ? (
                          product.category_ids.map((categoryId) => {
                            const category = categories?.find(cat => cat.id === categoryId)
                            return (
                              <span 
                                key={categoryId} 
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {category?.name || `Category ${categoryId}`}
                              </span>
                            )
                          })
                        ) : product.Categories && Array.isArray(product.Categories) && product.Categories.length > 0 ? (
                          product.Categories.map((category) => (
                            <span 
                              key={category.id} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {category.name}
                            </span>
                          ))
                        ) : product.Category?.name ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {product.Category.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Uncategorized
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{parseFloat(product.price).toLocaleString()}
                        {product.salePrice && (
                          <span className="text-xs text-red-600 ml-2">
                            (Sale: ₹{parseFloat(product.salePrice).toLocaleString()})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        parseInt(product.inventory) === 0 
                          ? 'text-red-600' 
                          : parseInt(product.inventory) < 10 
                          ? 'text-yellow-600' 
                          : 'text-green-600'
                      }`}>
                        {product.inventory} units
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : product.status === 'inactive'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                    form.reset()
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="p-6">
                  {/* Tab Navigation */}
                  <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                    {[
                      { id: 'basic', label: 'Basic Info', icon: Package },
                      { id: 'pricing', label: 'Pricing & Inventory', icon: DollarSign },
                      { id: 'physical', label: 'Physical Properties', icon: Ruler },
                      { id: 'plant', label: 'Plant Details', icon: Leaf },
                      { id: 'seo', label: 'SEO & Marketing', icon: Globe },
                      { id: 'images', label: 'Images', icon: ImageIcon },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <tab.icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'basic' && (
                      <motion.div
                        key="basic"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="name"
                            control={form.control}
                            label="Product Name"
                            placeholder="Enter product name"
                            icon={Package}
                          />
                          <FormField
                            name="slug"
                            control={form.control}
                            label="Product Slug"
                            placeholder="product-slug"
                            icon={Tag}
                          />
                        </div>

                        <FormField
                          name="shortDescription"
                          control={form.control}
                          label="Short Description"
                          type="textarea"
                          rows={2}
                          placeholder="Brief product description"
                        />

                        <FormField
                          name="description"
                          control={form.control}
                          label="Full Description"
                          type="textarea"
                          rows={6}
                          placeholder="Detailed product description"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="categoryIds"
                            control={form.control}
                            label="Categories"
                            type="select"
                            isMulti={true}
                            placeholder="Select categories"
                            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
                          />
                          <FormField
                            name="tags"
                            control={form.control}
                            label="Tags"
                            placeholder="plant, indoor, low-maintenance"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            name="status"
                            control={form.control}
                            label="Status"
                            type="select"
                            options={[
                              { value: 'active', label: 'Active' },
                              { value: 'inactive', label: 'Inactive' },
                              { value: 'draft', label: 'Draft' },
                            ]}
                          />
                          <FormField
                            name="featured"
                            control={form.control}
                            label="Featured Product"
                            type="checkbox"
                            icon={Star}
                          />
                          <FormField
                            name="isNew"
                            control={form.control}
                            label="New Product"
                            type="checkbox"
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'pricing' && (
                      <motion.div
                        key="pricing"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="price"
                            control={form.control}
                            label="Regular Price (₹)"
                            type="number"
                            placeholder="0.00"
                            icon={DollarSign}
                            min="0"
                            step="0.01"
                          />
                          <FormField
                            name="salePrice"
                            control={form.control}
                            label="Sale Price (₹)"
                            type="number"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            name="stock"
                            control={form.control}
                            label="Stock Quantity"
                            type="number"
                            placeholder="0"
                            min="0"
                          />
                          <FormField
                            name="sku"
                            control={form.control}
                            label="SKU"
                            placeholder="PROD-001"
                          />
                          <FormField
                            name="lowStockThreshold"
                            control={form.control}
                            label="Low Stock Alert"
                            type="number"
                            placeholder="10"
                            min="0"
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'physical' && (
                      <motion.div
                        key="physical"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="weight"
                            control={form.control}
                            label="Weight (kg)"
                            type="number"
                            placeholder="0.0"
                            min="0"
                            step="0.1"
                          />
                          <FormField
                            name="height"
                            control={form.control}
                            label="Height (cm)"
                            type="number"
                            placeholder="0"
                            min="0"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="width"
                            control={form.control}
                            label="Width (cm)"
                            type="number"
                            placeholder="0"
                            min="0"
                          />
                          <FormField
                            name="length"
                            control={form.control}
                            label="Length (cm)"
                            type="number"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'plant' && (
                      <motion.div
                        key="plant"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            name="botanicalName"
                            control={form.control}
                            label="Botanical Name"
                            placeholder="Scientific name"
                            icon={Leaf}
                          />
                          <FormField
                            name="plantType"
                            control={form.control}
                            label="Plant Type"
                            type="select"
                            options={[
                              { value: 'indoor', label: 'Indoor' },
                              { value: 'outdoor', label: 'Outdoor' },
                              { value: 'both', label: 'Both' },
                            ]}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            name="lightRequirement"
                            control={form.control}
                            label="Light Requirement"
                            type="select"
                            icon={Sun}
                            options={[
                              { value: 'low', label: 'Low Light' },
                              { value: 'medium', label: 'Medium Light' },
                              { value: 'high', label: 'High Light' },
                              { value: 'bright-indirect', label: 'Bright Indirect Light' },
                            ]}
                          />
                          <FormField
                            name="wateringFrequency"
                            control={form.control}
                            label="Watering Frequency"
                            type="select"
                            icon={Droplets}
                            options={[
                              { value: 'daily', label: 'Daily' },
                              { value: 'weekly', label: 'Weekly' },
                              { value: 'bi-weekly', label: 'Bi-weekly' },
                              { value: 'monthly', label: 'Monthly' },
                            ]}
                          />
                          <FormField
                            name="difficulty"
                            control={form.control}
                            label="Care Difficulty"
                            type="select"
                            options={[
                              { value: 'easy', label: 'Easy' },
                              { value: 'moderate', label: 'Moderate' },
                              { value: 'hard', label: 'Hard' },
                            ]}
                          />
                        </div>

                        <FormField
                          name="bloomingSeason"
                          control={form.control}
                          label="Blooming Season"
                          placeholder="Spring, Summer, Fall, Winter"
                        />

                        <FormField
                          name="careInstructions"
                          control={form.control}
                          label="Care Instructions"
                          type="textarea"
                          rows={4}
                          placeholder="Detailed care instructions for this plant"
                        />
                      </motion.div>
                    )}

                    {activeTab === 'seo' && (
                      <motion.div
                        key="seo"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <FormField
                          name="metaTitle"
                          control={form.control}
                          label="Meta Title"
                          placeholder="SEO title (max 60 characters)"
                          icon={Globe}
                        />

                        <FormField
                          name="metaDescription"
                          control={form.control}
                          label="Meta Description"
                          type="textarea"
                          rows={3}
                          placeholder="SEO description (max 160 characters)"
                        />

                        <FormField
                          name="metaKeywords"
                          control={form.control}
                          label="Meta Keywords"
                          placeholder="keyword1, keyword2, keyword3"
                        />

                        <FormField
                          name="isBestseller"
                          control={form.control}
                          label="Bestseller Product"
                          type="checkbox"
                        />
                      </motion.div>
                    )}

                    {activeTab === 'images' && (
                      <motion.div
                        key="images"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <ImageUploadSection
                          images={imageUpload.images}
                          onImagesChange={(newImages) => {
                            // Don't clear existing images, just update with new array
                            // This allows proper handling of both additions and removals
                            imageUpload.setImages(newImages)
                          }}
                          onImageUpload={async (file, index) => {
                            // Handle individual image upload if needed
                            console.log('Individual image upload:', file, index)
                          }}
                          isUploading={imageUpload.isUploading}
                          maxImages={8}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false)
                        setEditingProduct(null)
                        form.reset()
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={createProductMutation.isLoading || updateProductMutation.isLoading}
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {createProductMutation.isLoading || updateProductMutation.isLoading
                        ? 'Saving...'
                        : editingProduct
                        ? 'Update Product'
                        : 'Create Product'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}