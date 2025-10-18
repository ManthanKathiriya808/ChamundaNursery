import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import useCartStore from '../stores/cartStore'
import useAuthStore from '../stores/authStore'
import useUIStore from '../stores/uiStore'
import CartItem from '../components/CartItem'
import CartSummary from '../components/CartSummary'
import EmptyCart from '../components/EmptyCart'
import LoadingSpinner from '../components/LoadingSpinner'

const Cart = () => {
  const navigate = useNavigate()
  
  // Zustand stores
  const { 
    items, 
    total, 
    itemCount, 
    updateQuantity, 
    removeItem, 
    clearCart,
    isLoading 
  } = useCartStore()
  
  const { isAuthenticated } = useAuthStore()
  const { showSuccess, showConfirm } = useUIStore()
  
  // Handlers
  const handleQuantityChange = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(id)
    } else {
      updateQuantity(id, quantity)
    }
  }
  
  const handleRemoveItem = (id) => {
    const item = items.find(item => item.id === id)
    if (item) {
      showConfirm(
        `Remove ${item.name} from cart?`,
        'This action cannot be undone.',
        () => {
          removeItem(id)
          showSuccess('Item removed from cart')
        }
      )
    }
  }
  
  const handleClearCart = () => {
    showConfirm(
      'Clear entire cart?',
      'This will remove all items from your cart.',
      () => {
        clearCart()
        showSuccess('Cart cleared')
      }
    )
  }
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      showConfirm(
        'Sign in required',
        'Please sign in to continue with checkout.',
        () => navigate('/account/login?redirect=/checkout')
      )
      return
    }
    
    navigate('/checkout')
  }
  
  const handleContinueShopping = () => {
    navigate('/catalog')
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  if (items.length === 0) {
    return <EmptyCart onContinueShopping={handleContinueShopping} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
      <Helmet>
        <title>Cart • Chamunda Nursery</title>
        <meta name="description" content="Review items in your cart" />
      </Helmet>

      <div className="relative z-10 page-container py-8">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <ShoppingCart className="w-8 h-8 text-primary" />
              Your Cart
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6">
              <AnimatePresence mode="wait">
                {items.length === 0 ? (
                  <motion.div
                    key="empty-cart"
                    className="flex flex-col items-center justify-center py-16 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Empty Cart Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 200, 
                        damping: 20,
                        delay: 0.2 
                      }}
                      className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6"
                    >
                      <ShoppingCart className="w-16 h-16 text-gray-400" />
                    </motion.div>

                    <motion.div
                      className="mt-6 space-y-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <h3 className="text-2xl font-semibold text-gray-900">
                        Your cart is empty
                      </h3>
                      <p className="text-gray-600 max-w-md">
                        Looks like you haven't added any plants to your cart yet. 
                        Discover our beautiful collection and bring nature home!
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Link
                          to="/catalog"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          <Leaf className="w-5 h-5" />
                          Browse Plants
                        </Link>
                        <Link
                          to="/catalog"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-300"
                        >
                          <ShoppingBag className="w-5 h-5" />
                          Shop by Category
                        </Link>
                      </div>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="cart-items"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Cart Items ({items.length})
                      </h2>
                      <motion.div
                        className="text-sm text-gray-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {subtotal > 499 ? (
                          <span className="text-green-600 font-medium">
                            🎉 Free shipping unlocked!
                          </span>
                        ) : (
                          <span>
                            Add ₹{499 - subtotal} more for free shipping
                          </span>
                        )}
                      </motion.div>
                    </div>

                    <ul className="space-y-4">
                      <AnimatePresence>
                        {items.map((item, index) => (
                          <motion.li
                            key={item.id}
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100, scale: 0.9 }}
                            transition={{ 
                              duration: 0.3, 
                              delay: index * 0.1,
                              exit: { duration: 0.2 }
                            }}
                            layout
                          >
                            <div className="flex items-center gap-4">
                              {/* Product Image */}
                              <div className="relative">
                                <img 
                                  src={item.image || '/logo.png'} 
                                  alt={item.name}
                                  className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                                />
                                <motion.div
                                  className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  {item.qty}
                                </motion.div>
                              </div>

                              {/* Product Details */}
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  ₹{item.price} each
                                </p>
                                
                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3 mt-3">
                                  <div className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
                                    <motion.button
                                      className="p-2 hover:bg-gray-100 transition-colors"
                                      onClick={() => updateQty(item.id, item.qty - 1)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-4 h-4" />
                                    </motion.button>
                                    <span className="px-4 py-2 min-w-[50px] text-center font-medium">
                                      {item.qty}
                                    </span>
                                    <motion.button
                                      className="p-2 hover:bg-gray-100 transition-colors"
                                      onClick={() => updateQty(item.id, item.qty + 1)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                  
                                  <motion.button
                                    className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    onClick={() => remove(item.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm">Remove</span>
                                  </motion.button>
                                </div>
                              </div>

                              {/* Item Total */}
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900">
                                  ₹{item.price * item.qty}
                                </div>
                                {item.qty > 1 && (
                                  <div className="text-sm text-gray-500">
                                    ₹{item.price} × {item.qty}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Order Summary */}
          {items.length > 0 && (
            <motion.aside
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>
                  
                  <hr className="border-gray-200" />
                  
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                  
                  {subtotal < 499 && (
                    <motion.div
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-sm text-yellow-800">
                        Add ₹{499 - subtotal} more to get free shipping!
                      </p>
                      <div className="w-full bg-yellow-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((subtotal / 499) * 100, 100)}%` }}
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  <motion.div
                    className="pt-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/checkout"
                      className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Proceed to Checkout
                    </Link>
                  </motion.div>
                  
                  <div className="text-center">
                    <Link
                      to="/catalog"
                      className="text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                    >
                      ← Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart