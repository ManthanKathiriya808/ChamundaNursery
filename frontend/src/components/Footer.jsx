// Footer with quick links and contact placeholders
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-neutral-200 bg-accentSoft">
      <div className="page-container grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
        <div>
          <h2 className="font-display text-xl font-normal mb-2 text-primary">Chamunda Nursery</h2>
          <p className="text-neutral-700">Premium plants and gardening supplies.</p>
          <form className="mt-3 flex gap-2" aria-label="Newsletter">
            <input type="email" className="input input-bordered flex-1" placeholder="Email address" aria-label="Email" />
            <button className="btn btn-primary">Subscribe</button>
          </form>
        </div>
        <div>
          <h3 className="font-display font-normal mb-2">Shop</h3>
          <ul className="space-y-1">
            <li><Link className="link-hover" to="/catalog?category=indoor">Indoor Plants</Link></li>
            <li><Link className="link-hover" to="/catalog?category=outdoor">Outdoor Plants</Link></li>
            <li><Link className="link-hover" to="/catalog?category=seeds">Seeds</Link></li>
            <li><Link className="link-hover" to="/catalog?category=tools">Tools</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display font-normal mb-2">Support</h3>
          <ul className="space-y-1">
            <li><Link className="link-hover" to="/faq">FAQ</Link></li>
            <li><Link className="link-hover" to="/privacy">Privacy Policy</Link></li>
            <li><Link className="link-hover" to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display font-normal mb-2">Account</h3>
          <ul className="space-y-1">
            <li><Link className="link-hover" to="/account/login">Login</Link></li>
            <li><Link className="link-hover" to="/account/register">Register</Link></li>
            <li><Link className="link-hover" to="/account/profile">Profile</Link></li>
          </ul>
        </div>
      </div>
      <div className="page-container pt-4 pb-6 text-neutral-600">© {new Date().getFullYear()} Chamunda Nursery</div>
    </footer>
  )
}