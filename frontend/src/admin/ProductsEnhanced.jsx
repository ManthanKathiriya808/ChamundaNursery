/**
 * Enhanced Admin Products Management
 * 
 * Features:
 * - React Hook Form with Zod validation
 * - Animated form fields with real-time validation
 * - Error toasts with react-hot-toast
 * - Enhanced UX with Framer Motion animations
 * - Advanced product management features
 * - Bulk CSV upload with validation
 * - Search and filtering capabilities
 * - Responsive design
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
  ShoppingCart, BarChart3, TrendingUp, Calendar
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useData } from '../context/DataProvider.jsx'

// Enhanced validation schema with Zod
const productSchema = z.object({
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
  
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Price must be a valid positive number')
    .refine((val) => parseFloat(val) <= 10000, 'Price cannot exceed ₹10,000'),
  
  category: z
    .string()
    .min(1, 'Category is required'),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  
  image: z
    .string()
    .url('Image must be a valid URL')
    .optional()
    .or(z.literal('')),
  
  stock: z
    .string()
    .min(1, 'Stock quantity is required')
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, 'Stock must be a valid non-negative number')
    .refine((val) => parseInt(val) <= 10000, 'Stock cannot exceed 10,000 units'),
  
  featured: z.boolean(),
  
  status: z.enum(['active', 'inactive', 'draft'], {
    required_error: 'Status is required',
  }),
})

// Enhanced Form Field Component with animations
const FormField = ({ name, control, label, type = 'text', placeholder, icon: Icon, options, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error, isTouched } }) => {
        const hasValue = field.value && field.value.toString().length > 0
        const hasError = error && isTouched
        const isValid = !hasError && isTouched && hasValue

        if (type === 'select') {
          return (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                {label} {props.required && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <select
                  {...field}
                  className={`
                    w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
                    bg-white focus:outline-none
                    ${hasError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : isValid
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                    }
                    focus:ring-4
                  `}
                >
                  <option value="">{placeholder}</option>
                  {options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {Icon && (
                  <div className="absolute right-3 top-3 text-gray-400">
                    <Icon size={20} />
                  </div>
                )}
              </div>
              <AnimatePresence>
                {hasError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center space-x-2 text-red-600 text-sm"
                  >
                    <AlertCircle size={16} />
                    <span>{error.message}</span>
                  </motion.div>
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
              transition={{ duration: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                {label} {props.required && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <textarea
                  {...field}
                  placeholder={placeholder}
                  rows={4}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`
                    w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
                    bg-white focus:outline-none resize-none
                    ${hasError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : isValid
                      ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                    }
                    focus:ring-4
                  `}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {field.value?.length || 0}/1000
                </div>
              </div>
              <AnimatePresence>
                {hasError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex items-center space-x-2 text-red-600 text-sm"
                  >
                    <AlertCircle size={16} />
                    <span>{error.message}</span>
                  </motion.div>
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
              transition={{ duration: 0.2 }}
            >
              <input
                {...field}
                type="checkbox"
                checked={field.value}
                className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label className="text-sm font-medium text-gray-700">
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
            transition={{ duration: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              {label} {props.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                  w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
                  bg-white focus:outline-none
                  ${hasError 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : isValid
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }
                  focus:ring-4
                  ${Icon ? 'pr-12' : ''}
                `}
              />
              {Icon && (
                <div className="absolute right-3 top-3 text-gray-400">
                  <Icon size={20} />
                </div>
              )}
              <AnimatePresence>
                {isValid && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute right-3 top-3"
                  >
                    <CheckCircle className="text-green-500" size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {hasError && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex items-center space-x-2 text-red-600 text-sm"
                >
                  <AlertCircle size={16} />
                  <span>{error.message}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      }}
    />
  )
}

export default function AdminProductsEnhanced() {
  const { products, addOrUpdateProduct, removeProduct, loading } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [csvFile, setCsvFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileRef = useRef(null)
  
  // React Hook Form setup
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      slug: '',
      price: '',
      category: '',
      description: '',
      image: '',
      stock: '',
      featured: false,
      status: 'active'
    },
  })

  // Watch name field to auto-generate slug
  const watchedName = watch('name', '')
  
  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !editingProduct) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setValue('slug', slug)
    }
  }, [watchedName, setValue, editingProduct])

  // Categories for dropdown
  const categories = [
    { value: 'indoor', label: 'Indoor Plants' },
    { value: 'outdoor', label: 'Outdoor Plants' },
    { value: 'succulents', label: 'Succulents' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'flowers', label: 'Flowering Plants' },
    { value: 'trees', label: 'Trees' },
    { value: 'seeds', label: 'Seeds' },
    { value: 'tools', label: 'Garden Tools' },
    { value: 'pots', label: 'Pots & Planters' },
  ]

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
  ]

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      const productData = {
        ...data,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        id: editingProduct?.id || Date.now(),
      }
      
      await addOrUpdateProduct(productData)
      
      toast.success(
        editingProduct ? 'Product updated successfully! 🌱' : 'Product added successfully! 🌱',
        {
          duration: 4000,
          style: {
            background: '#10B981',
            color: 'white',
          },
        }
      )
      
      // Reset form and close modal
      reset()
      setShowAddForm(false)
      setEditingProduct(null)
      
    } catch (error) {
      console.error('Product submission error:', error)
      toast.error('Failed to save product. Please try again.', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: 'white',
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    try {
      await removeProduct(productId)
      toast.success('Product deleted successfully! 🗑️', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: 'white',
        },
      })
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete product. Please try again.', {
        duration: 4000,
      })
    }
  }

  // Handle edit product
  const handleEdit = (product) => {
    setEditingProduct(product)
    reset({
      name: product.name,
      slug: product.slug,
      price: product.price.toString(),
      category: product.category || '',
      description: product.description || '',
      image: product.image || '',
      stock: product.stock?.toString() || '0',
      featured: product.featured || false,
      status: product.status || 'active',
    })
    setShowAddForm(true)
  }

  // Handle CSV upload
  const handleCSVUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a .csv file', { duration: 3000 })
      return
    }
    
    try {
      const text = await file.text()
      const rows = text.split(/\r?\n/).filter(Boolean)
      const header = rows.shift()?.split(',') || []
      
      if (header.join(',') !== 'name,slug,price,category,description,stock') {
        toast.error('CSV header must be: name,slug,price,category,description,stock', {
          duration: 5000,
        })
        return
      }
      
      const parsed = []
      const badRows = []
      
      rows.forEach((line, idx) => {
        const [name, slug, price, category, description, stock] = line.split(',').map(s => s.trim())
        const rowErrors = []
        
        if (!name) rowErrors.push('name required')
        if (!slug) rowErrors.push('slug required')
        if (!price || isNaN(Number(price))) rowErrors.push('price invalid')
        if (!category) rowErrors.push('category required')
        if (!description) rowErrors.push('description required')
        if (!stock || isNaN(Number(stock))) rowErrors.push('stock invalid')
        
        if (rowErrors.length) {
          badRows.push({ line: idx + 2, errors: rowErrors })
        } else {
          parsed.push({
            id: Date.now() + idx,
            name,
            slug,
            price: Number(price),
            category,
            description,
            stock: Number(stock),
            featured: false,
            status: 'active'
          })
        }
      })
      
      if (badRows.length) {
        toast.error(`CSV errors in ${badRows.length} row(s)`, { duration: 4000 })
      } else {
        for (const row of parsed) {
          await addOrUpdateProduct(row)
        }
        toast.success(`Imported ${parsed.length} product(s) successfully! 📊`, {
          duration: 4000,
          style: {
            background: '#10B981',
            color: 'white',
          },
        })
      }
    } catch (error) {
      console.error('CSV upload error:', error)
      toast.error('Failed to process CSV file', { duration: 4000 })
    }
    
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  // Filter products
  const filteredProducts = (products || []).filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Package className="text-green-600" size={40} />
            <h1 className="text-4xl font-bold text-gray-800">Enhanced Product Management</h1>
          </div>
          <p className="text-lg text-gray-600">
            Advanced product management with validation, animations, and enhanced UX
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Products', value: products?.length || 0, icon: Package, color: 'blue' },
            { label: 'Active Products', value: products?.filter(p => p.status === 'active').length || 0, icon: CheckCircle, color: 'green' },
            { label: 'Featured Products', value: products?.filter(p => p.featured).length || 0, icon: Star, color: 'yellow' },
            { label: 'Total Stock', value: products?.reduce((sum, p) => sum + (p.stock || 0), 0) || 0, icon: BarChart3, color: 'purple' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`text-${stat.color}-600`} size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none transition-all"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus size={20} />
              <span>Add Product</span>
            </motion.button>
            
            <motion.label
              htmlFor="csv-upload"
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Upload size={20} />
              <span>Import CSV</span>
            </motion.label>
            <input
              id="csv-upload"
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Products Table */}
        <motion.div
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              Product Inventory ({filteredProducts.length} items)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Product</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Stock</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <ImageIcon className="text-gray-400" size={20} />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.slug}</p>
                            {product.featured && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Star size={12} className="mr-1" />
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {categories.find(c => c.value === product.category)?.label || product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">₹{product.price}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          (product.stock || 0) > 10 
                            ? 'bg-green-100 text-green-800'
                            : (product.stock || 0) > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock || 0} units
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : product.status === 'inactive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit2 size={16} />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-3">
                        <Package className="text-gray-300" size={48} />
                        <span className="text-lg font-medium">No products found</span>
                        <span className="text-sm">Add your first product or adjust your search filters.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {loading && (
            <div className="p-6 text-center">
              <div className="inline-flex items-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span>Loading products...</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Add/Edit Product Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingProduct(null)
                        reset()
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      name="name"
                      control={control}
                      label="Product Name"
                      placeholder="Enter product name"
                      icon={Package}
                      required
                    />
                    <FormField
                      name="slug"
                      control={control}
                      label="URL Slug"
                      placeholder="product-url-slug"
                      icon={Tag}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      name="price"
                      control={control}
                      type="number"
                      label="Price (₹)"
                      placeholder="0.00"
                      icon={DollarSign}
                      required
                    />
                    <FormField
                      name="stock"
                      control={control}
                      type="number"
                      label="Stock Quantity"
                      placeholder="0"
                      icon={Package}
                      required
                    />
                    <FormField
                      name="category"
                      control={control}
                      type="select"
                      label="Category"
                      placeholder="Select category"
                      options={categories}
                      required
                    />
                  </div>
                  
                  <FormField
                    name="image"
                    control={control}
                    type="url"
                    label="Image URL"
                    placeholder="https://example.com/image.jpg"
                    icon={ImageIcon}
                  />
                  
                  <FormField
                    name="description"
                    control={control}
                    type="textarea"
                    label="Description"
                    placeholder="Enter product description..."
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      name="status"
                      control={control}
                      type="select"
                      label="Status"
                      placeholder="Select status"
                      options={statusOptions}
                      required
                    />
                    <div className="flex items-end">
                      <FormField
                        name="featured"
                        control={control}
                        type="checkbox"
                        label="Featured Product"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingProduct(null)
                        reset()
                      }}
                      className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}