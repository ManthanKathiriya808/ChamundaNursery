// Checkout page placeholder with secure payment gateway section
import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function Checkout() {
  return (
    <div className="page-container">
      <Helmet>
        <title>Checkout • Chamunda Nursery</title>
        <meta name="description" content="Complete your purchase securely" />
      </Helmet>
      <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
        <h2 className="font-semibold">Payment</h2>
        <p className="text-neutral-700">Payment gateway integration placeholder.</p>
        <button className="btn btn-primary">Proceed to Pay</button>
      </div>
    </div>
  )
}