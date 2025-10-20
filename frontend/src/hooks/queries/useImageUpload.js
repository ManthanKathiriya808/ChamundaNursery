import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import useUIStore from '../../stores/uiStore'

const API_BASE = 'http://localhost:4000/api'

/**
 * Image Upload API functions
 * Handles image uploads, validation, and management for products and blog posts
 */
const imageAPI = {
  /**
   * Upload multiple images with validation
   * @param {Object} params - Upload parameters
   * @param {File[]} params.images - Array of image files
   * @param {string} params.type - Upload type ('product' | 'blog' | 'category')
   * @param {string} params.entityId - Optional entity ID for updates
   * @returns {Promise} Upload results with URLs and metadata
   */
  uploadImages: async ({ images, type, entityId }) => {
    const formData = new FormData()
    
    images.forEach((image, index) => {
      formData.append('images', image)
    })
    
    formData.append('type', type)
    if (entityId) {
      formData.append('entityId', entityId)
    }
    
    const response = await fetch(`${API_BASE}/admin/upload/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to upload images: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Delete an uploaded image
   * @param {string} imageUrl - URL or path of the image to delete
   * @param {string} type - Type of image ('product' | 'blog' | 'category')
   * @returns {Promise} Deletion confirmation
   */
  deleteImage: async (imageUrl, type) => {
    const response = await fetch(`${API_BASE}/admin/upload/images`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth.token')}`,
      },
      body: JSON.stringify({ imageUrl, type }),
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to delete image: ${response.statusText}`)
    }
    
    return response.json()
  },

  /**
   * Validate image files before upload
   * @param {File[]} files - Array of files to validate
   * @returns {Object} Validation results
   */
  validateImages: (files) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml', 'image/heic', 'image/heif']
    const maxSize = 10 * 1024 * 1024 // 10MB
    const maxFiles = 10
    
    const errors = []
    const validFiles = []
    
    if (files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} images allowed`)
      return { validFiles: [], errors }
    }
    
    files.forEach((file, index) => {
      if (!validTypes.includes(file.type)) {
        errors.push(`File ${index + 1}: Invalid file type. Allowed: JPG, PNG, WebP, AVIF, GIF, SVG, HEIC, HEIF`)
      } else if (file.size > maxSize) {
        errors.push(`File ${index + 1}: File too large. Maximum size: 10MB`)
      } else {
        validFiles.push(file)
      }
    })
    
    return { validFiles, errors }
  },
}

/**
 * Custom hook for managing image uploads with preview and validation
 * Provides comprehensive image management for admin forms
 * @param {Object} options - Configuration options
 * @param {string} options.type - Upload type ('product' | 'blog' | 'category')
 * @param {number} options.maxImages - Maximum number of images allowed
 * @param {Function} options.onUploadSuccess - Callback for successful uploads
 * @returns {Object} Image management utilities and state
 */
export const useImageUpload = ({ 
  type = 'product', 
  maxImages = 10, 
  onUploadSuccess 
} = {}) => {
  const { showSuccess, showError } = useUIStore()
  
  // State for managing images
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [uploadProgress, setUploadProgress] = useState({})
  const [dragActive, setDragActive] = useState(false)

  /**
   * Generate preview URLs for selected files
   * @param {File[]} files - Array of image files
   * @returns {string[]} Array of preview URLs
   */
  const generatePreviews = useCallback((files) => {
    return files.map(file => ({
      id: `${file.name}-${file.lastModified}`,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
    }))
  }, [])

  /**
   * Add new images with validation and preview generation
   * @param {File[]} newFiles - Array of new image files
   */
  const addImages = useCallback((newFiles) => {
    const { validFiles, errors } = imageAPI.validateImages(newFiles)
    
    if (errors.length > 0) {
      errors.forEach(error => showError(error, 'Image Validation Error'))
      return
    }
    
    const totalImages = images.length + validFiles.length
    if (totalImages > maxImages) {
      showError(`Maximum ${maxImages} images allowed. You can add ${maxImages - images.length} more.`, 'Too Many Images')
      return
    }
    
    const newPreviews = generatePreviews(validFiles)
    
    setImages(prev => [...prev, ...validFiles])
    setPreviews(prev => [...prev, ...newPreviews])
  }, [images, maxImages, generatePreviews, showError])

  /**
   * Remove an image by index
   * @param {number} index - Index of image to remove
   */
  const removeImage = useCallback((index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index)
      // Clean up object URL to prevent memory leaks
      if (prev[index]?.url) {
        URL.revokeObjectURL(prev[index].url)
      }
      return newPreviews
    })
  }, [])

  /**
   * Replace an image at specific index
   * @param {number} index - Index of image to replace
   * @param {File} newFile - New image file
   */
  const replaceImage = useCallback((index, newFile) => {
    const { validFiles, errors } = imageAPI.validateImages([newFile])
    
    if (errors.length > 0) {
      errors.forEach(error => showError(error, 'Image Validation Error'))
      return
    }
    
    const newPreview = generatePreviews(validFiles)[0]
    
    setImages(prev => {
      const newImages = [...prev]
      newImages[index] = validFiles[0]
      return newImages
    })
    
    setPreviews(prev => {
      const newPreviews = [...prev]
      // Clean up old object URL
      if (newPreviews[index]?.url) {
        URL.revokeObjectURL(newPreviews[index].url)
      }
      newPreviews[index] = newPreview
      return newPreviews
    })
  }, [generatePreviews, showError])

  /**
   * Reorder images by moving from one index to another
   * @param {number} fromIndex - Source index
   * @param {number} toIndex - Destination index
   */
  const reorderImages = useCallback((fromIndex, toIndex) => {
    setImages(prev => {
      const newImages = [...prev]
      const [movedImage] = newImages.splice(fromIndex, 1)
      newImages.splice(toIndex, 0, movedImage)
      return newImages
    })
    
    setPreviews(prev => {
      const newPreviews = [...prev]
      const [movedPreview] = newPreviews.splice(fromIndex, 1)
      newPreviews.splice(toIndex, 0, movedPreview)
      return newPreviews
    })
  }, [])

  /**
   * Clear all images and previews
   */
  const clearImages = useCallback(() => {
    // Clean up all object URLs
    previews.forEach(preview => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url)
      }
    })
    
    setImages([])
    setPreviews([])
    setUploadProgress({})
  }, [previews])

  /**
   * Set images directly (for external updates)
   * @param {File[]} newImages - Array of image files to set
   */
  const setImagesDirectly = useCallback((newImages) => {
    // Clean up existing previews
    previews.forEach(preview => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url)
      }
    })
    
    // Validate new images
    const { validFiles, errors } = imageAPI.validateImages(newImages)
    
    if (errors.length > 0) {
      errors.forEach(error => showError(error, 'Image Validation Error'))
      return
    }
    
    if (validFiles.length > maxImages) {
      showError(`Maximum ${maxImages} images allowed.`, 'Too Many Images')
      return
    }
    
    const newPreviews = generatePreviews(validFiles)
    
    setImages(validFiles)
    setPreviews(newPreviews)
  }, [previews, maxImages, generatePreviews, showError])

  /**
   * Handle drag and drop events
   */
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      addImages(droppedFiles)
    }
  }, [addImages])

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: ({ images: imagesToUpload, entityId }) => 
      imageAPI.uploadImages({ images: imagesToUpload, type, entityId }),
    onSuccess: (data) => {
      showSuccess(`Successfully uploaded ${data.images?.length || 0} images`)
      if (onUploadSuccess) {
        onUploadSuccess(data)
      }
    },
    onError: (error) => {
      showError(error.message, 'Upload Failed')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: ({ imageUrl }) => imageAPI.deleteImage(imageUrl, type),
    onSuccess: () => {
      showSuccess('Image deleted successfully')
    },
    onError: (error) => {
      showError(error.message, 'Delete Failed')
    },
  })

  /**
   * Upload all current images
   * @param {string} entityId - Optional entity ID for updates
   * @returns {Promise} Upload promise
   */
  const uploadImages = useCallback(async (entityId) => {
    if (images.length === 0) {
      return { images: [] }
    }
    
    return uploadMutation.mutateAsync({ images, entityId })
  }, [images, uploadMutation])

  /**
   * Delete an uploaded image
   * @param {string} imageUrl - URL of image to delete
   * @returns {Promise} Delete promise
   */
  const deleteUploadedImage = useCallback(async (imageUrl) => {
    return deleteMutation.mutateAsync({ imageUrl })
  }, [deleteMutation])

  // Cleanup effect for object URLs
  const cleanup = useCallback(() => {
    previews.forEach(preview => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url)
      }
    })
  }, [previews])

  return {
    // State
    images,
    previews,
    uploadProgress,
    dragActive,
    
    // Actions
    addImages,
    removeImage,
    replaceImage,
    reorderImages,
    clearImages,
    setImages: setImagesDirectly, // Expose setImages function
    uploadImages,
    deleteUploadedImage,
    
    // Drag and drop handlers
    handleDrag,
    handleDrop,
    
    // Upload states
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
    
    // Utilities
    hasImages: images.length > 0,
    canAddMore: images.length < maxImages,
    remainingSlots: maxImages - images.length,
    cleanup,
    
    // Validation
    validateFiles: imageAPI.validateImages,
  }
}

/**
 * Simplified hook for single image upload (e.g., featured images)
 * @param {Object} options - Configuration options
 * @returns {Object} Single image management utilities
 */
export const useSingleImageUpload = ({ type = 'product', onUploadSuccess } = {}) => {
  const multiImageHook = useImageUpload({ type, maxImages: 1, onUploadSuccess })
  
  return {
    ...multiImageHook,
    image: multiImageHook.images[0] || null,
    preview: multiImageHook.previews[0] || null,
    setImage: (file) => {
      multiImageHook.clearImages()
      if (file) {
        multiImageHook.addImages([file])
      }
    },
    hasImage: multiImageHook.images.length > 0,
  }
}