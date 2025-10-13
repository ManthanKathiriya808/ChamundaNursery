// Home page featuring banner placeholders and featured collections
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import BannerSlider from '../components/BannerSlider.jsx'

export default function Home() {
  return (
    <div className="page-container">
      {/* Basic SEO title & meta using react-helmet-async */}
      <Helmet>
        <title>Home • Chamunda Nursery</title>
        <meta name="description" content="Discover premium plants and garden supplies" />
      </Helmet>

      {/* Banner slider with fade transitions and keyboard navigation */}
      <div className="mb-8">
        <BannerSlider />
      </div>

      {/* Featured collections placeholders */}
      <section aria-label="Featured collections" className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Featured Collections</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {["Indoor", "Outdoor", "Bonsai", "Tools"].map((label, i) => (
            <Link
              key={label}
              to={`/catalog?category=${label.toLowerCase()}`}
              className="group rounded-lg border border-neutral-200 p-4 bg-white hover:shadow-premium transition ease-soft duration-300"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="h-24 rounded-md bg-neutral-100 group-hover:bg-accent/40 transition ease-soft"></div>
              <div className="mt-3 font-medium group-hover:text-primary">{label}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}