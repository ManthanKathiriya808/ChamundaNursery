import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { useProduct, usePrefetchProduct } from '../hooks/queries/useProducts'
import useCartStore from '../stores/cartStore'
import useUIStore from '../stores/uiStore'
import useAuthStore from '../stores/authStore'
import LoadingSpinner from '../components/LoadingSpinner'
import ProductImageGallery from '../components/ProductImageGallery'
import ProductInfo from '../components/ProductInfo'
import ProductTabs from '../components/ProductTabs'
import RelatedProducts from '../components/RelatedProducts'
import ReviewSection from '../components/ReviewSection'
import BreadcrumbNav from '../components/BreadcrumbNav'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // State
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  
  // Zustand stores
  const { addItem, toggleCart } = useCartStore()
  const { showSuccess, showError } = useUIStore()
  const { user, isAuthenticated } = useAuthStore()
  
  // React Query
  const { data: product, isLoading, error } = useProduct(id)
  const prefetchProduct = usePrefetchProduct()
  
  // Memoized product data
  const productImages = useMemo(() => {
    if (!product) return []
    
    const images = []
    if (product.image) images.push(product.image)
    if (product.images && Array.isArray(product.images)) {
      images.push(...product.images)
    }
    if (product.thumbnail && !images.includes(product.thumbnail)) {
      images.push(product.thumbnail)
    }
    
    return images.length > 0 ? images : ['/placeholder-product.jpg']
  }, [product])
  
  const productPrice = useMemo(() => {
    if (!product) return { price: 0, mrp: 0, discount: 0 }
    
    const price = Number(product.price) || 0
    const mrp = Number(product.mrp) || price * 1.2
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0
    
    return { price, mrp, discount }
  }, [product])
  
  // Handlers
  const handleAddToCart = () => {
    if (!product) return
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: productPrice.price,
      image: productImages[0],
      quantity: quantity,
      variant: selectedVariant
    }
    
    addItem(cartItem)
    showSuccess(`${product.name} added to cart!`)
  }
  
  const handleBuyNow = () => {
    if (!isAuthenticated) {
      showError('Please sign in to continue')
      return
    }
    
    handleAddToCart()
    navigate('/checkout')
  }
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 999)) {
      setQuantity(newQuantity)
    }
  }
  
  const handleImageChange = (index) => {
    setSelectedImage(index)
  }
  
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant)
  }
  
  // Prefetch related products on hover
  const handleProductHover = (productId) => {
    prefetchProduct(productId)
  }
  
  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: product?.category || 'Category', href: `/products?category=${product?.category}` },
    { label: product?.name || 'Product', href: '#', current: true }
  ]
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error.message}</p>
          <button
            onClick={() => navigate('/catalog')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/catalog')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{product.name} • Chamunda Nursery</title>
        <meta name="description" content={product.description || `${product.name} - Premium quality plants and gardening supplies.`} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={productImages[0]} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <BreadcrumbNav items={breadcrumbItems} />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-6"
        >
          {/* Product Main Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Product Images */}
            <motion.div variants={itemVariants}>
              <ProductImageGallery
                images={productImages}
                selectedImage={selectedImage}
                onImageChange={handleImageChange}
                productName={product.name}
              />
            </motion.div>
            
            {/* Product Info */}
            <motion.div variants={itemVariants}>
              <ProductInfo
                product={product}
                price={productPrice}
                quantity={quantity}
                selectedVariant={selectedVariant}
                onQuantityChange={handleQuantityChange}
                onVariantChange={handleVariantChange}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                isAuthenticated={isAuthenticated}
              />
            </motion.div>
          </div>
          
          {/* Product Details Tabs */}
          <motion.div variants={itemVariants} className="mb-12">
            <ProductTabs product={product} />
          </motion.div>
          
          {/* Reviews Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <ReviewSection productId={product.id} />
          </motion.div>
          
          {/* Related Products */}
          <motion.div variants={itemVariants}>
            <RelatedProducts
              currentProduct={product}
              onProductHover={handleProductHover}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetail