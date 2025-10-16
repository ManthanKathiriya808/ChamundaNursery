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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Bulk Upload Products</h1>
          <p className="text-lg text-gray-600">Upload a CSV with columns: name, price, category, image, description</p>
        </div>

        {/* Upload Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <form className="space-y-6" onSubmit={onSubmit} aria-describedby="bulk-help">
            <div className="text-center">
              <div className="text-6xl mb-4">📁</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Select CSV File</h2>
              <div id="bulk-help" className="text-sm text-gray-600 mb-6">
                Only CSV files are accepted. Maximum file size: 10MB
              </div>
            </div>

            <div className="space-y-4">
              <label htmlFor="csv-file" className="block text-sm font-medium text-gray-700">
                Choose CSV File
              </label>
              <div className="relative">
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors file:duration-200 border border-gray-200 rounded-xl p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {file && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-green-700">Selected: {file.name}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <button 
                type="submit" 
                disabled={!file || loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:transform-none disabled:hover:scale-100 flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <span>📤</span>
                    <span>Upload Products</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div aria-live="polite" aria-atomic="true">
          {result && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">
                  {result.imported > 0 ? '✅' : '❌'}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Upload Results</h2>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="font-semibold text-green-800">
                    Successfully imported: {result.imported || 0} products
                  </span>
                </div>
              </div>

              {Array.isArray(result.errors) && result.errors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-red-700 flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>Errors ({result.errors.length})</span>
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {result.errors.map((err, i) => (
                      <motion.div
                        key={i}
                        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                        animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-lg p-3"
                      >
                        <div className="text-red-800 text-sm">
                          {err.line && (
                            <span className="font-medium">Line {err.line}: </span>
                          )}
                          {err.message || 'Unknown error'}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}