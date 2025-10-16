// Modern footer with Lottie animations, interactive SVG icons, and responsive design
// Features:
// - Lottie animations for visual enhancement (replace URLs with local JSON files in production)
// - Interactive SVG icons with hover animations
// - Proper padding and sections for mobile and desktop
// - Newsletter signup with react-hook-form integration
// - Accessibility-compliant navigation and contact information
// - Responsive grid layout that adapts to all screen sizes
// - Sticky footer behavior on mobile devices

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import ImageLazy from './ImageLazy.jsx'
import LottieAnimation from './animations/LottieAnimation.jsx'

import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube,
  Linkedin,
  Grid3X3, 
  HelpCircle, 
  Phone, 
  Mail, 
  Shield,
  MapPin,
  Clock,
  Leaf,
  Heart,
  Star,
  Send,
  CheckCircle
} from 'lucide-react'

// Lottie animation configurations for footer elements
// TODO: Replace these LottieFiles URLs with local JSON files in production
const footerAnimations = {
  // Background decorative animations
  floatingLeaves: "https://lottie.host/4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s/data.json",
  gardenBorder: "https://lottie.host/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p/data.json",
  
  // Interactive elements
  newsletterSuccess: "https://lottie.host/7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v/data.json",
  socialHover: "https://lottie.host/3m4n5o6p-7q8r-9s0t-1u2v-3w4x5y6z7a8b/data.json",
  
  // Contact and location
  locationPin: "https://lottie.host/9s0t1u2v-3w4x-5y6z-7a8b-9c0d1e2f3g4h/data.json",
  phoneRing: "https://lottie.host/5y6z7a8b-9c0d-1e2f-3g4h-5i6j7k8l9m0n/data.json"
}

const animationConfigs = {
  background: {
    loop: true,
    autoplay: true,
    speed: 0.5,
    style: { width: '100%', height: '100%', opacity: 0.1 }
  },
  interactive: {
    loop: false,
    autoplay: false,
    speed: 1,
    style: { width: '24px', height: '24px' }
  },
  success: {
    loop: false,
    autoplay: true,
    speed: 1,
    style: { width: '32px', height: '32px' }
  }
}

