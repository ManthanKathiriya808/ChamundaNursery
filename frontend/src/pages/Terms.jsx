import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function Terms() {
  return (
    <div className="page-container max-w-3xl">
      <Helmet>
        <title>Terms of Service • Chamunda Nursery</title>
        <meta name="description" content="Chamunda Nursery terms of service" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Terms of Service</h1>
      <p className="text-neutral-700">These are sample terms of service for demonstration purposes.</p>
    </div>
  )
}