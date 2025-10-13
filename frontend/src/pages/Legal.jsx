import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function Legal() {
  return (
    <div className="page-container max-w-3xl">
      <Helmet>
        <title>Legal Information • Chamunda Nursery</title>
        <meta name="description" content="Legal information and disclosures" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Legal Information</h1>
      <p className="text-neutral-700">Company registration and compliance details placeholder.</p>
    </div>
  )
}