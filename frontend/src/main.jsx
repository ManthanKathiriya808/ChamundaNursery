// Entry point: sets up routing, lazy loading, and SEO provider
import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import UserProvider from './hooks/UserProvider.jsx'
import ToastProvider from './components/ToastProvider.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminProducts from './admin/Products.jsx'
import AdminCategories from './admin/Categories.jsx'
import AdminOrders from './admin/Orders.jsx'
import AdminUsers from './admin/Users.jsx'
import AdminReviews from './admin/Reviews.jsx'
import './styles/index.css'

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

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <UserProvider>
        <ToastProvider>
        <BrowserRouter>
          {/* Fallback skeleton for lazy-loaded routes */}
          <Suspense fallback={<div className="p-6 animate-pulse text-neutral-600">Loading…</div>}>
            <Routes>
              {/* App provides shared layout, header, and footer */}
              <Route path="/" element={<App />}> 
                <Route index element={<Home />} />
                <Route path="catalog" element={<Catalog />} />
                <Route path="product/:id" element={<Product />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
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
                {/* Admin routes */}
                <Route path="admin" element={<AdminLayout />}> 
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="reviews" element={<AdminReviews />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        </ToastProvider>
      </UserProvider>
    </HelmetProvider>
  </React.StrictMode>
)