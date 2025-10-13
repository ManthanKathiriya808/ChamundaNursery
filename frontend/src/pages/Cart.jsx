// Cart page placeholder
import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function Cart() {
  return (
    <div className="page-container">
      <Helmet>
        <title>Cart • Chamunda Nursery</title>
        <meta name="description" content="Review items in your cart" />
      </Helmet>
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <p>Your cart is empty.</p>
      </div>
    </div>
  )
}