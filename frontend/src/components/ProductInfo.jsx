import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw, 
  Leaf, 
  Droplets, 
  Sun, 
  Thermometer,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ProductInfo = ({ product, onAddToCart, onAddToWishlist, isInWishlist }) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      quantity
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getCareIcon = (careType) => {
    switch (careType) {
      case 'water': return Droplets;
      case 'light': return Sun;
      case 'temperature': return Thermometer;
      case 'humidity': return Leaf;
      default: return Info;
    }
  };

  const getCareColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Title and Rating */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {product.name}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddToWishlist(product)}
              className={`p-2 rounded-full transition-colors ${
                isInWishlist
                  ? 'text-red-500 bg-red-50'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 0)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">
              ({product.reviewCount || 0} reviews)
            </span>
          </div>
          <span className="text-sm text-gray-500">
            SKU: {product.sku || 'N/A'}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-3xl font-bold text-green-600">
            ${product.price}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xl text-gray-500 line-through">
              ${product.originalPrice}
            </span>
          )}
          {product.discount && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full">
              {product.discount}% OFF
            </span>
          )}
        </div>
      </motion.div>

      {/* Stock Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center gap-2"
      >
        {product.inStock ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-medium">In Stock</span>
            {product.stockCount && product.stockCount < 10 && (
              <span className="text-orange-600 text-sm">
                (Only {product.stockCount} left)
              </span>
            )}
          </>
        ) : (
          <>
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-600 font-medium">Out of Stock</span>
          </>
        )}
      </motion.div>

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  selectedSize?.id === size.id
                    ? 'border-green-600 bg-green-50 text-green-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="font-medium">{size.name}</div>
                  {size.price !== product.price && (
                    <div className="text-sm text-gray-500">+${size.price - product.price}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quantity and Add to Cart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-50 transition-colors"
                disabled={product.stockCount && quantity >= product.stockCount}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            product.inStock
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </motion.div>

      {/* Care Information */}
      {product.careInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-green-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Leaf className="w-5 h-5 text-green-600 mr-2" />
            Care Requirements
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(product.careInfo).map(([key, value]) => {
              const IconComponent = getCareIcon(key);
              return (
                <div key={key} className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium capitalize">{key}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCareColor(value)}`}>
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Product Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Truck className="w-6 h-6 text-green-600" />
          <div>
            <div className="font-medium">Free Shipping</div>
            <div className="text-sm text-gray-600">On orders over $50</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Shield className="w-6 h-6 text-green-600" />
          <div>
            <div className="font-medium">Plant Guarantee</div>
            <div className="text-sm text-gray-600">30-day health guarantee</div>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <RotateCcw className="w-6 h-6 text-green-600" />
          <div>
            <div className="font-medium">Easy Returns</div>
            <div className="text-sm text-gray-600">Hassle-free returns</div>
          </div>
        </div>
      </motion.div>

      {/* Product Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="border-t pt-6"
      >
        <div className="flex border-b border-gray-200 mb-6">
          {[
            { id: 'description', label: 'Description' },
            { id: 'care', label: 'Care Guide' },
            { id: 'shipping', label: 'Shipping' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="prose prose-gray max-w-none">
          {activeTab === 'description' && (
            <div>
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No description available.'}
              </p>
              {product.features && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'care' && (
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                {product.careInstructions || 'Care instructions will be provided with your plant.'}
              </p>
              {product.careInfo && (
                <div className="space-y-3">
                  {Object.entries(product.careInfo).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium capitalize">{key}:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCareColor(value)}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Shipping Information</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Free shipping on orders over $50</li>
                  <li>• Standard delivery: 3-5 business days</li>
                  <li>• Express delivery: 1-2 business days (additional cost)</li>
                  <li>• Plants are carefully packaged to ensure safe delivery</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Return Policy</h4>
                <p className="text-gray-700">
                  We offer a 30-day plant health guarantee. If your plant arrives damaged or 
                  doesn't thrive within the first 30 days, we'll replace it free of charge.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProductInfo;