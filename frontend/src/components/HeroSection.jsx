import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Leaf, Truck, ShieldCheck, Search, Sprout, Shovel } from 'lucide-react'
import ImageLazy from './ImageLazy.jsx'
import LottieAnimation from './animations/LottieAnimation.jsx'

// Animation data for hero section
const heroAnimations = {
  floatingLeaves: "https://lottie.host/4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s/data.json",
  wateringCan: "https://lottie.host/2l3m4n5o-6p7q-8r9s-0t1u-2v3w4x5y6z7a/data.json",
  plantGrowing: "https://lottie.host/6p7q8r9s-0t1u-2v3w-4x5y-6z7a8b9c0d1e/data.json"
}

// Animation configurations
const animationConfigs = {
  hero: {
    loop: true,
    autoplay: true,
    speed: 0.8,
    style: { width: '100%', height: '100%' }
  },
  ui: {
    loop: false,
    autoplay: false,
    speed: 1,
    style: { width: '24px', height: '24px' }
  }
}


export default function HeroSection() {
  return (
    <section aria-label="Hero" className="mb-10">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-primary via-accent to-primaryDark text-neutral-900">
        {/* Floating leaves background animation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
          <LottieAnimation
            animationData={heroAnimations.floatingLeaves}
            width="100%"
            height="100%"
            className="absolute inset-0"
            {...animationConfigs.hero}
          />
        </div>
        
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,white_0,transparent_35%),radial-gradient(circle_at_80%_30%,white_0,transparent_35%)]" />
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-6 p-6 md:p-10">
          {/* Left: title, subheading, CTAs, badges */}
          <div className="flex flex-col justify-center">
            <motion.h1
              className="heading-hero text-white drop-shadow"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Grow Something Extraordinary Today
            </motion.h1>
            <motion.p
              className="mt-3 text-white/90 max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
            >
              Premium plants and supplies from Chamunda Nursery. High-quality greens, expert care, fast delivery.
            </motion.p>

            <motion.div
              className="mt-6 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link to="/catalog" className="btn btn-primary flex items-center gap-2">
                <span>Shop Plants</span>
                {/* Watering can animation for CTA */}
                <LottieAnimation
                  animationData={heroAnimations.wateringCan}
                  width={24}
                  height={24}
                  {...animationConfigs.ui}
                />
              </Link>
              <Link to="/catalog?category=tools" className="btn btn-accent">
                Explore Tools
              </Link>
            </motion.div>

            {/* Quick search */}
            <div className="mt-6 max-w-lg">
              <label htmlFor="hero-search" className="sr-only">Search products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" aria-hidden="true" />
                <input
                  id="hero-search"
                  type="search"
                  placeholder="Search plants, seeds, tools…"
                  className="w-full rounded-md bg-white/95 pl-10 pr-3 py-2 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primaryLight"
                />
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[{ icon: Leaf, label: 'Healthy & Fresh' }, { icon: Truck, label: 'Fast Delivery' }, { icon: ShieldCheck, label: 'Secure Payments' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-white backdrop-blur transition-transform focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image collage / promo card */}
          <div className="relative">
            <div className="surface surface-hover bg-white/90 p-4 md:p-6">
              {/* Main plant growing animation */}
              <div className="relative w-full h-56 md:h-72 rounded-lg bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden">
                <LottieAnimation
                  animationData={heroAnimations.plantGrowing}
                  width="100%"
                  height="100%"
                  className="absolute inset-0"
                  {...animationConfigs.hero}
                />
                {/* Fallback logo if animation fails to load */}
                <ImageLazy 
                  src="/logo.svg" 
                  alt="Chamunda Nursery" 
                  className="absolute inset-0 w-full h-full object-contain opacity-20" 
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {['Indoor Plants', 'Outdoor', 'Seeds', 'Tools'].map((c) => (
                  <Link key={c} to={`/catalog?category=${c.toLowerCase()}`} className="rounded-md bg-accentSoft text-primary px-3 py-2 text-sm font-medium hover:bg-accentLight inline-flex items-center gap-2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                    {c}
                    {c === 'Seeds' ? <Sprout className="h-4 w-4" aria-hidden /> : c === 'Tools' ? <Shovel className="h-4 w-4" aria-hidden /> : <Leaf className="h-4 w-4" aria-hidden />}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { k: '50k+', v: 'Plants Delivered' },
          { k: '100+', v: 'Species' },
          { k: '12+', v: 'Years Experience' },
          { k: '4.8★', v: 'Average Rating' },
        ].map((s) => (
          <div key={s.v} className="surface p-4 text-center">
            <div className="text-xl font-semibold text-primary">{s.k}</div>
            <div className="text-sm text-neutral-700">{s.v}</div>
          </div>
        ))}
      </div>
    </section>
  )
}