// Chamunda Nursery homepage assembled with animated sections
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import BannerSlider from '../components/BannerSlider.jsx'
import CollectionGrid from '../components/CollectionGrid.jsx'
import PromoBanners from '../components/PromoBanners.jsx'
import TrustBadges from '../components/TrustBadges.jsx'
import BlogPreview from '../components/BlogPreview.jsx'
import NewsletterSignup from '../components/NewsletterSignup.jsx'
import VideoHeroCarousel from '../components/ui/VideoHeroCarousel.jsx'
import ParallaxBanner from '../components/animations/ParallaxBanner.jsx'
import SplitSection from '../components/ui/SplitSection.jsx'
import TestimonialCarousel from '../components/ui/TestimonialCarousel.jsx'
import FullWidthSection from '../components/ui/FullWidthSection.jsx'
import ColorBand from '../components/ui/ColorBand.jsx'
import Testimonials from '../components/Testimonials.jsx'
import RecentlyViewed from '../components/RecentlyViewed.jsx'
import ImageCarousel from '../components/ui/ImageCarousel.jsx'
import ProductCarousel from '../components/ProductCarousel.jsx'
import { useData } from '../context/DataProvider.jsx'
import { useScrollAnimation, useStaggerAnimation } from '../hooks/useScrollAnimation.js'
import { 
  useProducts, 
  useFeaturedProducts, 
  useTestimonials, 
  useHeroSlides,
  useApiError 
} from '../hooks/usePublicData.js'
import { 
  ProductGridSkeleton, 
  HeroSkeleton, 
  TestimonialSkeleton,
  ErrorState 
} from '../components/LoadingSkeletons.jsx'

