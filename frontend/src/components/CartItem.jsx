import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, Heart } from 'lucide-react'

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      onQuantityChange(newQuantity)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <Link to={`/products/${item.id}`} className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 hover:shadow-md transition-shadow">
            <img
              src={item.image || '/api/placeholder/80/80'}
              alt={item.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <Link 
            to={`/products/${item.id}`}
            className="block hover:text-green-600 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          </Link>
          
          <p className="text-sm text-gray-600 mt-1">
            {formatPrice(item.price)} each
          </p>
          
          {item.variant && (
            <p className="text-xs text-gray-500 mt-1">
              Size: {item.variant}
            </p>
          )}
          
          {item.category && (
            <p className="text-xs text-gray-500">
              Category: {item.category}
            </p>
          )}
          
          {/* Stock Status */}
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600">In Stock</span>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          
          <div className="w-12 text-center">
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-full text-center border border-gray-200 rounded px-2 py-1 text-sm"
              min="1"
              max="99"
            />
          </div>
          
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Price & Actions */}
        <div className="text-right flex-shrink-0">
          <p className="font-semibold text-gray-900 text-lg">
            {formatPrice(item.price * item.quantity)}
          </p>
          
          <div className="flex items-center gap-2 mt-2">
            {/* Wishlist Button */}
            <button
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Add to Wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
            
            {/* Remove Button */}
            <button
              onClick={onRemove}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Remove from Cart"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItem