// Registration page with accessible form and client-side validation
// Accessibility notes:
// - Each input has an associated <label> via htmlFor.
// - Errors use role="alert" and aria-invalid for screen reader feedback.
// - Required fields include required and aria-required for assistive tech.
import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, Link } from 'react-router-dom'
import useUser from '../hooks/useUser.js'
import { useToast } from '../components/ToastProvider.jsx'
import { InputField, SubmitButton } from '../components/forms'

export default function Register() {
  const { register } = useUser()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (form.confirm !== form.password) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      toast.push('success', 'Account created successfully')
      navigate('/account/profile')
    } catch (err) {
      toast.push('error', 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container max-w-md">
      <Helmet>
        <title>Register • Chamunda Nursery</title>
        <meta name="description" content="Create your Chamunda Nursery account" />
      </Helmet>
      <h1 className="text-2xl font-semibold mb-4">Create Account</h1>
      <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
        <InputField
          name="name"
          label="Name"
          value={form.name}
          onChange={onChange}
          placeholder="Your full name"
          required
          error={errors.name}
        />
        <InputField
          name="email"
          type="email"
          label="Email"
          value={form.email}
          onChange={onChange}
          placeholder="you@example.com"
          required
          error={errors.email}
          hint="We’ll send account updates here."
        />
        <InputField
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onChange={onChange}
          placeholder="At least 6 characters"
          required
          error={errors.password}
        />
        <InputField
          name="confirm"
          type="password"
          label="Confirm Password"
          value={form.confirm}
          onChange={onChange}
          placeholder="Re-enter your password"
          required
          error={errors.confirm}
        />
        <SubmitButton loading={submitting}>{submitting ? 'Creating…' : 'Create Account'}</SubmitButton>
        <p className="text-sm text-neutral-600">Already have an account? <Link to="/account/login" className="link-hover text-primary">Log in</Link></p>
      </form>
    </div>
  )
}