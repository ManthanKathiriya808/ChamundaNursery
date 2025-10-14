// Checkout page placeholder with secure payment gateway section
import React, { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useCart } from '../hooks/CartProvider.jsx'
import { useToast } from '../components/ToastProvider.jsx'
import { InputField, SubmitButton } from '../components/forms'

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', postal: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [pay, setPay] = useState('card')
  const shipping = useMemo(() => (subtotal > 499 ? 0 : 99), [subtotal])
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.phone.match(/^\+?[0-9\- ]{7,}$/)) errs.phone = 'Valid phone is required'
    if (!form.address.trim()) errs.address = 'Address is required'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.postal.trim()) errs.postal = 'Postal code is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const onSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) { toast.push('error', 'Please fix errors in shipping details'); return }
    if (items.length === 0) {
      toast.push('error', 'Your cart is empty')
      return
    }
    // Placeholder: integrate real payments/order creation
    setSubmitting(true)
    setTimeout(() => {
      toast.push('success', 'Order placed successfully')
      clear()
      setSubmitting(false)
    }, 1000)
  }
  return (
    <div className="page-container">
      <Helmet>
        <title>Checkout • Chamunda Nursery</title>
        <meta name="description" content="Complete your purchase securely" />
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Steps */}
        <form onSubmit={onSubmit} className="lg:col-span-2 space-y-4" noValidate>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <h2 className="font-semibold mb-3">1. Shipping Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField name="name" label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required error={errors.name} />
              <InputField name="phone" label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required error={errors.phone} />
              <InputField className="md:col-span-2" name="address" label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required error={errors.address} />
              <InputField name="city" label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required error={errors.city} />
              <InputField name="postal" label="Postal Code" value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} required error={errors.postal} />
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <h2 className="font-semibold mb-3">2. Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2"><input type="radio" name="pay" checked={pay === 'card'} onChange={() => setPay('card')} /> Credit/Debit Card</label>
              <label className="flex items-center gap-2"><input type="radio" name="pay" checked={pay === 'upi'} onChange={() => setPay('upi')} /> UPI</label>
              <label className="flex items-center gap-2"><input type="radio" name="pay" checked={pay === 'cod'} onChange={() => setPay('cod')} /> Cash on Delivery</label>
              {pay === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                  <InputField name="card" label="Card Number" placeholder="1234 5678 9012 3456" />
                  <InputField name="expiry" label="Expiry MM/YY" placeholder="07/27" />
                  <InputField name="cvv" label="CVV" placeholder="123" />
                </div>
              )}
              {pay === 'upi' && (
                <div className="grid grid-cols-1 gap-3 mt-2">
                  <InputField name="upi" label="UPI ID" placeholder="name@bank" />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-full sm:w-auto">
              <SubmitButton loading={submitting}>Place Order</SubmitButton>
            </div>
          </div>
        </form>

        {/* Right: Summary */}
        <aside className="lg:col-span-1">
          <div className="rounded-lg border border-neutral-200 bg-white p-4">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <ul className="space-y-2 text-sm">
              {items.length === 0 && <li className="text-neutral-600">No items in cart.</li>}
              {items.map(i => (
                <li key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>₹{i.price * i.qty}</span></li>
              ))}
              <li className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></li>
              <li className="flex justify-between"><span>Shipping</span><span>₹{shipping}</span></li>
              <li className="flex justify-between font-semibold"><span>Total</span><span>₹{total}</span></li>
            </ul>
            <p className="mt-3 text-xs text-neutral-600">Taxes and discounts calculated at checkout.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}