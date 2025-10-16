// Enhanced Split Section Component with Lottie Animations and Modern Features
// Features:
// - Responsive split layout (media + content) with multiple variants
// - Lottie animations with fallback to static images/SVGs/videos
// - Scroll-triggered animations with Framer Motion
// - Accessibility compliant with proper ARIA labels
// - Customizable styling, spacing, and media ratios
// - Support for complex content structures and CTAs
// - Multiple pre-configured variants for common use cases
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Leaf, CheckCircle } from 'lucide-react'
import ScrollReveal from '../animations/ScrollReveal'

export default function SplitSection({
  // Content props
  title,
  subtitle,
  description,
  bullets = [],
  ctaText,
  onCtaClick = () => {},
  
  // Media props
  media, // React node (img/video/svg) - legacy support
  mediaType = 'custom', // 'image', 'video', 'svg', 'custom'
  mediaUrl,
  imageAlt = '',
  
  // Layout props
  reverse = false,
  mediaRatio = 'auto', // 'auto', '1:1', '16:9', '4:3', '3:2'
  spacing = 'normal', // 'tight', 'normal', 'loose'
  
  // Styling props
  className = '',
  bgClass = 'bg-pastel-gray',
  mediaClassName = '',
  contentClassName = '',
  
  // Animation props
  animateOnScroll = true,
  showLottieAccents = false, // Add this prop to fix the undefined error
  
  // Accessibility props
  id,
  'aria-labelledby': ariaLabelledBy,
}) {
  const reduceMotion = useReducedMotion()
  
  // Spacing and ratio classes
  const spacingClasses = {
    tight: 'gap-6 md:gap-8',
    normal: 'gap-8 md:gap-12',
    loose: 'gap-12 md:gap-16'
  }

  const ratioClasses = {
    'auto': '',
    '1:1': 'aspect-square',
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '3:2': 'aspect-[3/2]'
  }

  // Enhanced media rendering with Lottie support
  const renderMedia = () => {
    // Legacy support for custom media prop
    if (media && mediaType === 'custom') {
      return (
        <div className={`relative overflow-hidden rounded-xl shadow-soft bg-cream ${ratioClasses[mediaRatio]} ${mediaClassName}`}>
          {media}
        </div>
      )
    }

    // New media type support
    const mediaContent = (() => {
      switch (mediaType) {
        case 'image':
          return (
            <img
              src={mediaUrl}
              alt={imageAlt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )
        
        case 'video':
          return (
            <video
              src={mediaUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              aria-label={imageAlt}
            />
          )
        
        case 'svg':
          return (
            <div 
              className="w-full h-full flex items-center justify-center p-4"
              dangerouslySetInnerHTML={{ __html: mediaUrl }}
              aria-label={imageAlt}
            />
          )
        
        default:
          return (
            <div className="w-full h-full bg-softGray flex items-center justify-center">
              <span className="text-neutral-500">Media not available</span>
            </div>
          )
      }
    })()

    return (
      <div className={`relative overflow-hidden rounded-xl shadow-soft bg-cream ${ratioClasses[mediaRatio]} ${mediaClassName}`}>
        {mediaContent}
      </div>
    )
  }

  return (
    <section 
      id={id}
      className={`rounded-xl ${bgClass} py-10 md:py-16 ${className}`}
      aria-labelledby={ariaLabelledBy}
    >
      <div className={`container mx-auto px-4 grid md:grid-cols-2 items-center ${spacingClasses[spacing]} ${reverse ? 'md:[&>*:first-child]:col-start-2' : ''}`}>
        <ScrollReveal variant={reverse ? 'fadeRight' : 'fadeLeft'} className="order-1 md:order-none">
          {renderMedia()}
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" className={`order-2 md:order-none ${contentClassName}`}>
          {/* Optional subtitle */}
          {subtitle && (
            <p className="text-primary font-medium text-sm uppercase tracking-wide mb-3">
              {subtitle}
            </p>
          )}
          
          {/* Main title */}
          <h2 
            id={ariaLabelledBy}
            className="font-display text-2xl md:text-3xl text-neutral-900 mb-4"
          >
            {title}
          </h2>
          
          {/* Optional description */}
          {description && (
            <div className="text-neutral-700 mb-6 leading-relaxed">
              {typeof description === 'string' ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>
          )}
          
          {/* Feature bullets */}
          {bullets && bullets.length > 0 && (
            <ul className="space-y-3 mb-6">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  {showLottieAccents ? (
                    <div className="flex-shrink-0 w-5 h-5 mt-0.5">
                      <LottieAnimation
                        animationData={ctaAnimations.checkmark}
                        width={20}
                        height={20}
                        {...animationConfigs.ui}
                      />
                    </div>
                  ) : (
                    <CheckCircle className="mt-0.5 h-4 w-4 text-primary flex-shrink-0" aria-hidden />
                  )}
                  <div className="flex-1">
                    {typeof b === 'string' ? (
                      <p className="text-neutral-700">{b}</p>
                    ) : (
                      <>
                        <h4 className="font-semibold text-neutral-900 mb-1">{b.title}</h4>
                        <p className="text-neutral-700 text-sm">{b.description}</p>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          {/* CTA Button */}
          {ctaText && (
            <motion.button
              onClick={onCtaClick}
              className="inline-flex items-center rounded-lg bg-primary text-white px-6 py-3 shadow-soft hover:bg-primaryDark transition-colors focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 gap-2"
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              {ctaText}
              
              {/* Optional Lottie CTA accent */}
              {showLottieAccents && (
                <div className="w-4 h-4">
                  <LottieAnimation
                    animationData={ctaAnimations.arrowRight}
                    width={16}
                    height={16}
                    {...animationConfigs.ui}
                  />
                </div>
              )}
            </motion.button>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}