// Admin bulk upload page with accessible file input and result table
// Advanced patterns:
// - State: controlled file input and async upload status
// - ARIA: form labelling and live region for results
// - Animation: subtle motion for result rows
import React, { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { uploadProductsBulk } from '../services/api.js'

export default function BulkUpload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const reduceMotion = useReducedMotion()

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    try {
      const res = await uploadProductsBulk(file)
      setResult(res)
    } catch (err) {
      setResult({ imported: 0, errors: [{ message: err?.message || 'Upload failed' }] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section aria-labelledby="bulk-upload-title">
      <h1 id="bulk-upload-title" className="heading-section">Bulk Upload Products</h1>
      <p className="text-body mt-1">Upload a CSV with columns: name, price, category, image, description.</p>

      <form className="mt-4 space-y-3" onSubmit={onSubmit} aria-describedby="bulk-help">
        <div id="bulk-help" className="text-sm text-neutral-700">Only CSV files are accepted. Max size 10MB.</div>
        <label htmlFor="csv-file" className="block text-sm font-medium">Select CSV file</label>
        <input
          id="csv-file"
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full rounded-md border border-neutral-300 bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button type="submit" className="btn btn-primary" disabled={!file || loading}>
          {loading ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      <div className="mt-6" aria-live="polite" aria-atomic="true">
        {result && (
          <div className="surface p-4">
            <div className="font-semibold">Imported: {result.imported || 0}</div>
            {Array.isArray(result.errors) && result.errors.length > 0 && (
              <div className="mt-3">
                <h2 className="font-semibold">Errors</h2>
                <ul className="mt-2 space-y-2">
                  {result.errors.map((err, i) => (
                    <motion.li
                      key={i}
                      initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                      animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
                      className="rounded border border-red-200 bg-red-50 p-2 text-red-800"
                    >
                      {err.line ? `Line ${err.line}: ` : ''}{err.message || 'Unknown error'}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}