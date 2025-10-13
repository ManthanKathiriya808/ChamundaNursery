import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const faqs = [
  { q: 'How do I care for indoor plants?', a: 'Provide indirect sunlight, water moderately, and ensure drainage.' },
  { q: 'Do you offer delivery?', a: 'Yes, we offer local delivery and shipping options.' },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <div className="page-container max-w-2xl">
      <Helmet>
        <title>FAQ • Chamunda Nursery</title>
        <meta name="description" content="Frequently asked questions" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h1>
      <ul className="space-y-3">
        {faqs.map((item, i) => (
          <li key={i} className="rounded-lg border border-neutral-200 bg-white">
            <button
              className="w-full text-left p-3 font-medium"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
            >{item.q}</button>
            {open === i && <div className="p-3 text-serif-soft">{item.a}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}