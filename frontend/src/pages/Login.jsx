// Login page with accessible form and validation
// Accessibility notes:
// - Labels are associated with inputs, errors have role="alert" for screen readers.
// - aria-invalid is set when a field has an error, aiding AT feedback.
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import useUser from '../hooks/useUser.js'

export default function Login() {
  const { login } = useUser()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    await login({ email: form.email })
    navigate('/account/profile')
  }

  return (
    <div className="page-container max-w-md">
      <Helmet>
        <title>Login • Chamunda Nursery</title>
        <meta name="description" content="Access your Chamunda Nursery account" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
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
        <button disabled={submitting} className="btn btn-primary w-full">{submitting ? 'Signing in…' : 'Sign In'}</button>
        <p className="text-sm text-neutral-600">New here? <Link to="/account/register" className="link-hover text-primary">Create account</Link></p>
      </form>
    </div>
  )
}