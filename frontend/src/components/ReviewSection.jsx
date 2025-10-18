import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Filter,
  ChevronDown,
  Camera,
  X,
  Send
} from 'lucide-react';

const ReviewSection = ({ productId, reviews = [], averageRating = 0 }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: []
  });

  // Mock reviews data if none provided
  const mockReviews = reviews.length > 0 ? reviews : [
    {
      id: 1,
      userName: 'Sarah Johnson',
      userAvatar: null,
      rating: 5,
      title: 'Absolutely love this plant!',
      comment: 'This plant arrived in perfect condition and has been thriving in my living room. The packaging was excellent and the plant looks exactly like the photos. Highly recommend!',
      createdAt: '2024-01-15T10:30:00Z',
      helpfulCount: 12,
      images: ['https://images.unsplash.com/photo-1545241047-6083a3684587?w=200'],
      verified: true
    },
    {
      id: 2,
      userName: 'Mike Chen',
      userAvatar: null,
      rating: 4,
      title: 'Great plant, minor shipping issue',
      comment: 'The plant itself is beautiful and healthy. There was a small delay in shipping, but customer service was very responsive and helpful. The plant is doing well after a week.',
      createdAt: '2024-01-10T14:20:00Z',
      helpfulCount: 8,
      images: [],
      verified: true
    },
    {
      id: 3,
      userName: 'Emma Wilson',
      userAvatar: null,
      rating: 5,
      title: 'Perfect for beginners!',
      comment: 'As someone new to plant care, this was exactly what I needed. The care instructions were clear and the plant is very forgiving. It\'s been growing beautifully for 3 months now.',
      createdAt: '2024-01-05T09:15:00Z',
      helpfulCount: 15,
      images: [],
      verified: true
    },
    {
      id: 4,
      userName: 'David Rodriguez',
      userAvatar: null,
      rating: 3,
      title: 'Okay, but smaller than expected',
      comment: 'The plant is healthy but smaller than I expected based on the photos. Quality is good, just wish it was a bit larger for the price point.',
      createdAt: '2024-01-02T16:45:00Z',
      helpfulCount: 5,
      images: [],
      verified: false
    }
  ];

  const displayReviews = mockReviews;
  const totalReviews = displayReviews.length;
  const calculatedAverageRating = averageRating || 
    (displayReviews.reduce((sum, review) => sum + review.rating, 0) / displayReviews.length);

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 cursor-pointer transition-colors ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : interactive 
              ? 'text-gray-300 hover:text-yellow-400' 
              : 'text-gray-300'
        }`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
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

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    displayReviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  const filteredAndSortedReviews = displayReviews
    .filter(review => filterRating === 'all' || review.rating === parseInt(filterRating))
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpfulCount - a.helpfulCount;
        default:
          return 0;
      }
    });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    console.log('Submitting review:', newReview);
    setShowReviewForm(false);
    setNewReview({ rating: 0, title: '', comment: '', images: [] });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
        <button
          onClick={() => setShowReviewForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Write a Review
        </button>
      </div>

      {/* Review Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {calculatedAverageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center mb-2">
              {renderStars(Math.round(calculatedAverageRating))}
            </div>
            <p className="text-gray-600">Based on {totalReviews} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
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
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredAndSortedReviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-b border-gray-200 pb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                {review.userAvatar ? (
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-green-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-gray-900">{review.userName}</h4>
                  {review.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Verified Purchase
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                {review.title && (
                  <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
                )}

                <p className="text-gray-700 mb-3">{review.comment}</p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Review image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm">
                  <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpfulCount})
                  </button>
                  <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAndSortedReviews.length === 0 && (
        <div className="text-center py-12">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Found</h3>
          <p className="text-gray-600">No reviews match your current filters.</p>
        </div>
      )}

      {/* Review Form Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center gap-1">
                    {renderStars(newReview.rating, true, (rating) => 
                      setNewReview(prev => ({ ...prev, rating }))
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title
                  </label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Summarize your experience"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Share your thoughts about this product..."
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newReview.rating || !newReview.comment.trim()}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Review
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewSection;