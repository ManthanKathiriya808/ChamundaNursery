// Register page with accessible form and validation
// Accessibility notes:
// - Labels are associated with inputs, errors have role="alert" for screen readers.
// - aria-invalid is set when a field has an error, aiding AT feedback.
// - Enhanced with icons and improved UX
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle, ArrowRight } from 'lucide-react'
import useUser from '../hooks/useUser.js'
import { useToast } from '../components/ToastProvider.jsx'
import { FormField, SubmitFormButton } from '../components/forms'

export default function Register() {
  const { register } = useUser()
  const toast = useToast()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid, isDirty },
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirm: ''
    }
  })

  const password = watch('password')
  const watchedFields = watch()

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await register({ 
        name: data.name, 
        email: data.email, 
        password: data.password 
      })
      setRegistrationSuccess(true)
      toast.push('success', 'Account created successfully! Welcome to Chamunda Nursery!')
      
      // Delay navigation to show success animation
      setTimeout(() => {
        navigate('/account/profile')
      }, 2000)
    } catch (err) {
      console.error('Registration error:', err)
      let errorMessage = 'Registration failed. Please try again.'
      if (err.message) {
        errorMessage = err.message
      }
      toast.push('error', errorMessage)
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md relative">
      <Helmet>
        <title>Register • Chamunda Nursery</title>
        <meta name="description" content="Create your Chamunda Nursery account" />
      </Helmet>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl"></div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {registrationSuccess && (
          <motion.div
            className="absolute inset-0 bg-green-50/90 backdrop-blur-sm rounded-2xl z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <CheckCircle className="w-32 h-32 mx-auto mb-4 text-green-600" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">Welcome to Chamunda Nursery!</h3>
              <p className="text-green-600">Your account has been created successfully</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 relative overflow-hidden"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <User className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Join Chamunda Nursery and start your gardening journey</p>
      </motion.div>

      {/* Form Card */}
      <motion.div 
        className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Form Accent */}
        <div className="absolute top-4 right-4 opacity-30">
          <UserPlus className="w-8 h-8 text-gray-400" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* Name Field */}
          <div className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Full Name</label>
            </div>
            <FormField
              name="name"
              type="text"
              control={control}
              rules={{
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                pattern: {
                  value: /^[a-zA-Z\s]+$/,
                  message: 'Name can only contain letters and spaces'
                }
              }}
              placeholder="Enter your full name"
              hint="Your display name on the platform"
            />
            {watchedFields.name && !errors.name && (
              <div className="absolute right-3 top-10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>
          
          {/* Email Field */}
          <div className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Email Address</label>
            </div>
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
              placeholder="you@example.com"
              hint="We'll never share your email"
            />
            {watchedFields.email && !errors.email && (
              <div className="absolute right-3 top-10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>
          
          {/* Password Field */}
          <div className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Password</label>
            </div>
            <div className="relative">
              <FormField
                name="password"
                type={showPassword ? "text" : "password"}
                control={control}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and number'
                  }
                }}
                placeholder="Create a strong password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {watchedFields.password && !errors.password && (
              <div className="absolute right-12 top-10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>
          
          {/* Confirm Password Field */}
          <div className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="w-4 h-4 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            </div>
            <div className="relative">
              <FormField
                name="confirm"
                type={showConfirmPassword ? "text" : "password"}
                control={control}
                rules={{
                  required: 'Please confirm your password',
                  validate: value => value === password || 'Passwords do not match'
                }}
                placeholder="Confirm your password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {watchedFields.confirm && !errors.confirm && watchedFields.confirm === password && (
              <div className="absolute right-12 top-10">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            )}
          </div>
          
          <SubmitFormButton
            isLoading={submitting}
            isValid={isValid}
            disabled={!isDirty || submitting}
            loadingText="Creating Account..."
            icon={UserPlus}
            className="w-full"
          >
            Create Account
          </SubmitFormButton>
        </form>
        
        {/* Footer Links */}
        <motion.div 
          className="mt-6 text-center space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <span>Already have an account?</span>
            <Link 
              to="/account/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center space-x-1"
            >
              <span>Sign in</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}