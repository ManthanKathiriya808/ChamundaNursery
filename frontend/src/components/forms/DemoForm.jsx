/**
 * Demo Form Component - Showcases Enhanced React Hook Form Features
 * 
 * This component demonstrates:
 * - React Hook Form with Zod validation
 * - Animated field validation with Framer Motion
 * - Real-time validation feedback
 * - Error toasts with react-hot-toast
 * - Custom form field components
 * - Password strength indicator
 * - File upload with validation
 * - Multi-step form progression
 * - Form state persistence
 */

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { 
  User, Mail, Phone, MapPin, Calendar, Upload, 
  Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, 
  ArrowLeft, Save, Leaf, Star, Shield
} from 'lucide-react'

// Enhanced validation schema with complex rules
const demoFormSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces'),
  
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .refine((email) => !email.includes('+'), 'Email cannot contain + symbol'),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits'),
  
  // Address Information
  address: z
    .string()
    .min(1, 'Address is required')
    .min(10, 'Address must be at least 10 characters'),
  
  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City must be at least 2 characters'),
  
  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .regex(/^\d{6}$/, 'Postal code must be 6 digits'),
  
  // Preferences
  plantTypes: z
    .array(z.string())
    .min(1, 'Please select at least one plant type'),
  
  newsletter: z.boolean(),
  
  // Password with strength requirements
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  confirmPassword: z.string(),
  
  // File upload
  profileImage: z
    .any()
    .optional()
    .refine((files) => {
      if (!files || files.length === 0) return true
      return files[0]?.size <= 5000000 // 5MB
    }, 'File size must be less than 5MB')
    .refine((files) => {
      if (!files || files.length === 0) return true
      return ['image/jpeg', 'image/png', 'image/webp'].includes(files[0]?.type)
    }, 'Only JPEG, PNG, and WebP images are allowed'),
  
  // Bio with character count
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Plant type options
const plantTypeOptions = [
  { value: 'indoor', label: 'Indoor Plants' },
  { value: 'outdoor', label: 'Outdoor Plants' },
  { value: 'succulents', label: 'Succulents' },
  { value: 'herbs', label: 'Herbs' },
  { value: 'flowers', label: 'Flowering Plants' },
  { value: 'trees', label: 'Trees' },
]

// Password strength calculator
function calculatePasswordStrength(password) {
  let score = 0
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
  
  Object.values(checks).forEach(check => {
    if (check) score++
  })
  
  return { score, checks }
}

