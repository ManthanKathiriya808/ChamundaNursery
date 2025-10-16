// Products management with CRUD and CSV upload (client-side validation)
import React, { useRef, useState } from 'react'
import { useToast } from '../components/ToastProvider.jsx'
import { InputField, SubmitButton } from '../components/forms'
import { useData } from '../context/DataProvider.jsx'

export default function AdminProducts() {
  const toast = useToast()
  const { products, addOrUpdateProduct, removeProduct, loading } = useData()
  const [form, setForm] = useState({ name: '', slug: '', price: '' })
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)

  const notify = (type, message) => toast.push(type, message)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validateForm = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.slug.trim()) e.slug = 'Slug is required'
    if (!String(form.price).trim() || isNaN(Number(form.price))) e.price = 'Valid price required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const addItem = async (ev) => {
    ev.preventDefault()
    if (!validateForm()) return notify('error', 'Please fix form errors')
    const next = { ...form, price: Number(form.price) }
    try {
      await addOrUpdateProduct(next)
      notify('success', 'Product saved')
    } catch (e) {
      console.error(e)
      notify('error', 'Failed to save product')
    }
    setForm({ name: '', slug: '', price: '' })
  }

  const deleteItem = async (id) => {
    try {
      await removeProduct(id)
      notify('success', 'Product deleted')
    } catch (e) {
      console.error(e)
      notify('error', 'Failed to delete product')
    }
  }

  const onUploadCSV = async (ev) => {
    const file = ev.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.csv')) return notify('error', 'Please upload a .csv file')
    const text = await file.text()
    const rows = text.split(/\r?\n/).filter(Boolean)
    // Expect header: name,slug,price
    const header = rows.shift()?.split(',') || []
    if (header.join(',') !== 'name,slug,price') return notify('error', 'CSV header must be name,slug,price')
    const parsed = []
    const badRows = []
    rows.forEach((line, idx) => {
      const [name, slug, price] = line.split(',').map((s) => s.trim())
      const rowErrors = []
      if (!name) rowErrors.push('name required')
      if (!slug) rowErrors.push('slug required')
      if (!price || isNaN(Number(price))) rowErrors.push('price invalid')
      if (rowErrors.length) badRows.push({ line: idx + 2, errors: rowErrors })
      else parsed.push({ id: Date.now() + idx, name, slug, price: Number(price) })
    })
    if (badRows.length) {
      notify('error', `CSV errors in ${badRows.length} row(s)`)
    } else {
      try {
        for (const row of parsed) {
          await addOrUpdateProduct({ name: row.name, slug: row.slug, price: row.price })
        }
        notify('success', `Imported ${parsed.length} product(s)`)
      } catch (e) {
        console.error(e)
        notify('error', 'Failed to import some products')
      }
    }
    fileRef.current.value = ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Product Management</h1>
          <p className="text-lg text-gray-600">Add, edit, and manage your nursery products</p>
        </div>

        {/* Create form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Product</h2>
          <form onSubmit={addItem} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField 
                name="name" 
                label="Product Name" 
                value={form.name} 
                onChange={onChange} 
                required 
                error={errors.name} 
              />
              <InputField 
                name="slug" 
                label="URL Slug" 
                value={form.slug} 
                onChange={onChange} 
                required 
                error={errors.slug} 
              />
              <InputField 
                name="price" 
                label="Price (₹)" 
                value={form.price} 
                onChange={onChange} 
                required 
                error={errors.price} 
              />
            </div>
            <div className="flex justify-end">
              <div className="w-full sm:w-auto">
                <SubmitButton>Add Product</SubmitButton>
              </div>
            </div>
          </form>
        </div>

        {/* CSV upload */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Bulk CSV Upload</h2>
            <div className="flex items-center space-x-3">
              <label 
                htmlFor="csv-upload" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 flex items-center space-x-2"
              >
                <span>📁</span>
                <span>Choose File</span>
              </label>
              <input 
                id="csv-upload"
                ref={fileRef} 
                type="file" 
                accept=".csv" 
                onChange={onUploadCSV} 
                aria-label="Upload products CSV" 
                className="hidden"
              />
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>CSV Format:</strong> Include header row with columns: <code className="bg-white px-2 py-1 rounded">name,slug,price</code>
            </p>
            <p className="text-xs text-gray-500 mt-1">Validation feedback will appear as notifications</p>
          </div>
        </div>

        {/* Items table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Inventory</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Product Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">URL Slug</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(products || []).map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-gray-800">{p.name}</td>
                    <td className="py-3 px-4 text-gray-600">{p.slug}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">₹{p.price}</td>
                    <td className="py-3 px-4">
                      <button 
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm transition-colors duration-200"
                        onClick={() => deleteItem(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {(products || []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-4xl">🌱</span>
                        <span>No products yet. Add your first product or import from CSV.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {loading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Loading products...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}