// Entry point: sets up routing, lazy loading, and SEO provider
import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import UserProvider from './hooks/UserProvider.jsx'
import CartProvider from './hooks/CartProvider.jsx'
import ToastProvider from './components/ToastProvider.jsx'
import './styles/index.css'
import DataProvider from './context/DataProvider.jsx'
import RequireAuth from './routes/RequireAuth.jsx'

// Lazy-load main pages for performance
const Home = React.lazy(() => import('./pages/Home.jsx'))
const Catalog = React.lazy(() => import('./pages/Catalog.jsx'))
const Product = React.lazy(() => import('./pages/Product.jsx'))
const Cart = React.lazy(() => import('./pages/Cart.jsx'))
const Checkout = React.lazy(() => import('./pages/Checkout.jsx'))
// New user and static pages (lazy-loaded)
const Login = React.lazy(() => import('./pages/Login.jsx'))
const Register = React.lazy(() => import('./pages/Register.jsx'))
const Profile = React.lazy(() => import('./pages/Profile.jsx'))
const Orders = React.lazy(() => import('./pages/Orders.jsx'))
const About = React.lazy(() => import('./pages/About.jsx'))
const Contact = React.lazy(() => import('./pages/Contact.jsx'))
const FAQ = React.lazy(() => import('./pages/FAQ.jsx'))
const Terms = React.lazy(() => import('./pages/Terms.jsx'))
const Privacy = React.lazy(() => import('./pages/Privacy.jsx'))
const Legal = React.lazy(() => import('./pages/Legal.jsx'))
const Blog = React.lazy(() => import('./pages/Blog.jsx'))
const Care = React.lazy(() => import('./pages/Care.jsx'))
// Lazy-load admin pages and layout
const AdminLayout = React.lazy(() => import('./admin/AdminLayout.jsx'))
import RequireAdmin from './routes/RequireAdmin.jsx'
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard.jsx'))
const AdminProducts = React.lazy(() => import('./admin/Products.jsx'))
const AdminCategories = React.lazy(() => import('./admin/Categories.jsx'))
const AdminOrders = React.lazy(() => import('./admin/Orders.jsx'))
const AdminUsers = React.lazy(() => import('./admin/Users.jsx'))
const AdminReviews = React.lazy(() => import('./admin/Reviews.jsx'))
const AdminBulkUpload = React.lazy(() => import('./admin/BulkUpload.jsx'))

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <UserProvider>
        <ToastProvider>
        <CartProvider>
        <DataProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ErrorBoundary>
          {/* Fallback skeleton for lazy-loaded routes */}
          <Suspense fallback={<div className="p-6 animate-pulse text-neutral-600">Loading…</div>}>
            <Routes>
              {/* App provides shared layout, header, and footer */}
              <Route path="/" element={<App />}> 
                <Route index element={<Home />} />
                <Route path="catalog" element={<Catalog />} />
                <Route path="product/:id" element={<Product />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
                {/* User pages */}
                <Route path="account/login" element={<Login />} />
                <Route path="account/register" element={<Register />} />
                <Route path="account/profile" element={<Profile />} />
                <Route path="account/orders" element={<Orders />} />
                {/* Static pages */}
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="terms" element={<Terms />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="legal" element={<Legal />} />
                {/* Blog */}
                <Route path="blog" element={<Blog />} />
                {/* Care guides */}
                <Route path="care" element={<Care />} />
              {/* Admin routes (protected) */}
              <Route path="admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="bulk-upload" element={<AdminBulkUpload />} />
              </Route>
              </Route>
            </Routes>
          </Suspense>
          </ErrorBoundary>
        </BrowserRouter>
        </DataProvider>
        </CartProvider>
        </ToastProvider>
      </UserProvider>
    </HelmetProvider>
  </React.StrictMode>
)