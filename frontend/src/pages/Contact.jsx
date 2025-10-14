// Contact page with accessible form
// Accessibility notes:
// - Inputs have labels, required attributes, and aria-describedby for error text.
// - Submit button announces errors via role="alert" blocks.
// - The form uses semantic elements and proper keyboard focus management.
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { InputField, TextareaField, SubmitButton } from '../components/forms'
import { useToast } from '../components/ToastProvider.jsx'

export default function Contact() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email'
    if (form.phone && !form.phone.match(/^\+?[0-9\- ]{7,}$/)) errs.phone = 'Enter a valid phone number'
    if (!form.subject.trim()) errs.subject = 'Subject is required'
    if (!form.message.trim()) errs.message = 'Message cannot be empty'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSent(true)
    toast.push('success', 'Message sent! We will get back soon.')
  }

  return (
    <div className="page-container">
      <Helmet>
        <title>Contact Us • Chamunda Nursery</title>
        <meta name="description" content="Contact Chamunda Nursery support" />
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h1 className="heading-section mb-2">Contact Us</h1>
          <p className="text-body mb-4">We’re here to help with plant selection, care guidance, and orders.</p>
          <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
            <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField name="name" label="Name" value={form.name} onChange={onChange} placeholder="Your full name" required error={errors.name} />
              <InputField name="email" type="email" label="Email" value={form.email} onChange={onChange} placeholder="you@example.com" required error={errors.email} />
              <InputField name="phone" label="Phone" value={form.phone} onChange={onChange} placeholder="Optional" error={errors.phone} />
              <InputField name="subject" label="Subject" value={form.subject} onChange={onChange} placeholder="How can we help?" required error={errors.subject} />
              <TextareaField className="md:col-span-2" name="message" label="Message" value={form.message} onChange={onChange} rows={5} placeholder="Tell us about your requirements or questions" required error={errors.message} />
            </div>
            <SubmitButton loading={false}>Send Message</SubmitButton>
            {sent && <p role="status" className="text-green-700">Message sent! We will get back soon.</p>}
          </form>
        </section>

        <aside className="lg:col-span-1">
          <div className="surface p-4">
            <h2 className="font-semibold mb-2">About Chamunda Nursery</h2>
            <p className="text-sm text-neutral-700">
              From a family dream to 40+ acres of greenery, Chamunda Nursery was founded over 35 years ago and today is led by the Baraiya family. Specializing in bonsai, fruit plants, and landscaping, the team actively showcases work at exhibitions across Gujarat and India.
            </p>
            <p className="text-xs text-neutral-500 mt-2">Source: <a className="link-hover" href="http://chamundanursery.com/" target="_blank" rel="noreferrer">chamundanursery.com</a></p>
            <hr className="my-3" />
            <h3 className="font-medium mb-1">Reach Us</h3>
            <ul className="text-sm text-neutral-700 space-y-1">
              <li>Bhavnagar Rajkot Highway, Navadam, Near Khodiyar Temple</li>
              <li>Bhavnagar, Gujarat, 364060, India</li>
              <li>Phone: +91-XXXXXXXXXX</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}