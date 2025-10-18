import React from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowRight, Leaf, Heart, Star } from 'lucide-react'

const EmptyCart = ({ onContinueShopping }) => {
  const features = [
    {
      icon: Leaf,
      title: "Fresh Plants",
      description: "Healthy, nursery-grown plants"
    },
    {
      icon: Heart,
      title: "Expert Care",
      description: "Professional gardening advice"
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: "100% satisfaction guarantee"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Empty Cart Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center"
          >
            <ShoppingCart className="w-16 h-16 text-green-600" />
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Looks like you haven't added any plants to your cart yet.
            </p>
            <p className="text-gray-500">
              Start exploring our beautiful collection of plants and gardening supplies!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <button
              onClick={onContinueShopping}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Leaf className="w-5 h-5" />
              Browse Plants
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => window.location.href = '/catalog'}
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors duration-200"
            >
              View Categories
            </button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <feature.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Popular Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Indoor Plants", emoji: "🌿", count: "50+" },
                { name: "Outdoor Plants", emoji: "🌳", count: "75+" },
                { name: "Succulents", emoji: "🌵", count: "30+" },
                { name: "Flowering", emoji: "🌸", count: "40+" }
              ].map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  onClick={onContinueShopping}
                  className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group"
                >
                  <div className="text-2xl mb-2">{category.emoji}</div>
                  <div className="font-medium text-gray-900 group-hover:text-green-700">
                    {category.name}
                  </div>
                  <div className="text-sm text-gray-500">{category.count} items</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Free shipping over ₹999
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              30-day return policy
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Expert plant care support
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default EmptyCart