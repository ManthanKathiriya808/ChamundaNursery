// Checkout page placeholder with secure payment gateway section
import React, { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Phone, MapPin, CreditCard, Calendar, Lock, Smartphone, Banknote, ShoppingCart, CheckCircle, Package } from 'lucide-react'
import { useCart } from '../hooks/CartProvider.jsx'
import { useToast } from '../components/ToastProvider.jsx'
import { FormField, SubmitFormButton } from '../components/forms'



export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const toast = useToast()
  const [submitting, setSubmitting] = useState(false)
  const [pay, setPay] = useState('card')
  const [orderSuccess, setOrderSuccess] = useState(false)
  const shipping = useMemo(() => (subtotal > 499 ? 0 : 99), [subtotal])
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping])

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid, isDirty },
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      city: '',
      postal: '',
      card: '',
      expiry: '',
      cvv: '',
      upi: ''
    }
  })

  // Watch form values for validation animations
  const watchedValues = watch()

  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.push('error', 'Your cart is empty')
      return
    }
    
    setSubmitting(true)
    try {
      // Simulate API call for order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setOrderSuccess(true)
      toast.push('success', `Order placed successfully! Total: ₹${total}`)
      
      // Allow success animation to play before clearing cart
      setTimeout(() => {
        clear()
        setOrderSuccess(false)
      }, 3000)
      
      // In a real app, redirect to order confirmation page
      console.log('Order data:', { ...data, paymentMethod: pay, total, items })
    } catch (err) {
      console.error('Order processing error:', err)
      toast.push('error', 'Failed to process order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      <Helmet>
        <title>Checkout • Chamunda Nursery</title>
        <meta name="description" content="Complete your purchase securely" />
      </Helmet>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10" />
      </div>


      {/* Success Overlay */}
      <AnimatePresence>
        {orderSuccess && (
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
              <CheckCircle className="w-32 h-32 mx-auto mb-4 text-white" />
              <h2 className="text-3xl font-bold mb-2">Order Placed!</h2>
              <p className="text-xl opacity-90">Thank you for your purchase</p>
              <p className="text-lg opacity-75 mt-2">Total: ₹{total}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ShoppingCart className="w-16 h-16 mr-4 text-primary" />
            <h1 className="text-4xl font-bold text-gray-800">Secure Checkout</h1>
          </div>
          <p className="text-lg text-gray-600">Complete your order safely and securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Steps */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6" noValidate>
            {/* Form Accent */}
            <div className="flex justify-center mb-6">
              <Package className="w-20 h-20 text-primary" />
            </div>

            {/* Shipping Details */}
            <motion.div 
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</div>
                <Package className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Shipping Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FormField
                    name="name"
                    type="text"
                    control={control}
                    rules={{
                      required: 'Full name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    }}
                    label="Full Name"
                    placeholder="Enter your full name"
                    icon={User}
                  />
                  {/* Validation Animation */}
                  <AnimatePresence>
                    {watchedValues.name && !errors.name && (
                      <motion.div
                        className="absolute -right-2 top-8"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="relative">
                  <FormField
                    name="phone"
                    type="tel"
                    control={control}
                    rules={{
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\+?[0-9\- ]{7,}$/,
                        message: 'Please enter a valid phone number'
                      }
                    }}
                    label="Phone Number"
                    placeholder="+91 98765 43210"
                    icon={Phone}
                  />
                  {/* Validation Animation */}
                  <AnimatePresence>
                    {watchedValues.phone && !errors.phone && (
                      <motion.div
                        className="absolute -right-2 top-8"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="md:col-span-2 relative">
                  <FormField
                    name="address"
                    type="text"
                    control={control}
                    rules={{
                      required: 'Street address is required',
                      minLength: {
                        value: 10,
                        message: 'Please provide a complete address'
                      }
                    }}
                    label="Street Address"
                    placeholder="House/Flat No., Street, Area"
                    icon={MapPin}
                  />
                  {/* Validation Animation */}
                  <AnimatePresence>
                    {watchedValues.address && !errors.address && (
                      <motion.div
                        className="absolute -right-2 top-8"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="relative">
                  <FormField
                    name="city"
                    type="text"
                    control={control}
                    rules={{
                      required: 'City is required',
                      minLength: {
                        value: 2,
                        message: 'Please enter a valid city name'
                      }
                    }}
                    label="City"
                    placeholder="Enter your city"
                    icon={MapPin}
                  />
                  {/* Validation Animation */}
                  <AnimatePresence>
                    {watchedValues.city && !errors.city && (
                      <motion.div
                        className="absolute -right-2 top-8"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="relative">
                  <FormField
                    name="postal"
                    type="text"
                    control={control}
                    rules={{
                      required: 'Postal code is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'Please enter a valid 6-digit postal code'
                      }
                    }}
                    label="Postal Code"
                    placeholder="123456"
                    icon={MapPin}
                  />
                  {/* Validation Animation */}
                  <AnimatePresence>
                    {watchedValues.postal && !errors.postal && (
                      <motion.div
                        className="absolute -right-2 top-8"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div 
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</div>
                <CreditCard className="w-6 h-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
              </div>
              
              <div className="space-y-3 mb-4">
                <motion.label 
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input 
                    type="radio" 
                    name="pay" 
                    checked={pay === 'card'} 
                    onChange={() => setPay('card')} 
                    className="mr-3 text-blue-600"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-gray-700 font-medium">Credit/Debit Card</span>
                </motion.label>
                
                <motion.label 
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input 
                    type="radio" 
                    name="pay" 
                    checked={pay === 'upi'} 
                    onChange={() => setPay('upi')} 
                    className="mr-3 text-blue-600"
                  />
                  <Smartphone className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-gray-700 font-medium">UPI Payment</span>
                </motion.label>
                
                <motion.label 
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input 
                    type="radio" 
                    name="pay" 
                    checked={pay === 'cod'} 
                    onChange={() => setPay('cod')} 
                    className="mr-3 text-blue-600"
                  />
                  <Banknote className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-gray-700 font-medium">Cash on Delivery</span>
                </motion.label>
              </div>

              {pay === 'card' && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-blue-50 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <FormField
                      name="card"
                      type="text"
                      control={control}
                      rules={{
                        required: pay === 'card' ? 'Card number is required' : false,
                        pattern: {
                          value: /^[0-9\s]{13,19}$/,
                          message: 'Please enter a valid card number'
                        }
                      }}
                      label="Card Number"
                      placeholder="1234 5678 9012 3456"
                      icon={CreditCard}
                    />
                    {/* Validation Animation */}
                    <AnimatePresence>
                      {watchedValues.card && !errors.card && (
                        <motion.div
                          className="absolute -right-2 top-8"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="relative">
                    <FormField
                      name="expiry"
                      type="text"
                      control={control}
                      rules={{
                        required: pay === 'card' ? 'Expiry date is required' : false,
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                          message: 'Please enter MM/YY format'
                        }
                      }}
                      label="Expiry MM/YY"
                      placeholder="07/27"
                      icon={Calendar}
                    />
                    {/* Validation Animation */}
                    <AnimatePresence>
                      {watchedValues.expiry && !errors.expiry && (
                        <motion.div
                          className="absolute -right-2 top-8"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="relative">
                    <FormField
                      name="cvv"
                      type="text"
                      control={control}
                      rules={{
                        required: pay === 'card' ? 'CVV is required' : false,
                        pattern: {
                          value: /^[0-9]{3,4}$/,
                          message: 'Please enter a valid CVV'
                        }
                      }}
                      label="CVV"
                      placeholder="123"
                      icon={Lock}
                    />
                    {/* Validation Animation */}
                    <AnimatePresence>
                      {watchedValues.cvv && !errors.cvv && (
                        <motion.div
                          className="absolute -right-2 top-8"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
              
              {pay === 'upi' && (
                <motion.div 
                  className="mt-4 p-4 bg-green-50 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <FormField
                      name="upi"
                      type="text"
                      control={control}
                      rules={{
                        required: pay === 'upi' ? 'UPI ID is required' : false,
                        pattern: {
                          value: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/,
                          message: 'Please enter a valid UPI ID'
                        }
                      }}
                      label="UPI ID"
                      placeholder="name@bank"
                      icon={Smartphone}
                    />
                    {/* Validation Animation */}
                    <AnimatePresence>
                      {watchedValues.upi && !errors.upi && (
                        <motion.div
                          className="absolute -right-2 top-8"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
              
              {pay === 'cod' && (
                <motion.div 
                  className="mt-4 p-4 bg-yellow-50 rounded-lg"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <Banknote className="w-5 h-5 text-amber-600 mr-3" />
                    <p className="text-sm text-gray-600">Pay when your order is delivered to your doorstep.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div 
              className="flex justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="w-full sm:w-auto">
                <SubmitFormButton
                  isLoading={submitting}
                  isValid={isValid}
                  disabled={!isDirty || items.length === 0}
                  loadingText="Processing Order..."
                  size="lg"
                  icon={ShoppingCart}
                >
                  Place Order • ₹{total}
                </SubmitFormButton>
              </div>
            </motion.div>
          </form>

          {/* Right: Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-6">
              <div className="flex items-center mb-4">
                <Package className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
              </div>
              
              <div className="space-y-3 mb-4">
                {items.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 text-lg">Your cart is empty</p>
                    <p className="text-gray-400 text-sm mt-2">Add some plants to get started!</p>
                  </div>
                )}
                {items.map(i => (
                  <div key={i.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <span className="text-gray-800 font-medium">{i.name}</span>
                      <span className="text-gray-500 text-sm ml-2">× {i.qty}</span>
                    </div>
                    <span className="text-gray-800 font-medium">₹{i.price * i.qty}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-800 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <p className="text-xs text-green-800 font-medium">
                    Secure checkout with 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

              {/* Empty Cart Animation */}
              <div className="text-center py-16">
                <ShoppingCart className="w-32 h-32 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
                <p className="text-gray-500">Add some plants to get started!</p>
              </div>