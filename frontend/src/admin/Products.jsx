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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Products</h1>

  {/* Toasts handled globally by ToastProvider */}

      {/* Create form */}
      <form onSubmit={addItem} className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3" noValidate>
        <InputField name="name" label="Name" value={form.name} onChange={onChange} required error={errors.name} />
        <InputField name="slug" label="Slug" value={form.slug} onChange={onChange} required error={errors.slug} />
        <InputField name="price" label="Price (₹)" value={form.price} onChange={onChange} required error={errors.price} />
        <div className="sm:w-48">
          <SubmitButton>Add Product</SubmitButton>
        </div>
      </form>

      {/* CSV upload */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Bulk CSV Upload</h2>
          <input ref={fileRef} type="file" accept=".csv" onChange={onUploadCSV} aria-label="Upload products CSV" />
        </div>
        <p className="text-sm text-neutral-600">CSV must include header: <code>name,slug,price</code>. Validation feedback appears as toasts.</p>
      </div>

      {/* Items table */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-200">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Slug</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(products || []).map((p) => (
                <tr key={p.id} className="border-t border-neutral-200">
                  <td className="py-2 pr-4">{p.name}</td>
                  <td className="py-2 pr-4">{p.slug}</td>
                  <td className="py-2 pr-4">₹{p.price}</td>
                  <td className="py-2 pr-4">
                    <button className="btn btn-outline" onClick={() => deleteItem(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {(products || []).length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-neutral-600">No products yet. Add or import CSV.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {loading && <div className="mt-3 text-neutral-600">Loading…</div>}
      </div>
    </div>
  )
}