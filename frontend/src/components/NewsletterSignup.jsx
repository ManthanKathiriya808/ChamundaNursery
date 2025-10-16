import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Mail } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation.js'
import FormField from './forms/FormField'
import SubmitFormButton from './forms/SubmitFormButton'

export default function NewsletterSignup() {
  // Animation hook for newsletter signup
  const newsletterAnimation = useScrollAnimation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIsSubscribed(true)
      reset()
      
      // Reset subscription state after 5 seconds
      setTimeout(() => setIsSubscribed(false), 5000)
    } catch (error) {
      console.error('Newsletter subscription failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <section aria-labelledby="newsletter-heading" className="py-6 md:py-10">
      <div className="page-container">
        <motion.div
          ref={newsletterAnimation.ref}
          variants={newsletterAnimation.scaleUp}
          initial="hidden"
          animate={newsletterAnimation.inView ? "visible" : "hidden"}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 md:p-8 bg-gradient-to-br from-green-50/50 via-white to-blue-50/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
            <div>
              <h2 id="newsletter-heading" className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Get weekly plant tips
              </h2>
              <p className="text-base md:text-lg text-gray-600">
                Join our newsletter for care guides, offers, and inspiration.
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
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
                  placeholder="Your email address"
                  className="mb-0"
                />
              </div>
              
              <SubmitFormButton
                isLoading={isSubmitting}
                isValid={isValid}
                loadingText="Subscribing..."
                size="md"
                className="sm:w-auto w-full"
                icon={Mail}
              >
                Subscribe
              </SubmitFormButton>
            </form>
            
            {isSubscribed && (
              <motion.div 
                className="md:col-span-2 mt-4 bg-green-50 border border-green-200 rounded-lg p-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-green-700 font-medium flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Thanks for subscribing! Check your email for confirmation.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}