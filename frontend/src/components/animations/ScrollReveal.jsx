// ScrollReveal: universal wrapper for fade/slide-in on intersection
// Accessibility: respects prefers-reduced-motion; semantic wrapper via `as` prop
import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const variantsMap = {
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  fadeUp: { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } },
  fadeLeft: { hidden: { opacity: 0, x: -18 }, show: { opacity: 1, x: 0 } },
  fadeRight: { hidden: { opacity: 0, x: 18 }, show: { opacity: 1, x: 0 } },
}

export default function ScrollReveal({
  as: Tag = 'div',
  variant = 'fadeUp',
  duration = 0.5,
  delay = 0,
  staggerChildren = 0,
  once = true,
  amount = 0.3,
  className = '',
  children,
  ...rest
}) {
  const reduceMotion = useReducedMotion()
  const variants = variantsMap[variant] || variantsMap.fadeUp
  const MotionTag = motion[Tag] || motion.div

  const motionProps = reduceMotion
    ? { initial: false, whileInView: undefined, animate: undefined }
    : {
        initial: 'hidden',
        whileInView: 'show',
        viewport: { once, amount },
        transition: { duration, delay, ease: 'easeOut', staggerChildren },
      }

  return (
    <MotionTag {...motionProps} className={className} {...rest}>
      {children}
    </MotionTag>
  )
}