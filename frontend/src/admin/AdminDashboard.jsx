// Responsive dashboard with dummy sales summary and recent orders
import React from 'react'

const dummyStats = [
  { label: 'Total Sales', value: '₹1,24,500', trend: '+8.2%' },
  { label: 'Orders', value: '312', trend: '+3.1%' },
  { label: 'Avg. Order Value', value: '₹399', trend: '+1.4%' },
]

const dummyOrders = Array.from({ length: 5 }).map((_, i) => ({
  id: 1000 + i,
  customer: `Customer ${i + 1}`,
  total: 250 + i * 50,
  status: ['pending', 'processing', 'completed'][i % 3]
}))

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Sales summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dummyStats.map((s) => (
          <div key={s.label} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-premium">
            <p className="text-neutral-600 text-sm">{s.label}</p>
            <p className="text-xl font-semibold">{s.value}</p>
            <p className="text-sm text-green-600">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="font-semibold mb-3">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-200">
                <th className="py-2 pr-4">Order ID</th>
                <th className="py-2 pr-4">Customer</th>
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyOrders.map(o => (
                <tr key={o.id} className="border-t border-neutral-200">
                  <td className="py-2 pr-4">{o.id}</td>
                  <td className="py-2 pr-4">{o.customer}</td>
                  <td className="py-2 pr-4">₹{o.total}</td>
                  <td className="py-2 pr-4">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}