// Products management with CRUD and CSV upload (client-side validation)
import React, { useRef, useState } from 'react'

export default function AdminProducts() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', slug: '', price: '' })
  const [errors, setErrors] = useState({})
  const [toasts, setToasts] = useState([])
  const fileRef = useRef(null)

  const notify = (type, message) => {
    setToasts((t) => [...t, { id: Date.now(), type, message }])
    setTimeout(() => setToasts((t) => t.slice(1)), 3000)
  }

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validateForm = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.slug.trim()) e.slug = 'Slug is required'
    if (!String(form.price).trim() || isNaN(Number(form.price))) e.price = 'Valid price required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const addItem = (ev) => {
    ev.preventDefault()
    if (!validateForm()) return notify('error', 'Please fix form errors')
    const next = { ...form, id: Date.now(), price: Number(form.price) }
    setItems((i) => [next, ...i])
    setForm({ name: '', slug: '', price: '' })
    notify('success', 'Product added (local demo)')
  }

  const deleteItem = (id) => {
    setItems((i) => i.filter((x) => x.id !== id))
    notify('success', 'Product deleted (local demo)')
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
      notify('success', `Imported ${parsed.length} product(s)`)
    }
    setItems((i) => [...parsed, ...i])
    fileRef.current.value = ''
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Products</h1>

      {/* Real-time notifications */}
      <div aria-live="polite" aria-atomic="true" className="fixed right-4 top-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} role="alert" className={`rounded-md px-3 py-2 shadow-premium text-white ${t.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
            {t.message}
          </div>
        ))}
      </div>

      {/* Create form */}
      <form onSubmit={addItem} className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Name</label>
          <input id="name" name="name" value={form.name} onChange={onChange} required aria-required className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
          {errors.name && <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium">Slug</label>
          <input id="slug" name="slug" value={form.slug} onChange={onChange} required aria-required className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2" aria-invalid={!!errors.slug} aria-describedby={errors.slug ? 'slug-error' : undefined} />
          {errors.slug && <p id="slug-error" role="alert" className="mt-1 text-sm text-red-600">{errors.slug}</p>}
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium">Price (₹)</label>
          <input id="price" name="price" value={form.price} onChange={onChange} required aria-required inputMode="decimal" className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2" aria-invalid={!!errors.price} aria-describedby={errors.price ? 'price-error' : undefined} />
          {errors.price && <p id="price-error" role="alert" className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>
        <button className="btn btn-primary" type="submit">Add Product</button>
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
              {items.map((p) => (
                <tr key={p.id} className="border-t border-neutral-200">
                  <td className="py-2 pr-4">{p.name}</td>
                  <td className="py-2 pr-4">{p.slug}</td>
                  <td className="py-2 pr-4">₹{p.price}</td>
                  <td className="py-2 pr-4">
                    <button className="btn btn-outline" onClick={() => deleteItem(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-neutral-600">No products yet. Add or import CSV.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}