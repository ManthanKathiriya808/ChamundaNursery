import React from 'react'
import { Helmet } from 'react-helmet-async'
import Accordion from '../components/ui/Accordion.jsx'

const faqs = [
  { q: 'How do I care for indoor plants?', a: 'Provide indirect sunlight, water moderately, and ensure drainage.' },
  { q: 'Do you offer delivery?', a: 'Yes, we offer local delivery and shipping options.' },
]

export default function FAQ() {
  return (
    <div className="page-container max-w-2xl">
      <Helmet>
        <title>FAQ • Chamunda Nursery</title>
        <meta name="description" content="Frequently asked questions" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h1>
      <Accordion
        items={faqs.map((f) => ({ title: f.q, content: f.a }))}
        className="mt-2"
      />
    </div>
  )
}