// Form field component with enhanced animations
const FormField = ({ name, control, rules, type = 'text', label, placeholder, icon: Icon, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const isPasswordField = type === 'password'
  const inputType = isPasswordField && showPassword ? 'text' : type

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error, isTouched, isValid } }) => {
        const hasValue = field.value && field.value.length > 0
        const hasError = error && isTouched
        const isValidField = isValid && isTouched && hasValue && !hasError

        return (
          <motion.div
            className="relative space-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <motion.input
                {...field}
                {...props}
                type={inputType}
                placeholder={hasValue || isFocused ? placeholder : ''}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`
                  w-full px-4 pt-6 pb-2 rounded-xl border-2 transition-all duration-300 ease-in-out
                  bg-white/60 backdrop-blur-sm
                  ${hasError 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                    : isValidField
                    ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                  }
                  focus:ring-4 focus:outline-none
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />
              
              {/* Floating Label */}
              <motion.label
                className={`
                  absolute left-4 transition-all duration-300 ease-in-out pointer-events-none
                  ${hasValue || isFocused
                    ? 'top-2 text-xs text-gray-600'
                    : 'top-4 text-base text-gray-400'
                  }
                `}
                animate={{
                  y: hasValue || isFocused ? -8 : 0,
                  scale: hasValue || isFocused ? 0.85 : 1,
                }}
              >
                {label}
              </motion.label>

              {/* Icon */}
              {Icon && (
                <div className="absolute right-4 top-4 text-gray-400">
                  <Icon size={20} />
                </div>
              )}

              {/* Password Toggle */}
              {isPasswordField && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-12 top-4 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              )}

              {/* Validation Icon */}
              <AnimatePresence>
                {isTouched && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute right-4 top-4"
                  >
                    {hasError ? (
                      <AlertCircle className="text-red-500" size={20} />
                    ) : isValidField ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {hasError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2 text-red-600 text-sm"
                >
                  <AlertCircle size={16} />
                  <span>{error?.message || error || 'Invalid input'}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      }}
    />
  )
}

// Main Demo Form Component
export default function DemoForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPasswordStrength, setShowPasswordStrength] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid, touchedFields },
    reset,
  } = useForm({
    resolver: zodResolver(demoFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      plantTypes: [],
      newsletter: false,
      password: '',
      confirmPassword: '',
      bio: '',
    },
  })

  // Watch password for strength indicator
  const watchedPassword = watch('password', '')
  const passwordStrength = calculatePasswordStrength(watchedPassword)

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Form submitted:', data)
      
      // Show success toast with custom styling
      toast.success('Form submitted successfully! 🌱', {
        duration: 4000,
        style: {
          background: '#10B981',
          color: 'white',
        },
        icon: '✅',
      })
      
      // Reset form
      reset()
      setCurrentStep(1)
      
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to submit form. Please try again.', {
        duration: 4000,
        style: {
          background: '#EF4444',
          color: 'white',
        },
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle step navigation
  const nextStep = async () => {
    const fieldsToValidate = currentStep === 1 
      ? ['firstName', 'lastName', 'email', 'phone']
      : ['address', 'city', 'postalCode']
    
    const isStepValid = await trigger(fieldsToValidate)
    
    if (isStepValid) {
      setCurrentStep(currentStep + 1)
      toast.success('Step completed! 🎉', { duration: 2000 })
    } else {
      toast.error('Please fix the errors before continuing.', { duration: 3000 })
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // Step indicator
  const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Address', icon: MapPin },
    { number: 3, title: 'Preferences', icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <Leaf className="text-green-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Enhanced Form Demo</h1>
          </motion.div>
          <p className="text-gray-600">
            Showcasing React Hook Form with validation, animations, and error toasts
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <motion.div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${currentStep >= step.number
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <step.icon size={20} />
              </motion.div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-16 h-1 mx-2 transition-all duration-300
                    ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-300'}
                  `}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form */}
        <motion.div
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      name="firstName"
                      control={control}
                      label="First Name"
                      placeholder="Enter your first name"
                      icon={User}
                    />
                    <FormField
                      name="lastName"
                      control={control}
                      label="Last Name"
                      placeholder="Enter your last name"
                      icon={User}
                    />
                  </div>
                  
                  <FormField
                    name="email"
                    control={control}
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    icon={Mail}
                  />
                  
                  <FormField
                    name="phone"
                    control={control}
                    type="tel"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    icon={Phone}
                  />
                </motion.div>
              )}

              {/* Step 2: Address Information */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Address Information</h2>
                  
                  <FormField
                    name="address"
                    control={control}
                    label="Street Address"
                    placeholder="Enter your full address"
                    icon={MapPin}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      name="city"
                      control={control}
                      label="City"
                      placeholder="Enter your city"
                      icon={MapPin}
                    />
                    <FormField
                      name="postalCode"
                      control={control}
                      label="Postal Code"
                      placeholder="Enter postal code"
                      icon={MapPin}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Preferences & Security */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Preferences & Security</h2>
                  
                  {/* Password Fields */}
                  <div className="space-y-4">
                    <FormField
                      name="password"
                      control={control}
                      type="password"
                      label="Password"
                      placeholder="Create a strong password"
                      icon={Shield}
                      onFocus={() => setShowPasswordStrength(true)}
                    />
                    
                    {/* Password Strength Indicator */}
                    <AnimatePresence>
                      {showPasswordStrength && watchedPassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50 rounded-lg p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Password Strength</span>
                            <span className={`text-sm font-medium ${
                              passwordStrength.score >= 4 ? 'text-green-600' :
                              passwordStrength.score >= 3 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {passwordStrength.score >= 4 ? 'Strong' :
                               passwordStrength.score >= 3 ? 'Medium' : 'Weak'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                passwordStrength.score >= 4 ? 'bg-green-500' :
                                passwordStrength.score >= 3 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(passwordStrength.checks).map(([key, passed]) => (
                              <div key={key} className={`flex items-center space-x-1 ${passed ? 'text-green-600' : 'text-gray-400'}`}>
                                <CheckCircle size={12} />
                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <FormField
                      name="confirmPassword"
                      control={control}
                      type="password"
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      icon={Shield}
                    />
                  </div>

                  {/* Bio Textarea */}
                  <Controller
                    name="bio"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Bio (Optional)
                        </label>
                        <textarea
                          {...field}
                          rows={4}
                          placeholder="Tell us about yourself..."
                          className={`
                            w-full px-4 py-3 rounded-xl border-2 transition-all duration-300
                            bg-white/60 backdrop-blur-sm resize-none
                            ${error ? 'border-red-300' : 'border-gray-200 focus:border-blue-500'}
                            focus:ring-4 focus:ring-blue-200 focus:outline-none
                          `}
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{error?.message || error || 'Invalid input'}</span>
                          <span>{field.value?.length || 0}/500</span>
                        </div>
                      </div>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft size={20} />
                  <span>Previous</span>
                </motion.button>
              )}
              
              <div className="ml-auto">
                {currentStep < 3 ? (
                  <motion.button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Next</span>
                    <ArrowRight size={20} />
                  </motion.button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Save size={20} />
                        <span>Submit Form</span>
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}