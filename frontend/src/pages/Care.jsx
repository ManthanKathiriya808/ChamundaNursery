// Care page with interactive guides, dynamic from API, skeletons, and ARIA
// Advanced patterns:
// - Animation: framer-motion for accordion panels
// - State: fetched guides with filter by difficulty
// - ARIA: disclosure pattern using button + aria-controls + role="region"
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { SkeletonBox } from '../components/Skeleton.jsx'
import { useData } from '../context/DataProvider.jsx'
import Accordion from '../components/ui/Accordion.jsx'

export default function Care() {
  const { careGuides, loading } = useData()
  const [guides, setGuides] = useState([])
  const [difficulty, setDifficulty] = useState('')
  // Collapsibles handled by shared Accordion

  useEffect(() => {
    const list = Array.isArray(careGuides) ? careGuides : []
    const filtered = difficulty ? list.filter((g) => g.difficulty === difficulty) : list
    setGuides(filtered)
  }, [difficulty, careGuides])

  return (
    <div className="page-container">
      <Helmet>
        <title>Care Guides • Chamunda Nursery</title>
        <meta name="description" content="Interactive plant care guides with step-by-step instructions." />
      </Helmet>
      <h1 className="heading-section">Care Guides</h1>
      <div className="mt-3">
        <label htmlFor="difficulty" className="text-sm font-medium">Filter by difficulty</label>
        <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="ml-2 rounded-md border border-neutral-300 bg-white px-2 py-1">
          <option value="">All</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="surface p-4">
              <SkeletonBox className="h-4 w-1/3 rounded" />
              <SkeletonBox className="mt-2 h-3 w-full rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6" role="region" aria-label="Care guide list">
          <Accordion
            allowMultiple
            items={guides.map((g) => ({
              title: (
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold">{g.title}</span>
                  <span className="text-sm text-neutral-600">{g.difficulty || ''}</span>
                </div>
              ),
              content: (
                g.steps && g.steps.length ? (
                  <ul className="mt-1 space-y-2">
                    {g.steps.map((s) => (
                      <li key={s.id} className="rounded-md border border-neutral-200 bg-white p-2">
                        <label className="inline-flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span>{s.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-1 space-y-2">
                    {(g.sections || []).map((sec, i) => (
                      <div key={i} className="rounded-md border border-neutral-200 bg-white p-2">
                        <h4 className="font-medium">{sec.heading}</h4>
                        <p className="text-sm text-neutral-700">{sec.body}</p>
                      </div>
                    ))}
                  </div>
                )
              ),
            }))}
          />
        </div>
      )}
    </div>
  )
}