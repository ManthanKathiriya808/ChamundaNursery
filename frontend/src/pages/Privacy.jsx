import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function Privacy() {
  return (
    <div className="page-container max-w-3xl">
      <Helmet>
        <title>Privacy Policy • Chamunda Nursery</title>
        <meta name="description" content="Chamunda Nursery privacy policy" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Privacy Policy</h1>
      <p className="text-neutral-700">We respect your privacy and protect your data.</p>
    </div>
  )
}