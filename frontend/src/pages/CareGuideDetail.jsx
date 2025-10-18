import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar, 
  Share2, 
  Bookmark, 
  CheckCircle,
  Lightbulb,
  AlertTriangle,
  Droplets,
  Sun,
  Scissors,
  Leaf
} from 'lucide-react';

const CareGuideDetail = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for detailed guide
  const mockGuideDetail = {
    id: 1,
    title: 'Complete Guide to Indoor Plant Care',
    category: 'indoor',
    readTime: '8 min read',
    difficulty: 'Beginner',
    image: '/images/indoor-plants.jpg',
    author: 'Plant Expert',
    publishedAt: '2024-01-15',
    tags: ['watering', 'lighting', 'fertilizing'],
    content: {
      introduction: 'Indoor plants bring life and beauty to your home while improving air quality. This comprehensive guide will teach you everything you need to know to keep your indoor plants healthy and thriving.',
      sections: [
        {
          id: 'lighting',
          title: 'Understanding Light Requirements',
          icon: Sun,
          content: [
            {
              type: 'paragraph',
              text: 'Light is one of the most crucial factors for plant health. Different plants have varying light requirements, and understanding these needs is essential for success.'
            },
            {
              type: 'list',
              items: [
                'Bright, direct light: South-facing windows (6+ hours of direct sunlight)',
                'Bright, indirect light: East or west-facing windows with filtered light',
                'Medium light: North-facing windows or areas away from windows',
                'Low light: Areas with minimal natural light, may need grow lights'
              ]
            },
            {
              type: 'tip',
              text: 'Rotate your plants weekly to ensure even growth and prevent them from leaning toward the light source.'
            }
          ]
        },
        {
          id: 'watering',
          title: 'Proper Watering Techniques',
          icon: Droplets,
          content: [
            {
              type: 'paragraph',
              text: 'Overwatering is the leading cause of houseplant death. Learning proper watering techniques will keep your plants healthy.'
            },
            {
              type: 'steps',
              items: [
                'Check soil moisture by inserting your finger 1-2 inches deep',
                'Water when the top inch of soil feels dry',
                'Water thoroughly until water drains from the bottom',
                'Empty drainage trays after 30 minutes',
                'Adjust frequency based on season and humidity'
              ]
            },
            {
              type: 'warning',
              text: 'Never let plants sit in standing water, as this can lead to root rot.'
            }
          ]
        },
        {
          id: 'fertilizing',
          title: 'Feeding Your Plants',
          icon: Leaf,
          content: [
            {
              type: 'paragraph',
              text: 'Regular fertilizing provides essential nutrients for healthy growth and vibrant foliage.'
            },
            {
              type: 'list',
              items: [
                'Use a balanced liquid fertilizer (10-10-10 or 20-20-20)',
                'Fertilize every 2-4 weeks during growing season (spring/summer)',
                'Reduce or stop fertilizing in fall/winter',
                'Dilute fertilizer to half strength to prevent burning',
                'Water before fertilizing to prevent root damage'
              ]
            }
          ]
        },
        {
          id: 'maintenance',
          title: 'Regular Maintenance',
          icon: Scissors,
          content: [
            {
              type: 'paragraph',
              text: 'Regular maintenance keeps your plants looking their best and prevents problems before they start.'
            },
            {
              type: 'checklist',
              items: [
                'Remove dead, yellowing, or damaged leaves',
                'Dust leaves weekly with a damp cloth',
                'Prune overgrown branches to maintain shape',
                'Check for pests during regular care',
                'Repot when roots outgrow the container'
              ]
            }
          ]
        }
      ],
      conclusion: 'With proper care and attention, your indoor plants will thrive and bring years of enjoyment. Remember that each plant is unique, so observe your plants regularly and adjust care as needed.'
    },
    relatedGuides: [
      { id: 2, title: 'Seasonal Garden Maintenance', readTime: '12 min' },
      { id: 3, title: 'Succulent Care Made Simple', readTime: '5 min' },
      { id: 4, title: 'Herb Garden Essentials', readTime: '10 min' }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setGuide(mockGuideDetail);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.content.introduction,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  const renderContent = (item) => {
    switch (item.type) {
      case 'paragraph':
        return <p className="text-gray-700 leading-relaxed mb-4">{item.text}</p>;
      
      case 'list':
        return (
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            {item.items.map((listItem, index) => (
              <li key={index}>{listItem}</li>
            ))}
          </ul>
        );
      
      case 'steps':
        return (
          <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
            {item.items.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        );
      
      case 'checklist':
        return (
          <div className="space-y-2 mb-4">
            {item.items.map((checkItem, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{checkItem}</span>
              </div>
            ))}
          </div>
        );
      
      case 'tip':
        return (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
            <div className="flex items-start">
              <Lightbulb className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-blue-800">{item.text}</p>
            </div>
          </div>
        );
      
      case 'warning':
        return (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-800">{item.text}</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Guide not found</h2>
          <Link to="/care" className="text-green-600 hover:text-green-700">
            ← Back to Care Guides
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/care"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Care Guides
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="mb-6">
            <img
              src={guide.image}
              alt={guide.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = '/images/placeholder-plant.jpg';
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {guide.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {guide.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              {guide.author}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(guide.publishedAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {guide.readTime}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isBookmarked
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg max-w-none"
        >
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {guide.content.introduction}
            </p>

            {guide.content.sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <section key={section.id} className="mb-12">
                  <h2 className="flex items-center text-2xl font-bold text-gray-900 mb-6">
                    <IconComponent className="w-6 h-6 text-green-600 mr-3" />
                    {section.title}
                  </h2>
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      {renderContent(item)}
                    </div>
                  ))}
                </section>
              );
            })}

            <div className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Conclusion</h2>
              <p className="text-gray-700 leading-relaxed">
                {guide.content.conclusion}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Related Guides */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {guide.relatedGuides.map((relatedGuide) => (
              <Link
                key={relatedGuide.id}
                to={`/care-guides/${relatedGuide.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {relatedGuide.title}
                </h3>
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {relatedGuide.readTime}
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      </article>
    </div>
  );
};

export default CareGuideDetail;