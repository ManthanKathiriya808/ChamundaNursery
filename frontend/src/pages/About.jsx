import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { 
  Leaf, 
  Users, 
  Award, 
  Heart, 
  Truck, 
  Shield,
  Star,
  CheckCircle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

export default function About() {
  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '5,000+', label: 'Plants Delivered' },
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Plant Varieties' }
  ]

  const values = [
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We are committed to eco-friendly practices and sustainable gardening solutions.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Our love for plants drives everything we do, from selection to customer service.'
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'We maintain the highest standards in plant health and customer satisfaction.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a community of plant lovers and gardening enthusiasts.'
    }
  ]

  const team = [
    {
      name: 'Rajesh Patel',
      role: 'Founder & Head Horticulturist',
      image: '/api/placeholder/300/300',
      description: 'With over 20 years of experience in horticulture, Rajesh founded Chamunda Nursery with a vision to bring premium plants to every home.'
    },
    {
      name: 'Priya Sharma',
      role: 'Plant Care Specialist',
      image: '/api/placeholder/300/300',
      description: 'Priya specializes in plant care and helps customers choose the right plants for their specific needs and environments.'
    },
    {
      name: 'Amit Kumar',
      role: 'Operations Manager',
      image: '/api/placeholder/300/300',
      description: 'Amit ensures smooth operations and timely delivery of healthy plants to our customers across the region.'
    }
  ]

  return (
    <div>
      <Helmet>
        <title>About Us • Chamunda Nursery</title>
        <meta name="description" content="Learn about Chamunda Nursery - your trusted partner for premium plants, expert care, and sustainable gardening solutions." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] bg-cover bg-center opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
            >
              <Leaf className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-green-600">Chamunda Nursery</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your trusted partner for premium plants, expert care, and sustainable gardening solutions since 2008.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2008 by passionate horticulturist Rajesh Patel, Chamunda Nursery began as a small family business with a simple mission: to bring the joy and beauty of plants into every home.
                </p>
                <p>
                  What started as a local nursery has grown into a trusted name in the gardening community, serving thousands of customers across the region. We've maintained our commitment to quality, sustainability, and exceptional customer service throughout our journey.
                </p>
                <p>
                  Today, we continue to innovate and expand our offerings while staying true to our core values of providing healthy plants, expert guidance, and fostering a love for gardening in our community.
                </p>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Certified Organic</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Expert Care</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Sustainable Practices</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/api/placeholder/600/500"
                alt="Chamunda Nursery greenhouse"
                className="rounded-xl shadow-lg w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Award Winning</div>
                    <div className="text-sm text-gray-600">Best Nursery 2023</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <value.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate experts behind Chamunda Nursery
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Visit Our Nursery</h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Come see our plants in person and get expert advice from our team
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center text-white"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-green-100">
                123 Garden Street<br />
                Green Valley, GV 12345
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center text-white"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone</h3>
              <p className="text-green-100">
                +91 98765 43210<br />
                Mon-Sat: 9AM-6PM
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center text-white"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email</h3>
              <p className="text-green-100">
                info@chamundanursery.com<br />
                support@chamundanursery.com
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}