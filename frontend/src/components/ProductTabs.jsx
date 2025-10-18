import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Heart, 
  Truck, 
  Shield, 
  Star,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  MessageCircle
} from 'lucide-react';

const ProductTabs = ({ product, reviews = [] }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
    { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
    { id: 'care', label: 'Care Guide', icon: Heart }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Plant</h3>
              <p className="text-gray-700 leading-relaxed">
                {product?.description || 'No description available for this product.'}
              </p>
            </div>

            {product?.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {product?.specifications && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );

      case 'reviews':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {reviews.length > 0 ? (
              <>
                {/* Review Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Customer Reviews</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {renderStars(product?.averageRating || 0)}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product?.averageRating?.toFixed(1) || '0.0'} out of 5
                      </span>
                    </div>
                  </div>
                  
                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter(r => r.rating === rating).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm text-gray-600 w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{review.userName}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                              </div>
                              <span className="text-sm text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{review.comment}</p>
                      
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {review.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Review image ${index + 1}`}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpfulCount || 0})
                        </button>
                        <button className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
                <p className="text-gray-600">Be the first to review this product!</p>
              </div>
            )}
          </motion.div>
        );

      case 'shipping':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Free shipping on orders over $50</li>
                  <li>• Standard delivery: 3-5 business days</li>
                  <li>• Express delivery: 1-2 business days</li>
                  <li>• Same-day delivery available in select areas</li>
                  <li>• Plants are carefully packaged for safe transport</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Return Policy</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• 30-day plant health guarantee</li>
                  <li>• Free returns on damaged or unhealthy plants</li>
                  <li>• Easy return process with prepaid labels</li>
                  <li>• Full refund or replacement available</li>
                  <li>• Expert plant care support included</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-2">Plant Care Promise</h4>
              <p className="text-green-800">
                We guarantee that your plants will arrive healthy and ready to thrive. 
                If you're not completely satisfied with your plant's condition within 30 days, 
                we'll replace it free of charge or provide a full refund.
              </p>
            </div>
          </motion.div>
        );

      case 'care':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Instructions</h3>
              <p className="text-gray-700 mb-6">
                {product?.careInstructions || 
                 'Follow these general care guidelines to keep your plant healthy and thriving.'}
              </p>
            </div>

            {product?.careRequirements && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.careRequirements).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
              <p className="text-blue-800 mb-3">
                Our plant care experts are here to help you succeed with your new plant.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Contact Plant Care Support
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductTabs;