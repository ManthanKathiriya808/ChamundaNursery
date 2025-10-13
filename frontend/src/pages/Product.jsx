// Product detail page with sections and accessible layout
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import ImageLazy from '../components/ImageLazy.jsx'

export default function Product() {
  const { id } = useParams()
  return (
    <div className="page-container">
      <Helmet>
        <title>Product #{id} • Chamunda Nursery</title>
        <meta name="description" content="Product details, specifications, and care instructions" />
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image gallery placeholder */}
        <div className="rounded-lg border border-neutral-200 bg-white p-4" aria-label="Image gallery">
          <ImageLazy src="/logo.svg" alt={`Product ${id} main image`} className="h-64 w-full object-cover rounded-md bg-neutral-100" zoom />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[1,2,3,4].map(n => (
              <ImageLazy key={n} src="/logo.svg" alt={`Thumbnail ${n}`} className="h-16 w-full object-cover rounded bg-neutral-100" />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Product {id}</h1>
          <p className="text-neutral-700">Premium plant with great care needs. Ideal for home and garden.</p>
          <div className="text-xl font-medium">₹999</div>
          <button className="btn btn-primary w-full sm:w-auto">Add to Cart</button>

          {/* Tabs placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <h3 className="font-semibold mb-2">Specifications</h3>
              <ul className="text-sm text-neutral-700 space-y-1">
                <li>Height: 30cm</li>
                <li>Pot Size: 6 inch</li>
              </ul>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <h3 className="font-semibold mb-2">Care Instructions</h3>
              <ul className="text-sm text-neutral-700 space-y-1">
                <li>Water twice a week</li>
                <li>Indirect sunlight</li>
              </ul>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <h3 className="font-semibold mb-2">Reviews</h3>
              <p className="text-sm text-neutral-700">No reviews yet.</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Related Products</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[1,2,3,4].map((i) => (
                <Link key={i} to={`/product/${i}`} className="rounded-lg border border-neutral-200 bg-white p-3 link-hover">
                  <div className="h-24 rounded bg-neutral-100"></div>
                  <div className="mt-2 text-sm">Product {i}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}