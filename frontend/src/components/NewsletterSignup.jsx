import React from 'react'
import { motion } from 'framer-motion'

export default function NewsletterSignup() {
  const onSubmit = (e) => {
    e.preventDefault()
    // TODO: integrate with backend or a service like Mailchimp
    alert('Thanks for subscribing!')
  }
  return (
    <section aria-labelledby="newsletter-heading" className="py-6 md:py-10">
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="surface rounded-xl p-5 md:p-7 bg-gradient-to-br from-pastel-green/30 via-cream to-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
            <div>
              <h2 id="newsletter-heading" className="heading-section">Get weekly plant tips</h2>
              <p className="text-base md:text-lg text-neutral-700">Join our newsletter for care guides, offers, and inspiration.</p>
            </div>
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
              <input type="email" required placeholder="Your email" className="input flex-1" aria-label="Email address" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}