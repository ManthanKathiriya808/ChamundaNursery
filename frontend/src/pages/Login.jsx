// Login page with enhanced form using react-hook-form
// Features:
// - React Hook Form for better validation and performance
// - Enhanced animations and field interactions with Lottie
// - Improved accessibility with proper ARIA attributes
// - Real-time validation feedback
// - Interactive Lottie animations for better UX
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, LogIn, CheckCircle, User, Leaf, ArrowRight } from 'lucide-react'
import useUser from '../hooks/useUser.js'
import { useToast } from '../components/ToastProvider.jsx'
import FormField from '../components/forms/FormField'
import SubmitFormButton from '../components/forms/SubmitFormButton'

export default function Login() {
  const { login } = useUser()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty }
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const watchedFields = watch()

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      await login({ email: data.email, password: data.password })
      setLoginSuccess(true)
      toast.push('success', 'Signed in successfully')
      
      // Delay navigation to show success animation
      setTimeout(() => {
        const redirectTo = location.state?.from?.pathname || '/account/profile'
        navigate(redirectTo)
      }, 1500)
    } catch (err) {
      toast.push('error', 'Login failed. Please check your credentials and try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md relative">
      <Helmet>
        <title>Login • Chamunda Nursery</title>
        <meta name="description" content="Access your Chamunda Nursery account" />
      </Helmet>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl"></div>
      </div>

      {/* Success Overlay */}
      <AnimatePresence>
        {loginSuccess && (
          <motion.div
            className="absolute inset-0 bg-green-50/90 backdrop-blur-sm rounded-2xl z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <CheckCircle className="w-24 h-24 mx-auto mb-4 text-green-600" />
              <p className="text-green-700 font-medium">Welcome back!</p>
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
        <div className="flex items-center justify-center mb-4">
          <User className="w-16 h-16 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Sign in to your Chamunda Nursery account</p>
      </motion.div>

      {/* Form Container */}
      <motion.div 
        className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Form Accent Animation */}
        <div className="absolute top-4 right-4 opacity-30">
          <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
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
              className="pl-10"
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
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                }}
                placeholder="Enter your password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
          
          <SubmitFormButton
            isLoading={submitting}
            isValid={isValid}
            disabled={!isDirty || submitting}
            loadingText="Signing In..."
            icon={LogIn}
            className="w-full"
          >
            Sign In
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
            <span>Don't have an account?</span>
            <Link 
              to="/account/register" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors inline-flex items-center space-x-1"
            >
              <span>Sign up</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="pt-2 border-t border-gray-200">
            <Link 
              to="/account/forgot-password" 
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}