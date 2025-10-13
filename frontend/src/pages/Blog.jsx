// Blog listing with lazy-loaded articles and smooth fade-in transitions
// Implementation details:
// - Articles simulate async loading with skeletons, then fade in using IntersectionObserver.
// - Images use native lazy loading via ImageLazy component.
import React, { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import ImageLazy from '../components/ImageLazy.jsx'
import { SkeletonBox } from '../components/Skeleton.jsx'

const demoArticles = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: `Plant Care Guide ${i + 1}`,
  summary: 'Learn tips and tricks to keep your plants healthy.',
  img: '/logo.png'
}))

export default function Blog() {
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState([])
  const cardsRef = useRef([])

  useEffect(() => {
    // Simulate asynchronous fetch
    setTimeout(() => { setArticles(demoArticles); setLoading(false) }, 700)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
        }
      })
    }, { threshold: 0.2 })
    cardsRef.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [loading])

  return (
    <div className="page-container">
      <Helmet>
        <title>Blog • Chamunda Nursery</title>
        <meta name="description" content="Plant care guides and articles" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Plant Care Guides</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-neutral-200 bg-white p-3">
              <SkeletonBox className="h-32 rounded-md" />
              <SkeletonBox className="mt-2 h-4 w-2/3 rounded" />
              <SkeletonBox className="mt-1 h-3 w-1/3 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((a, i) => (
            <article
              key={a.id}
              ref={(el) => (cardsRef.current[i] = el)}
              className="opacity-0 translate-y-2 transition duration-500 ease-soft rounded-lg border border-neutral-200 bg-white p-3"
            >
              <ImageLazy src={a.img} alt={a.title} className="h-32 w-full object-cover rounded-md bg-neutral-100" />
              <h2 className="mt-3 font-semibold">{a.title}</h2>
              <p className="text-neutral-700 text-sm">{a.summary}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}