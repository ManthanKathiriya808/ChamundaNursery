// Chamunda Nursery homepage assembled with animated sections
import React from 'react'
import { Helmet } from 'react-helmet-async'
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
import { useData } from '../context/DataProvider.jsx'

export default function Home() {
  const { heroSlides, testimonials } = useData()
  const carouselItems = Array.isArray(testimonials)
    ? testimonials.map((t) => ({ name: t.name, quote: t.comment || t.quote, role: t.location || t.role }))
    : undefined

  return (
    <div>
      <Helmet>
        <title>Chamunda Nursery • Modern Plant & Gardening Store</title>
        <meta name="description" content="Premium plants, seeds, tools, and care — delivered fresh." />
      </Helmet>

      {/* Video/Image Hero Carousel (full-bleed, autoplay, loop) */}
      <VideoHeroCarousel className="-mt-8" slides={heroSlides && heroSlides.length ? heroSlides : undefined} />

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
      <CollectionGrid />

      {/* Split section: Care + Tools */}
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

      {/* Existing promos */}
      <PromoBanners />

      {/* Testimonials carousel */}
      <div className="mt-8">
        <TestimonialCarousel items={carouselItems && carouselItems.length ? carouselItems : undefined} />
      </div>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Testimonials */}
      <section className="mt-8">
        <Testimonials />
      </section>

      {/* Blog Preview */}
      <BlogPreview />

      {/* Full-width soft accent feature band */}
      <FullWidthSection
        bgClass="bg-accentSoft"
        title="Bring Nature Home"
        subtitle="Curated collections with care tips and tools."
        center
      >
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-lg bg-white shadow-card p-5">
            <h3 className="font-medium text-neutral-900">Expert Care Guides</h3>
            <p className="mt-2 text-neutral-700">Step-by-step help to keep your plants thriving.</p>
          </div>
          <div className="rounded-lg bg-white shadow-card p-5">
            <h3 className="font-medium text-neutral-900">Curated Collections</h3>
            <p className="mt-2 text-neutral-700">Find the right plant for your space and style.</p>
          </div>
          <div className="rounded-lg bg-white shadow-card p-5">
            <h3 className="font-medium text-neutral-900">Trusted Quality</h3>
            <p className="mt-2 text-neutral-700">Healthy plants, secure payments, and fast delivery.</p>
          </div>
        </div>
      </FullWidthSection>

      {/* Recently Viewed */}
      <section className="mt-8">
        <RecentlyViewed title="Keep exploring" />
      </section>

      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  )
}