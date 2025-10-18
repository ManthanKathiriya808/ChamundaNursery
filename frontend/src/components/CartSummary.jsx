import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Truck, Shield, Clock } from 'lucide-react'

const CartSummary = ({ items, total, onCheckout, isAuthenticated }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = total
  const shipping = subtotal >= 999 ? 0 : 99
  const tax = Math.round(subtotal * 0.18) // 18% GST
  const finalTotal = subtotal + shipping + tax

  const savings = subtotal >= 999 ? 99 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-5 h-5 text-green-600" />
        <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
      </div>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({itemCount} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <div className="text-right">
            {shipping === 0 ? (
              <span className="font-medium text-green-600">Free</span>
            ) : (
              <span className="font-medium">{formatPrice(shipping)}</span>
            )}
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (GST 18%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        {savings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Savings</span>
            <span className="font-medium text-green-600">-{formatPrice(savings)}</span>
          </div>
        )}

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">{formatPrice(finalTotal)}</span>
          </div>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {subtotal < 999 && (
        <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Add {formatPrice(999 - subtotal)} more for free shipping!
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <ShoppingBag className="w-5 h-5" />
        {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
      </button>

      {/* Payment Methods */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 mb-2">We accept</p>
        <div className="flex justify-center gap-2">
          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
            VISA
          </div>
          <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
            MC
          </div>
          <div className="w-8 h-5 bg-purple-600 rounded text-white text-xs flex items-center justify-center font-bold">
            UPI
          </div>
          <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
            GPay
          </div>
        </div>
      </div>

      {/* Security Features */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Secure SSL encrypted checkout</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>30-day return policy</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Truck className="w-4 h-4 text-purple-600" />
            <span>Fast & reliable delivery</span>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mt-4">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer text-sm text-green-600 hover:text-green-700">
            <span>Have a promo code?</span>
            <span className="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Enter code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition-colors">
              Apply
            </button>
          </div>
        </details>
      </div>
    </motion.div>
  )
}

export default CartSummary