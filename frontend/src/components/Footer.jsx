// Footer with quick links and contact placeholders
import React from 'react'
import { Link } from 'react-router-dom'
import ImageLazy from './ImageLazy.jsx'
import { FiInstagram, FiFacebook, FiTwitter, FiGrid, FiHelpCircle, FiPhone, FiMail, FiShield } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-cream">
      {/* Brand row */}
      <div className="page-container py-6 sm:py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageLazy src="/logo.png" alt="Chamunda Nursery" className="h-14 w-14" />
            <div>
              <h2 className="font-display text-2xl font-semibold text-neutral-900">Chamunda Nursery</h2>
              <p className="text-neutral-700 text-base">Premium plants and gardening supplies.</p>
            </div>
          </div>
          {/* Socials */}
          <div className="hidden sm:flex items-center gap-3 text-neutral-700">
            <a href="#" aria-label="Instagram" className="rounded-md p-2 hover:bg-neutral-100"><FiInstagram aria-hidden /></a>
            <a href="#" aria-label="Facebook" className="rounded-md p-2 hover:bg-neutral-100"><FiFacebook aria-hidden /></a>
            <a href="#" aria-label="Twitter" className="rounded-md p-2 hover:bg-neutral-100"><FiTwitter aria-hidden /></a>
          </div>
        </div>
      </div>
      {/* Link grid */}
      <div className="page-container grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-10 text-base py-6">
        {/* Newsletter */}
        <div>
          <h3 className="font-display font-semibold mb-2">Stay in the loop</h3>
          <p className="text-neutral-700">Get offers, tips, and inspiration.</p>
          <form className="mt-3 flex gap-2" aria-label="Newsletter">
            <input type="email" className="input input-bordered flex-1 min-h-[44px]" placeholder="Email address" aria-label="Email" />
            <button className="btn btn-primary min-h-[44px]">Subscribe</button>
          </form>
        </div>
        {/* Shop links */}
        <div role="navigation" aria-label="Shop">
          <h3 className="font-display font-semibold mb-2">Shop</h3>
          <ul className="space-y-1">
            <li><Link className="flex items-center gap-2 px-2 py-3 rounded-md hover:bg-softGray/60 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" to="/catalog?category=indoor"><FiGrid aria-hidden /><span>Indoor Plants</span></Link></li>
            <li><Link className="flex items-center gap-2 px-2 py-3 rounded-md hover:bg-softGray/60 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" to="/catalog?category=outdoor"><FiGrid aria-hidden /><span>Outdoor Plants</span></Link></li>
            <li><Link className="flex items-center gap-2 px-2 py-3 rounded-md hover:bg-softGray/60 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" to="/catalog?category=seeds"><FiGrid aria-hidden /><span>Seeds</span></Link></li>
            <li><Link className="flex items-center gap-2 px-2 py-3 rounded-md hover:bg-softGray/60 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" to="/catalog?category=tools"><FiGrid aria-hidden /><span>Tools</span></Link></li>
          </ul>
        </div>
        {/* Support links */}
        <div role="navigation" aria-label="Support">
          <h3 className="font-display font-semibold mb-2">Support</h3>
          <ul className="space-y-1">
            <li><Link className="flex items-center gap-2 px-2 py-3 rounded-md hover:bg-softGray/60 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" to="/faq"><FiHelpCircle aria-hidden /><span>FAQ</span></Link></li>
            <li><Link className="flex items-center gap-2 px-2 py-3 rounded-md hover:bg-softGray/60 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" to="/contact"><FiPhone aria-hidden /><span>Contact Us</span></Link></li>
            <li><Link className="flex items-center gap-2 px-2 py-3 rounded-md hover:bg-softGray/60 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" to="/privacy"><FiShield aria-hidden /><span>Privacy Policy</span></Link></li>
          </ul>
        </div>
        {/* Contact details */}
        <div aria-label="Contact">
          <h3 className="font-display font-semibold mb-2">Get in touch</h3>
          <ul className="space-y-1 text-neutral-700">
            <li className="flex items-center gap-2 px-2 py-2"><FiPhone aria-hidden /><span>+91 90000 00000</span></li>
            <li className="flex items-center gap-2 px-2 py-2"><FiMail aria-hidden /><span>support@chamundanursery.com</span></li>
          </ul>
        </div>
      </div>
      {/* Footer bottom */}
      <div className="page-container border-t border-neutral-200 py-5 flex items-center justify-between text-neutral-700 text-base">
        <span>© {new Date().getFullYear()} Chamunda Nursery</span>
        <span className="hidden sm:block">Healthy plants • Secure payments • Fast delivery</span>
      </div>
    </footer>
  )
}