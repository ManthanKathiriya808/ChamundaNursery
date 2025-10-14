import React from 'react'
import { Helmet } from 'react-helmet-async'
import useUser from '../hooks/useUser.js'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataProvider.jsx'

export default function Orders() {
  const { user } = useUser()
  const { orders, loading } = useData()

  return (
    <div className="page-container">
      <Helmet>
        <title>Order History • Chamunda Nursery</title>
        <meta name="description" content="Review your previous orders" />
      </Helmet>
      {!user.isAuthenticated ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="mb-2">Please log in to view your orders.</p>
          <Link to="/account/login" className="btn btn-primary">Login</Link>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <h1 className="text-xl font-semibold mb-3">Your Orders</h1>
          {loading && <div className="text-neutral-600 mb-2">Loading…</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm" aria-label="Order history">
              <thead className="text-left">
                <tr>
                  <th className="py-2 pr-4">Order ID</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {(orders || []).map(o => (
                  <tr key={o.id} className="border-t border-neutral-200">
                    <td className="py-2 pr-4">{o.id}</td>
                    <td className="py-2 pr-4">{o.date}</td>
                    <td className="py-2 pr-4">₹{o.total}</td>
                    <td className="py-2 pr-4">{o.status}</td>
                  </tr>
                ))}
                {(orders || []).length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="py-3 text-neutral-600">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}