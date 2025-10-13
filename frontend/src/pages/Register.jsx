// Registration page with accessible form and client-side validation
// Accessibility notes:
// - Each input has an associated <label> via htmlFor.
// - Errors use role="alert" and aria-invalid for screen reader feedback.
// - Required fields include required and aria-required for assistive tech.
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import useUser from '../hooks/useUser.js'

export default function Register() {
  const { register } = useUser()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email'
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    await register({ name: form.name, email: form.email })
    navigate('/account/profile')
  }

  return (
    <div className="page-container max-w-md">
      <Helmet>
        <title>Register • Chamunda Nursery</title>
        <meta name="description" content="Create your Chamunda Nursery account" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Create Account</h1>
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
          <label htmlFor="password" className="block font-medium">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={onChange}
            required aria-required="true" aria-invalid={!!errors.password} aria-describedby={errors.password ? 'password-error' : undefined}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:ring-primary focus:border-primary" />
          {errors.password && <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
        <div>
          <label htmlFor="confirm" className="block font-medium">Confirm Password</label>
          <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={onChange}
            required aria-required="true" aria-invalid={!!errors.confirm} aria-describedby={errors.confirm ? 'confirm-error' : undefined}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 focus:ring-primary focus:border-primary" />
          {errors.confirm && <p id="confirm-error" role="alert" className="mt-1 text-sm text-red-600">{errors.confirm}</p>}
        </div>
        <button disabled={submitting} className="btn btn-primary w-full">{submitting ? 'Creating…' : 'Create Account'}</button>
        <p className="text-sm text-neutral-600">Already have an account? <Link to="/account/login" className="link-hover text-primary">Log in</Link></p>
      </form>
    </div>
  )
}