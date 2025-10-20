import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Eye, Trash2, Download, ZoomIn } from 'lucide-react'

/**
 * ImagePreviewGrid Component
 * Displays a grid of uploaded images with preview, delete, and management capabilities
 * Used in admin forms for managing product, category, and blog images
 */
const ImagePreviewGrid = ({ 
  images = [], 
  onRemove, 
  onReorder,
  maxImages = 10,
  className = '',
  showUpload = true,
  onUpload,
  isUploading = false
}) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex && onReorder) {
      onReorder(draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const handleDownload = (image) => {
    const link = document.createElement('a')
    link.href = image.url
    link.download = image.name || 'image'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={image.id || index}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-green-300 transition-all cursor-pointer ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            {/* Image */}
            <img
              src={image.url || image.preview}
              alt={image.name || `Image ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleImageClick(image)
                  }}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4 text-gray-700" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDownload(image)
                  }}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-gray-700" />
                </button>

                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemove(index)
                    }}
                    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Image index indicator */}
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>

            {/* Primary image indicator */}
            {index === 0 && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Primary
              </div>
            )}
          </motion.div>
        ))}

        {/* Upload button */}
        {showUpload && images.length < maxImages && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-green-400 hover:bg-green-50 transition-all cursor-pointer group"
            onClick={onUpload}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <span className="text-sm text-gray-600">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-green-500 transition-colors mb-2" />
                <span className="text-sm text-gray-600 group-hover:text-green-600 transition-colors">
                  Add Image
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {images.length}/{maxImages}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Image count and limit info */}
      {images.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{images.length} image{images.length !== 1 ? 's' : ''} uploaded</span>
          <span>Drag to reorder • First image is primary</span>
        </div>
      )}

      {/* Full-size image modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url || selectedImage.preview}
                alt={selectedImage.name || 'Preview'}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image info */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                <p className="font-medium">{selectedImage.name || 'Untitled'}</p>
                {selectedImage.size && (
                  <p className="text-sm opacity-75">
                    {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImagePreviewGrid