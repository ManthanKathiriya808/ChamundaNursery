import React from 'react'
import { motion } from 'framer-motion'
import { Leaf, Truck, BookOpenCheck, ShieldCheck } from 'lucide-react'
import { useStaggerAnimation } from '../hooks/useScrollAnimation.js'

const badges = [
  {
    title: 'Healthy, Nursery-Grown Plants',
    desc: 'Handpicked for quality and vitality',
    icon: <Leaf className="h-6 w-6" aria-hidden />,
  },
  {
    title: 'Safe Packaging & Fast Delivery',
    desc: 'Transit-tested, eco-friendly materials',
    icon: <Truck className="h-6 w-6" aria-hidden />,
  },
  {
    title: 'Expert Care Guidance',
    desc: 'Support from plant specialists',
    icon: <BookOpenCheck className="h-6 w-6" aria-hidden />,
  },
  {
    title: 'Secure Checkout',
    desc: 'Trusted payments, easy returns',
    icon: <ShieldCheck className="h-6 w-6" aria-hidden />,
  },
]

export default function TrustBadges() {
  // Animation hook for staggered trust badges
  const badgesAnimation = useStaggerAnimation()

  return (
    <section aria-labelledby="trust-heading" className="py-6 md:py-10">
      <div className="page-container">
        <h2 id="trust-heading" className="sr-only">Our Trust Badges</h2>
        <motion.div 
          ref={badgesAnimation.ref}
          variants={badgesAnimation.containerVariants}
          initial="hidden"
          animate={badgesAnimation.inView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {badges.map((b, i) => (
            <motion.div
              key={b.title}
              variants={badgesAnimation.itemVariants}
              className="surface p-4 rounded-xl flex items-start gap-3"
            >
              <div className="h-10 w-10 rounded-full bg-pastel-green/30 text-primary flex items-center justify-center">{b.icon}</div>
              <div>
                <div className="font-display text-lg md:text-xl font-semibold">{b.title}</div>
                <div className="text-sm md:text-base text-neutral-600">{b.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}