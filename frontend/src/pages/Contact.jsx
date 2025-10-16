// Contact page with enhanced form using react-hook-form
// Features:
// - React Hook Form for better validation and performance
// - Enhanced animations and field interactions
// - Improved accessibility with proper ARIA attributes
// - Real-time validation feedback
// - Lottie animations for enhanced user experience
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageCircle,
  User,
  Building,
  Leaf,
  Star,
  CheckCircle
} from 'lucide-react'
import FormField from '../components/forms/FormField'
import TextareaFormField from '../components/forms/TextareaFormField'
import SubmitFormButton from '../components/forms/SubmitFormButton'
import { useToast } from '../components/ToastProvider.jsx'

export default function Contact() {
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  })

  const watchedFields = watch()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Contact form submitted:', data)
      
      // Show success state
      setMessageSent(true)
      
      // Hide success overlay after 3 seconds
      setTimeout(() => {
        setMessageSent(false)
        reset()
      }, 3000)
      
      toast.success('Message sent successfully!')
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      <Helmet>
        <title>Contact Us • Chamunda Nursery</title>
        <meta name="description" content="Contact Chamunda Nursery support" />
      </Helmet>

      {/* Success Overlay */}
      <AnimatePresence>
        {messageSent && (
          <motion.div
            className="fixed inset-0 bg-green-500/90 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center text-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-32 h-32 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Message Sent!</h2>
              <p className="text-xl opacity-90">We'll get back to you soon</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            {/* Header */}
            <motion.div 
              className="text-center lg:text-left mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="w-16 h-16 mr-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl font-bold text-gray-800">Get in Touch</h1>
              </div>
              <p className="text-lg text-gray-600">We're here to help with plant selection, care guidance, and orders.</p>
            </motion.div>

            {/* Form Container */}
            <motion.div 
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Form Accent */}
              <div className="absolute top-4 right-4 opacity-60">
                <Leaf className="w-8 h-8 text-primary" />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <FormField
                      name="name"
                      control={control}
                      rules={{
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      }}
                      label="Full Name"
                      placeholder="Your full name"
                      hint="Enter your first and last name"
                      icon={User}
                    />
                    {/* Validation Success */}
                    {watchedFields.name && !errors.name && (
                      <div className="absolute -right-2 top-8">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <FormField
                      name="email"
                      type="email"
                      control={control}
                      rules={{
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      }}
                      label="Email Address"
                      placeholder="you@example.com"
                      hint="We'll use this to respond to your inquiry"
                      icon={Mail}
                    />
                    {/* Validation Success */}
                    {watchedFields.email && !errors.email && (
                      <div className="absolute -right-2 top-8">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <FormField
                      name="phone"
                      type="tel"
                      control={control}
                      rules={{
                        pattern: {
                          value: /^\+?[0-9\- ]{7,}$/,
                          message: 'Please enter a valid phone number'
                        }
                      }}
                      label="Phone Number"
                      placeholder="Optional"
                      hint="Include country code if international"
                      icon={Phone}
                    />
                    {/* Validation Success */}
                    {watchedFields.phone && !errors.phone && watchedFields.phone.length > 0 && (
                      <div className="absolute -right-2 top-8">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <FormField
                      name="subject"
                      control={control}
                      rules={{
                        required: 'Subject is required',
                        minLength: {
                          value: 5,
                          message: 'Subject must be at least 5 characters'
                        }
                      }}
                      label="Subject"
                      placeholder="How can we help?"
                      hint="Brief description of your inquiry"
                      icon={MessageCircle}
                    />
                    {/* Validation Success */}
                    {watchedFields.subject && !errors.subject && (
                      <div className="absolute -right-2 top-8">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <TextareaFormField
                    name="message"
                    control={control}
                    rules={{
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters'
                      },
                      maxLength: {
                        value: 1000,
                        message: 'Message cannot exceed 1000 characters'
                      }
                    }}
                    label="Message"
                    rows={5}
                    placeholder="Tell us about your requirements or questions"
                    hint="Provide details about your plant needs, care questions, or order requirements"
                  />
                  {/* Validation Success */}
                  {watchedFields.message && !errors.message && (
                    <div className="absolute -right-2 top-8">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                </div>
                
                <div className="pt-2">
                  <SubmitFormButton
                    isLoading={isSubmitting}
                    isValid={isValid}
                    disabled={!isDirty}
                    loadingText="Sending Message..."
                    icon={Send}
                    className="w-full"
                  >
                    Send Message
                  </SubmitFormButton>
                </div>
                
                {sent && (
                  <motion.div 
                    className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <p role="status" className="text-green-700 font-medium">
                      Message sent! We will get back to you soon.
                    </p>
                  </motion.div>
                )}
              </form>
            </motion.div>
          </section>

          <aside className="lg:col-span-1">
            <motion.div 
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Sidebar Accent */}
              <div className="absolute top-4 right-4 opacity-40">
                <Leaf className="w-8 h-8 text-green-500" />
              </div>

              <div className="flex items-center mb-4">
                <Building className="w-6 h-6 text-green-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">About Chamunda Nursery</h2>
              </div>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                From a family dream to 40+ acres of greenery, Chamunda Nursery was founded over 35 years ago and today is led by the Baraiya family. Specializing in bonsai, fruit plants, and landscaping, the team actively showcases work at exhibitions across Gujarat and India.
              </p>
              <p className="text-xs text-gray-500 mb-6">
                Source: <a className="text-blue-600 hover:text-blue-500 transition-colors" href="http://chamundanursery.com/" target="_blank" rel="noreferrer">chamundanursery.com</a>
              </p>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center mb-3">
                  <MapPin className="w-5 h-5 text-green-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-800">Visit Us</h3>
                </div>
                
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm">
                      Bhavnagar Rajkot Highway, Navadam, Near Khodiyar Temple<br />
                      Bhavnagar, Gujarat, 364060, India
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm">+91-XXXXXXXXXX</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                    <span className="text-sm">Open daily 8:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  )
}