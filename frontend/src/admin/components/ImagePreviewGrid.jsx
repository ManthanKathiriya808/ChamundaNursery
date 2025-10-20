import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/**
 * Individual sortable image preview item
 * Handles drag-and-drop, replace, and delete functionality
 */
const SortableImageItem = ({ 
  preview, 
  index, 
  onRemove, 
  onReplace, 
  isUploading 
}) => {
  const [showActions, setShowActions] = useState(false)
  const [isReplacing, setIsReplacing] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: preview.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  /**
   * Handle image replacement
   */
  const handleReplace = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsReplacing(true)
      onReplace(index, file)
        .finally(() => setIsReplacing(false))
    }
  }

  /**
   * Handle image removal
   */
  const handleRemove = () => {
    onRemove(index)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-200 ${
        isDragging 
          ? 'border-green-400 shadow-lg' 
          : 'border-gray-200 hover:border-green-300'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Image */}
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={preview.url}
          alt={`Preview ${index + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Loading overlay */}
        {(isUploading || isReplacing) && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        {/* Primary image indicator */}
        {index === 0 && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
            Primary
          </div>
        )}

        {/* Drag handle */}
        <div
          {...listeners}
          className={`absolute top-2 right-2 w-6 h-6 bg-white bg-opacity-90 rounded cursor-move flex items-center justify-center transition-opacity ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zM7 8a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zM7 14a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zM13 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 2zM13 8a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zM13 14a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z"></path>
          </svg>
        </div>
      </div>

      {/* Action buttons */}
      <AnimatePresence>
        {showActions && !isUploading && !isReplacing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3"
          >
            <div className="flex justify-center space-x-2">
              {/* Replace button */}
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
                Replace
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReplace}
                  className="hidden"
                />
              </label>

              {/* Delete button */}
              <button
                onClick={handleRemove}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File info */}
      <div className="p-2 bg-white">
        <p className="text-xs text-gray-600 truncate" title={preview.file?.name}>
          {preview.file?.name || `Image ${index + 1}`}
        </p>
        <p className="text-xs text-gray-500">
          {preview.file?.size ? `${(preview.file.size / 1024 / 1024).toFixed(1)} MB` : ''}
        </p>
      </div>
    </motion.div>
  )
}

/**
 * Interactive Image Preview Grid Component
 * Features:
 * - Drag-and-drop reordering using @dnd-kit
 * - Individual image replace and delete actions
 * - Primary image indicator (first image)
 * - Loading states for upload operations
 * - Responsive grid layout
 * - Smooth animations with Framer Motion
 */
export const ImagePreviewGrid = ({ 
  previews = [], 
  onRemove, 
  onReplace, 
  onReorder, 
  isUploading = false 
}) => {
  // Configure drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  /**
   * Handle drag end event for reordering images
   */
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = previews.findIndex(preview => preview.id === active.id)
      const newIndex = previews.findIndex(preview => preview.id === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(previews, oldIndex, newIndex)
        onReorder(newOrder)
      }
    }
  }

  if (!previews.length) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Grid header */}
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-gray-700">
          Image Previews ({previews.length})
        </h5>
        <p className="text-xs text-gray-500">
          Drag to reorder • First image will be the primary image
        </p>
      </div>

      {/* Drag-and-drop context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={previews.map(p => p.id)}
          strategy={rectSortingStrategy}
        >
          {/* Image grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <AnimatePresence>
              {previews.map((preview, index) => (
                <SortableImageItem
                  key={preview.id}
                  preview={preview}
                  index={index}
                  onRemove={onRemove}
                  onReplace={onReplace}
                  isUploading={isUploading}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {/* Upload progress indicator */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-3"
        >
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">Uploading images...</p>
              <p className="text-xs text-blue-600">Please wait while we process your images</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <h6 className="text-xs font-medium text-gray-700 mb-2">Tips:</h6>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• The first image will be used as the primary product image</li>
          <li>• Drag images to reorder them</li>
          <li>• Click "Replace" to change an image without losing its position</li>
          <li>• Optimal image size: 800x800px or larger for best quality</li>
        </ul>
      </div>
    </div>
  )
}