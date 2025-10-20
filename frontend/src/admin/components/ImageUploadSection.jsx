import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  PhotoIcon, 
  XMarkIcon, 
  ArrowUpTrayIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

/**
 * Individual Image Upload Slot Component
 * Handles single image upload with drag-and-drop, preview, and removal
 */
const ImageSlot = ({ 
  index, 
  image, 
  onImageSelect, 
  onImageRemove, 
  onImagePreview,
  isUploading = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(index, acceptedFiles[0])
    }
    setIsDragOver(false)
  }, [index, onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: false,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false)
  })

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageSelect(index, file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div
        {...getRootProps()}
        className={`
          relative aspect-square border-2 border-dashed rounded-xl cursor-pointer
          transition-all duration-200 overflow-hidden
          ${isDragActive || isDragOver 
            ? 'border-green-400 bg-green-50 scale-105' 
            : image 
              ? 'border-gray-200 bg-white' 
              : 'border-gray-300 bg-gray-50 hover:border-green-300 hover:bg-green-25'
          }
          ${isUploading ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {image ? (
          // Image Preview
          <div className="relative w-full h-full">
            <img
              src={typeof image === 'string' ? image : URL.createObjectURL(image)}
              alt={`Product image ${index + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Image Overlay Actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onImagePreview(image)
                  }}
                  className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                  title="Preview image"
                >
                  <EyeIcon className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onImageRemove(index)
                  }}
                  className="p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
                  title="Remove image"
                >
                  <XMarkIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Primary Image Badge */}
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Primary
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                  <span className="text-xs text-gray-600">Uploading...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Empty Slot
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            {isDragActive || isDragOver ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex flex-col items-center space-y-2"
              >
                <ArrowUpTrayIcon className="w-8 h-8 text-green-500" />
                <p className="text-sm font-medium text-green-600">Drop image here</p>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="p-3 bg-gray-100 rounded-full group-hover:bg-green-100 transition-colors">
                  <PlusIcon className="w-6 h-6 text-gray-400 group-hover:text-green-500 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    {index === 0 ? 'Primary Image' : `Image ${index + 1}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Click or drag to upload
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Manual File Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id={`image-input-${index}`}
      />
    </motion.div>
  )
}

/**
 * Image Preview Modal Component
 */
const ImagePreviewModal = ({ image, isOpen, onClose }) => {
  if (!isOpen || !image) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="relative max-w-4xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={typeof image === 'string' ? image : URL.createObjectURL(image)}
          alt="Preview"
          className="max-w-full max-h-full object-contain rounded-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-all"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </motion.div>
    </motion.div>
  )
}

/**
 * Main Image Upload Section Component
 * Provides 8 individual image upload slots with drag-and-drop functionality
 */
export const ImageUploadSection = ({ 
  images = [], 
  onImagesChange, 
  onImageUpload,
  isUploading = false,
  maxImages = 8 
}) => {
  const [previewImage, setPreviewImage] = useState(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Ensure images array has exactly maxImages slots
  const imageSlots = Array.from({ length: maxImages }, (_, index) => images[index] || null)

  const handleImageSelect = async (index, file) => {
    const newImages = [...imageSlots]
    newImages[index] = file
    
    // Remove null values and update
    const filteredImages = newImages.filter(img => img !== null)
    onImagesChange(filteredImages)

    // Upload the image if upload handler is provided
    if (onImageUpload) {
      try {
        await onImageUpload(file, index)
      } catch (error) {
        console.error('Image upload failed:', error)
        // Revert the change on upload failure
        const revertedImages = [...imageSlots]
        revertedImages[index] = null
        onImagesChange(revertedImages.filter(img => img !== null))
      }
    }
  }

  const handleImageRemove = (index) => {
    const newImages = [...imageSlots]
    newImages[index] = null
    
    // Remove null values and update
    const filteredImages = newImages.filter(img => img !== null)
    onImagesChange(filteredImages)
  }

  const handleImagePreview = (image) => {
    setPreviewImage(image)
    setIsPreviewOpen(true)
  }

  const handleBulkUpload = useCallback((acceptedFiles) => {
    const filesToAdd = acceptedFiles.slice(0, maxImages - images.length)
    const newImages = [...images, ...filesToAdd]
    onImagesChange(newImages)

    // Upload each file if upload handler is provided
    if (onImageUpload) {
      filesToAdd.forEach((file, index) => {
        onImageUpload(file, images.length + index).catch(error => {
          console.error('Bulk upload failed for file:', file.name, error)
        })
      })
    }
  }, [images, maxImages, onImagesChange, onImageUpload])

  const { getRootProps: getBulkRootProps, getInputProps: getBulkInputProps, isDragActive: isBulkDragActive } = useDropzone({
    onDrop: handleBulkUpload,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    multiple: true,
    noClick: true // Prevent clicking on the bulk area from opening file dialog
  })

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium text-gray-800">Product Images</h4>
          <p className="text-sm text-gray-600 mt-1">
            Upload up to {maxImages} images. First image will be the primary product image.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {images.length}/{maxImages} images
        </div>
      </div>

      {/* Bulk Upload Area */}
      <div
        {...getBulkRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 transition-all duration-200
          ${isBulkDragActive 
            ? 'border-green-400 bg-green-50' 
            : 'border-gray-200 bg-gray-25'
          }
        `}
      >
        <input {...getBulkInputProps()} />
        
        {isBulkDragActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-green-50 border-2 border-green-400 border-dashed rounded-xl flex items-center justify-center z-10"
          >
            <div className="text-center">
              <ArrowUpTrayIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-medium text-green-600">Drop images here to upload</p>
              <p className="text-sm text-green-500">Multiple images supported</p>
            </div>
          </motion.div>
        )}

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: maxImages }, (_, index) => (
            <ImageSlot
              key={index}
              index={index}
              image={imageSlots[index]}
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              onImagePreview={handleImagePreview}
              isUploading={isUploading}
            />
          ))}
        </div>

        {/* Upload Instructions */}
        {images.length === 0 && !isBulkDragActive && (
          <div className="text-center py-8">
            <PhotoIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h5 className="text-lg font-medium text-gray-600 mb-2">No images uploaded</h5>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop images here, or click on individual slots to upload
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
              <span>Supported formats: JPEG, PNG, WebP, GIF</span>
              <span>•</span>
              <span>Max file size: 10MB</span>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        <ImagePreviewModal
          image={previewImage}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false)
            setPreviewImage(null)
          }}
        />
      </AnimatePresence>
    </div>
  )
}

export default ImageUploadSection