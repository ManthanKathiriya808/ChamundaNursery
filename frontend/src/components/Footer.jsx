// Footer with quick links and contact placeholders
import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-neutral-200 bg-white">
      <div className="page-container grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <h2 className="font-semibold mb-2">Chamunda Nursery</h2>
          <p className="text-neutral-600">Premium plants and gardening supplies.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link className="link-hover" to="/catalog">Catalog</Link></li>
            <li><Link className="link-hover" to="/cart">Cart</Link></li>
            <li><Link className="link-hover" to="/checkout">Checkout</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-neutral-600">Email: info@chamundanursery.example</p>
        </div>
      </div>
      <div className="page-container pt-4 pb-6 text-neutral-500">© {new Date().getFullYear()} Chamunda Nursery</div>
    </footer>
  )
}