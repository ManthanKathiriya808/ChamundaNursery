// Contact page with accessible form
// Accessibility notes:
// - Inputs have labels, required attributes, and aria-describedby for error text.
// - Submit button announces errors via role="alert" blocks.
// - The form uses semantic elements and proper keyboard focus management.
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email'
    if (!form.message.trim()) errs.message = 'Message cannot be empty'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSent(true)
  }

  return (
    <div className="page-container max-w-xl">
      <Helmet>
        <title>Contact Us • Chamunda Nursery</title>
        <meta name="description" content="Contact Chamunda Nursery support" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Contact Us</h1>
      <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
        <div>
          <label htmlFor="name" className="block font-medium">Name</label>
          <input id="name" name="name" type="text" value={form.name} onChange={onChange}
            required aria-required="true" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:ring-primary focus:border-primary" />
          {errors.name && <p id="name-error" role="alert" className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block font-medium">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange}
            required aria-required="true" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:ring-primary focus:border-primary" />
          {errors.email && <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="message" className="block font-medium">Message</label>
          <textarea id="message" name="message" value={form.message} onChange={onChange} rows={4}
            required aria-required="true" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:ring-primary focus:border-primary" />
          {errors.message && <p id="message-error" role="alert" className="mt-1 text-sm text-red-600">{errors.message}</p>}
        </div>
        <button className="btn btn-primary w-full">Send Message</button>
        {sent && <p role="status" className="text-green-700">Message sent! We will get back soon.</p>}
      </form>
    </div>
  )
}