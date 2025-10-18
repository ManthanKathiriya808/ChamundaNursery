import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Clock, Leaf, Droplets, Sun, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareGuides = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [guides, setGuides] = useState([]);

  // Mock data for care guides
  const mockGuides = [
    {
      id: 1,
      title: 'Complete Guide to Indoor Plant Care',
      category: 'indoor',
      readTime: '8 min read',
      difficulty: 'Beginner',
      image: '/images/indoor-plants.jpg',
      excerpt: 'Learn the fundamentals of caring for indoor plants, from watering schedules to light requirements.',
      tags: ['watering', 'lighting', 'fertilizing'],
      author: 'Plant Expert',
      publishedAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Seasonal Garden Maintenance',
      category: 'outdoor',
      readTime: '12 min read',
      difficulty: 'Intermediate',
      image: '/images/garden-maintenance.jpg',
      excerpt: 'Comprehensive seasonal care guide for maintaining a healthy outdoor garden year-round.',
      tags: ['pruning', 'fertilizing', 'pest-control'],
      author: 'Garden Specialist',
      publishedAt: '2024-01-10'
    },
    {
      id: 3,
      title: 'Succulent Care Made Simple',
      category: 'succulents',
      readTime: '5 min read',
      difficulty: 'Beginner',
      image: '/images/succulents.jpg',
      excerpt: 'Everything you need to know about caring for succulents and cacti.',
      tags: ['watering', 'soil', 'propagation'],
      author: 'Succulent Expert',
      publishedAt: '2024-01-08'
    },
    {
      id: 4,
      title: 'Herb Garden Essentials',
      category: 'herbs',
      readTime: '10 min read',
      difficulty: 'Beginner',
      image: '/images/herbs.jpg',
      excerpt: 'Start your own herb garden with this comprehensive guide to growing culinary herbs.',
      tags: ['harvesting', 'planting', 'cooking'],
      author: 'Herb Specialist',
      publishedAt: '2024-01-05'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Guides', icon: BookOpen },
    { id: 'indoor', name: 'Indoor Plants', icon: Leaf },
    { id: 'outdoor', name: 'Outdoor Garden', icon: Sun },
    { id: 'succulents', name: 'Succulents', icon: Droplets },
    { id: 'herbs', name: 'Herbs', icon: Scissors }
  ];

  useEffect(() => {
    setGuides(mockGuides);
  }, []);

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Plant Care Guides
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Expert advice and comprehensive guides to help your plants thrive
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide, index) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={guide.image}
                  alt={guide.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/images/placeholder-plant.jpg';
                  }}
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                    {guide.difficulty}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {guide.readTime}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {guide.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {guide.excerpt}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {guide.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    By {guide.author}
                  </div>
                  <Link
                    to={`/care-guides/${guide.id}`}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Read Guide
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No guides found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareGuides;