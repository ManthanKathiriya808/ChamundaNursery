import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  ArrowRight
} from 'lucide-react';

const RelatedProducts = ({ currentProductId, category, limit = 4 }) => {
  // Mock related products data - in a real app, this would come from an API
  const relatedProducts = [
    {
      id: 1,
      name: 'Monstera Deliciosa',
      price: 45.99,
      originalPrice: 55.99,
      image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=400',
      rating: 4.8,
      reviewCount: 124,
      category: 'Indoor Plants',
      isOnSale: true,
      difficulty: 'Easy',
      lightRequirement: 'Bright Indirect'
    },
    {
      id: 2,
      name: 'Snake Plant',
      price: 32.99,
      image: 'https://images.unsplash.com/photo-1593691509543-c55fb32d8de5?w=400',
      rating: 4.9,
      reviewCount: 89,
      category: 'Indoor Plants',
      isOnSale: false,
      difficulty: 'Very Easy',
      lightRequirement: 'Low Light'
    },
    {
      id: 3,
      name: 'Fiddle Leaf Fig',
      price: 68.99,
      image: 'https://images.unsplash.com/photo-1586093248292-4e6636b4e3b8?w=400',
      rating: 4.6,
      reviewCount: 156,
      category: 'Indoor Plants',
      isOnSale: false,
      difficulty: 'Moderate',
      lightRequirement: 'Bright Indirect'
    },
    {
      id: 4,
      name: 'Peace Lily',
      price: 28.99,
      originalPrice: 34.99,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      rating: 4.7,
      reviewCount: 92,
      category: 'Indoor Plants',
      isOnSale: true,
      difficulty: 'Easy',
      lightRequirement: 'Medium Light'
    },
    {
      id: 5,
      name: 'Rubber Plant',
      price: 42.99,
      image: 'https://images.unsplash.com/photo-1509423350716-97f2360af2e4?w=400',
      rating: 4.5,
      reviewCount: 78,
      category: 'Indoor Plants',
      isOnSale: false,
      difficulty: 'Easy',
      lightRequirement: 'Bright Indirect'
    },
    {
      id: 6,
      name: 'ZZ Plant',
      price: 36.99,
      image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=400',
      rating: 4.8,
      reviewCount: 103,
      category: 'Indoor Plants',
      isOnSale: false,
      difficulty: 'Very Easy',
      lightRequirement: 'Low Light'
    }
  ].filter(product => product.id !== currentProductId).slice(0, limit);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'very easy':
        return 'bg-green-100 text-green-800';
      case 'easy':
        return 'bg-blue-100 text-blue-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">You Might Also Like</h2>
            <p className="text-gray-600 mt-1">Similar plants that other customers loved</p>
          </div>
          <Link
            to="/catalog"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Sale Badge */}
                {product.isOnSale && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Sale
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <Link
                    to={`/products/${product.id}`}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </Link>
                </div>

                {/* Quick Add to Cart */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Quick Add
                  </button>
                </div>
              </div>

              <div className="p-4">
                {/* Category & Difficulty */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {product.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(product.difficulty)}`}>
                    {product.difficulty}
                  </span>
                </div>

                {/* Product Name */}
                <Link
                  to={`/products/${product.id}`}
                  className="block font-semibold text-gray-900 hover:text-green-600 transition-colors mb-2"
                >
                  {product.name}
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>

                {/* Light Requirement */}
                <p className="text-sm text-gray-600 mb-3">
                  Light: {product.lightRequirement}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.isOnSale && product.originalPrice && (
                    <span className="text-sm text-red-600 font-medium">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Explore More Plants
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;