export default function Footer() {
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false)
  const reduceMotion = useReducedMotion()
  
  // Newsletter form with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm()

  const onNewsletterSubmit = async (data) => {
    try {
      // TODO: Implement newsletter subscription API call
      console.log('Newsletter subscription:', data)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setNewsletterSubmitted(true)
      reset()
      setTimeout(() => setNewsletterSubmitted(false), 3000)
    } catch (error) {
      console.error('Newsletter subscription failed:', error)
    }
  }

  // Social media links with interactive animations
  const socialLinks = [
    { 
      href: "https://instagram.com/chamundanursery", 
      label: "Instagram", 
      icon: Instagram,
      color: "hover:text-pink-500"
    },
    { 
      href: "https://facebook.com/chamundanursery", 
      label: "Facebook", 
      icon: Facebook,
      color: "hover:text-blue-600"
    },
    { 
      href: "https://twitter.com/chamundanursery", 
      label: "Twitter", 
      icon: Twitter,
      color: "hover:text-sky-500"
    },
    { 
      href: "https://youtube.com/chamundanursery", 
      label: "YouTube", 
      icon: Youtube,
      color: "hover:text-red-500"
    },
    { 
      href: "https://linkedin.com/company/chamundanursery", 
      label: "LinkedIn", 
      icon: Linkedin,
      color: "hover:text-blue-700"
    }
  ]

  // Navigation sections
  const navigationSections = [
    {
      title: "Shop",
      ariaLabel: "Shop categories",
      links: [
        { to: "/catalog?category=indoor", label: "Indoor Plants", icon: Leaf },
        { to: "/catalog?category=outdoor", label: "Outdoor Plants", icon: Grid3X3 },
        { to: "/catalog?category=seeds", label: "Seeds & Bulbs", icon: Heart },
        { to: "/catalog?category=tools", label: "Garden Tools", icon: Star },
        { to: "/catalog?category=pots", label: "Pots & Planters", icon: Grid3X3 }
      ]
    },
    {
      title: "Support",
      ariaLabel: "Customer support",
      links: [
        { to: "/faq", label: "FAQ", icon: HelpCircle },
        { to: "/contact", label: "Contact Us", icon: Phone },
        { to: "/care", label: "Plant Care Guide", icon: Heart },
        { to: "/privacy", label: "Privacy Policy", icon: Shield },
        { to: "/terms", label: "Terms of Service", icon: Shield }
      ]
    },
    {
      title: "Company",
      ariaLabel: "About company",
      links: [
        { to: "/about", label: "About Us", icon: Heart },
        { to: "/blog", label: "Blog", icon: Leaf },
        { to: "/careers", label: "Careers", icon: Star },
        { to: "/sustainability", label: "Sustainability", icon: Leaf },
        { to: "/wholesale", label: "Wholesale", icon: Grid3X3 }
      ]
    }
  ]

  return (
    <footer className="relative mt-auto bg-gradient-to-br from-green-50 via-cream to-blue-50 border-t border-green-200/50">
      {/* Background Lottie Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <LottieAnimation
          animationData={footerAnimations.floatingLeaves}
          config={animationConfigs.background}
          fallback={<div className="w-full h-full opacity-5 bg-gradient-to-r from-green-100 to-blue-100" />}
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        {/* Top Section - Brand and Newsletter */}
        <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              
              {/* Brand Section */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <ImageLazy 
                      src="/logo.png" 
                      alt="Chamunda Nursery" 
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl shadow-lg" 
                    />
                    <div className="absolute -top-1 -right-1 w-6 h-6">
                      <LottieAnimation
                        animationData={footerAnimations.gardenBorder}
                        config={animationConfigs.interactive}
                        fallback={<Leaf className="w-6 h-6 text-green-500" />}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
                      Chamunda Nursery
                    </h2>
                    <p className="text-gray-600 text-base sm:text-lg mt-1">
                      Premium plants and gardening supplies for your green paradise.
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <motion.div 
                    className="flex items-center gap-3 text-gray-700"
                    whileHover={reduceMotion ? {} : { x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="w-5 h-5">
                      <LottieAnimation
                        animationData={footerAnimations.locationPin}
                        config={animationConfigs.interactive}
                        fallback={<MapPin className="w-5 h-5 text-green-600" />}
                      />
                    </div>
                    <span>123 Garden Street, Green Valley, GV 12345</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3 text-gray-700"
                    whileHover={reduceMotion ? {} : { x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="w-5 h-5">
                      <LottieAnimation
                        animationData={footerAnimations.phoneRing}
                        config={animationConfigs.interactive}
                        fallback={<Phone className="w-5 h-5 text-green-600" />}
                      />
                    </div>
                    <a href="tel:+919000000000" className="hover:text-green-600 transition-colors">
                      +91 90000 00000
                    </a>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3 text-gray-700"
                    whileHover={reduceMotion ? {} : { x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Mail className="w-5 h-5 text-green-600" />
                    <a href="mailto:support@chamundanursery.com" className="hover:text-green-600 transition-colors">
                      support@chamundanursery.com
                    </a>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center gap-3 text-gray-700"
                    whileHover={reduceMotion ? {} : { x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Clock className="w-5 h-5 text-green-600" />
                    <span>Mon-Sat: 8AM-7PM, Sun: 9AM-5PM</span>
                  </motion.div>
                </div>

                {/* Social Media Links */}
                <div className="flex items-center gap-3 pt-4">
                  <span className="text-gray-600 font-medium">Follow us:</span>
                  <div className="flex items-center gap-2">
                    {socialLinks.map((social) => {
                      const IconComponent = social.icon
                      return (
                        <motion.a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className={`p-2 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-600 transition-all duration-300 hover:shadow-lg ${social.color}`}
                          whileHover={reduceMotion ? {} : { 
                            scale: 1.1, 
                            y: -2,
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                          }}
                          whileTap={reduceMotion ? {} : { scale: 0.95 }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </motion.a>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Newsletter Section */}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg"
              >
                <div className="text-center mb-6">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Stay in the Garden Loop 🌱
                  </h3>
                  <p className="text-gray-600">
                    Get exclusive offers, plant care tips, and seasonal inspiration delivered to your inbox.
                  </p>
                </div>

                {!newsletterSubmitted ? (
                  <form onSubmit={handleSubmit(onNewsletterSubmit)} className="space-y-4">
                    <div>
                      <input
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Please enter a valid email address'
                          }
                        })}
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 placeholder-gray-500"
                        aria-label="Email address for newsletter"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      whileHover={reduceMotion ? {} : { scale: 1.02, y: -1 }}
                      whileTap={reduceMotion ? {} : { scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Subscribing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Subscribe to Newsletter</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                ) : (
                  <motion.div
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
                    animate={reduceMotion ? false : { opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto mb-4">
                      <LottieAnimation
                        animationData={footerAnimations.newsletterSuccess}
                        config={animationConfigs.success}
                        fallback={<CheckCircle className="w-16 h-16 text-green-500 mx-auto" />}
                      />
                    </div>
                    <h4 className="text-lg font-semibold text-green-600 mb-2">
                      Welcome to the Garden Family! 🎉
                    </h4>
                    <p className="text-gray-600">
                      Thank you for subscribing. You'll receive our next newsletter soon!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Navigation Links Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {navigationSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                  role="navigation"
                  aria-label={section.ariaLabel}
                >
                  <h3 className="font-display text-lg font-bold text-gray-900 mb-4">
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.links.map((link) => {
                      const IconComponent = link.icon
                      return (
                        <li key={link.to}>
                          <Link
                            to={link.to}
                            className="group flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:text-green-600 hover:bg-green-50/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            <IconComponent className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                              {link.label}
                            </span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>© {new Date().getFullYear()} Chamunda Nursery.</span>
                <span className="hidden sm:inline">All rights reserved.</span>
              </div>
              
              <div className="flex items-center gap-6 text-center sm:text-right">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Healthy plants</span>
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure payments</span>
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Fast delivery</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}