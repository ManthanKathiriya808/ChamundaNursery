// Login page with accessible form and validation
// Accessibility notes:
// - Labels are associated with inputs, errors have role="alert" for screen readers.
// - aria-invalid is set when a field has an error, aiding AT feedback.
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import useUser from '../hooks/useUser.js'
import { useToast } from '../components/ToastProvider.jsx'
import { InputField, SubmitButton } from '../components/forms'

export default function Login() {
  const { login } = useUser()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
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
    try {
      await login({ email: form.email, password: form.password })
      toast.push('success', 'Signed in successfully')
      const redirectTo = location.state?.from?.pathname || '/account/profile'
      navigate(redirectTo)
    } catch (err) {
      toast.push('error', 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container max-w-md">
      <Helmet>
        <title>Login • Chamunda Nursery</title>
        <meta name="description" content="Access your Chamunda Nursery account" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
        <InputField
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={onChange}
          placeholder="you@example.com"
          required
          error={errors.email}
          hint="We’ll never share your email."
        />
        <InputField
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={onChange}
          placeholder="Enter your password"
          required
          error={errors.password}
        />
        <SubmitButton loading={submitting}>{submitting ? 'Signing in…' : 'Sign In'}</SubmitButton>
        <p className="text-sm text-neutral-600">New here? <Link to="/account/register" className="link-hover text-primary">Create account</Link></p>
      </form>
    </div>
  )
}