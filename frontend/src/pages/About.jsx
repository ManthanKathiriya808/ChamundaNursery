import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function About() {
  return (
    <div className="page-container max-w-3xl">
      <Helmet>
        <title>About Us • Chamunda Nursery</title>
        <meta name="description" content="Learn about Chamunda Nursery" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">About Chamunda Nursery</h1>
      <p className="text-neutral-700">We provide premium plants and gardening supplies, focusing on quality and customer satisfaction.</p>
    </div>
  )
}