export default function Home() {
  // Dynamic API data hooks
  const { 
    data: heroSlidesData, 
    isLoading: heroLoading, 
    error: heroError 
  } = useHeroSlides()
  
  const { 
    data: testimonialsData, 
    isLoading: testimonialsLoading, 
    error: testimonialsError 
  } = useTestimonials(6)
  
  const { 
    data: featuredProductsData, 
    isLoading: productsLoading, 
    error: productsError 
  } = useFeaturedProducts(8)

  // Use API data directly without fallbacks to ensure dynamic content only
  const heroSlides = heroSlidesData
  const testimonials = testimonialsData
  const products = featuredProductsData?.products || []
  
  // Error handling
  const heroErrorInfo = useApiError(heroError)
  const testimonialsErrorInfo = useApiError(testimonialsError)
  const productsErrorInfo = useApiError(productsError)

  const carouselItems = Array.isArray(testimonials)
    ? testimonials.map((t) => ({ name: t.name, quote: t.comment || t.quote, role: t.location || t.role }))
    : undefined

  // Animation hooks for different sections
  const collectionsAnimation = useScrollAnimation()
  const featuredAnimation = useScrollAnimation()
  const careAnimation = useScrollAnimation()
  const promosAnimation = useScrollAnimation()
  const testimonialsAnimation = useScrollAnimation()
  const trustAnimation = useScrollAnimation()
  const blogAnimation = useScrollAnimation()
  const featureCardsAnimation = useStaggerAnimation()
  const recentlyViewedAnimation = useScrollAnimation()
  const newsletterAnimation = useScrollAnimation()

  return (
    <div>
      <Helmet>
        <title>Chamunda Nursery • Modern Plant & Gardening Store</title>
        <meta name="description" content="Premium plants, seeds, tools, and care — delivered fresh." />
      </Helmet>

      {/* Video/Image Hero Carousel (full-bleed, autoplay, loop) */}
      {heroLoading ? (
        <HeroSkeleton />
      ) : heroErrorInfo ? (
        <ErrorState 
          title="Unable to load hero content"
          message={heroErrorInfo.message}
          onRetry={() => window.location.reload()}
        />
      ) : (
        <VideoHeroCarousel className="-mt-8" slides={heroSlides} />
      )}

      {/* Parallax banner with CTA overlay (full-bleed, no gap below hero) */}
      <ParallaxBanner imageSrc="/img.webp">
        <div className="h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl">
              <h2 className="font-display text-white text-2xl md:text-4xl drop-shadow">Seasonal Picks Are In</h2>
              <p className="mt-3 text-neutral-100">Fresh arrivals curated for Indian climates. Limited stock.</p>
              <a href="/catalog" className="mt-6 inline-block rounded-lg bg-primary text-white px-5 py-3 shadow-soft hover:bg-primaryDark">Browse New Arrivals</a>
            </div>
          </div>
        </div>
      </ParallaxBanner>

      {/* Full-width gradient band with CTA */}
      <ColorBand
        title="Free Shipping Over ₹499"
        subtitle="Healthy plants. Secure payments. Fast delivery."
        ctaText="Shop Now"
        onCtaClick={() => (window.location.href = '/catalog')}
      />

      {/* Collections (existing) */}
      <motion.div
        ref={collectionsAnimation.ref}
        variants={collectionsAnimation.variants.fadeUp}
        initial="hidden"
        animate={collectionsAnimation.inView ? "visible" : "hidden"}
      >
        <CollectionGrid />
      </motion.div>

      {/* Featured Products Carousel */}
      <motion.section 
        ref={featuredAnimation.ref}
        variants={featuredAnimation.variants.fadeUp}
        initial="hidden"
        animate={featuredAnimation.inView ? "visible" : "hidden"}
        className="py-16 bg-gradient-to-b from-green-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium plants and gardening essentials
            </p>
          </div>
          {productsLoading ? (
            <ProductGridSkeleton count={4} />
          ) : productsErrorInfo ? (
            <ErrorState 
              title="Unable to load featured products"
              message={productsErrorInfo.message}
              onRetry={() => window.location.reload()}
            />
          ) : (
            <ProductCarousel products={products} />
          )}
        </div>
      </motion.section>

      {/* Split section: Care + Tools */}
      <motion.div
        ref={careAnimation.ref}
        variants={careAnimation.variants.fadeLeft}
        initial="hidden"
        animate={careAnimation.inView ? "visible" : "hidden"}
      >
        <SplitSection
          title="Care Made Easy"
          bullets={[
            'Step-by-step guides for Indian household plants',
            'Watering, light, and soil tips from experts',
            'Curated tools to keep your greens thriving',
          ]}
          ctaText="Read Care Guides"
          onCtaClick={() => (window.location.href = '/care')}
          media={<img src="/demo/images/care-kit.jpg" alt="Plant care kit" className="w-full h-full object-cover" />}
        />
      </motion.div>

      {/* Existing promos */}
      <motion.div
        ref={promosAnimation.ref}
        variants={promosAnimation.variants.scaleUp}
        initial="hidden"
        animate={promosAnimation.inView ? "visible" : "hidden"}
      >
        <PromoBanners />
      </motion.div>

      {/* Testimonials carousel */}
      <motion.div 
        ref={testimonialsAnimation.ref}
        variants={testimonialsAnimation.variants.fadeRight}
        initial="hidden"
        animate={testimonialsAnimation.inView ? "visible" : "hidden"}
        className="mt-8"
      >
        <TestimonialCarousel items={carouselItems && carouselItems.length ? carouselItems : undefined} />
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        ref={trustAnimation.ref}
        variants={trustAnimation.variants.fadeUp}
        initial="hidden"
        animate={trustAnimation.inView ? "visible" : "hidden"}
      >
        <TrustBadges />
      </motion.div>

      {/* Testimonials */}
      <motion.section 
        ref={testimonialsAnimation.ref}
        variants={testimonialsAnimation.variants.fadeUp}
        initial="hidden"
        animate={testimonialsAnimation.inView ? "visible" : "hidden"}
        className="mt-8"
      >
        {testimonialsLoading ? (
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
              <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <TestimonialSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : testimonialsErrorInfo ? (
          <ErrorState 
            title="Unable to load testimonials"
            message={testimonialsErrorInfo.message}
            onRetry={() => window.location.reload()}
          />
        ) : (
          <Testimonials />
        )}
      </motion.section>

      {/* Blog Preview */}
      <motion.div
        ref={blogAnimation.ref}
        variants={blogAnimation.variants.fadeLeft}
        initial="hidden"
        animate={blogAnimation.inView ? "visible" : "hidden"}
      >
        <BlogPreview />
      </motion.div>

      {/* Full-width soft accent feature band */}
      <FullWidthSection
        bgClass="bg-accentSoft"
        title="Bring Nature Home"
        subtitle="Curated collections with care tips and tools."
        center
      >
        <motion.div 
          ref={featureCardsAnimation.ref}
          variants={featureCardsAnimation.containerVariants}
          initial="hidden"
          animate={featureCardsAnimation.inView ? "visible" : "hidden"}
          className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <motion.div variants={featureCardsAnimation.itemVariants} className="rounded-lg bg-white shadow-card p-5">
            <h3 className="font-medium text-neutral-900">Expert Care Guides</h3>
            <p className="mt-2 text-neutral-700">Step-by-step help to keep your plants thriving.</p>
          </motion.div>
          <motion.div variants={featureCardsAnimation.itemVariants} className="rounded-lg bg-white shadow-card p-5">
            <h3 className="font-medium text-neutral-900">Curated Collections</h3>
            <p className="mt-2 text-neutral-700">Find the right plant for your space and style.</p>
          </motion.div>
          <motion.div variants={featureCardsAnimation.itemVariants} className="rounded-lg bg-white shadow-card p-5">
            <h3 className="font-medium text-neutral-900">Trusted Quality</h3>
            <p className="mt-2 text-neutral-700">Healthy plants, secure payments, and fast delivery.</p>
          </motion.div>
        </motion.div>
      </FullWidthSection>

      {/* Recently Viewed */}
      <motion.section 
        ref={recentlyViewedAnimation.ref}
        variants={recentlyViewedAnimation.variants.fadeUp}
        initial="hidden"
        animate={recentlyViewedAnimation.inView ? "visible" : "hidden"}
        className="mt-8"
      >
        <RecentlyViewed title="Keep exploring" />
      </motion.section>

      {/* Newsletter */}
      <motion.div
        ref={newsletterAnimation.ref}
        variants={newsletterAnimation.variants.scaleUp}
        initial="hidden"
        animate={newsletterAnimation.inView ? "visible" : "hidden"}
      >
        <NewsletterSignup />
      </motion.div>
    </div>
  )
}