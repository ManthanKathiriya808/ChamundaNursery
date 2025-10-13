import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import useUser from '../hooks/useUser.js'

export default function Profile() {
  const { user, logout } = useUser()
  return (
    <div className="page-container max-w-2xl">
      <Helmet>
        <title>Profile • Chamunda Nursery</title>
        <meta name="description" content="View and manage your profile" />
      </Helmet>
      {!user.isAuthenticated ? (
        <div className="rounded-lg border border-neutral-200 bg-white p-4">
          <p className="mb-2">You are not signed in.</p>
          <Link to="/account/login" className="btn btn-primary">Go to Login</Link>
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
          <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
          <p className="text-neutral-700">Email: {user.email}</p>
          <div className="flex gap-2">
            <Link className="btn btn-outline" to="/account/orders">View Orders</Link>
            <button className="btn btn-primary" onClick={logout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  )
}