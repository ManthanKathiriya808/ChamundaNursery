// Entry point: sets up routing, lazy loading, and SEO provider
import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import QueryErrorBoundary from './components/QueryErrorBoundary.jsx'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import UserProvider from './hooks/UserProvider.jsx'
import CartProvider from './hooks/CartProvider.jsx'
import ToastProvider from './components/ToastProvider.jsx'
import ClerkProvider, { ClerkLoadingSpinner } from './providers/ClerkProvider.jsx'
import ClerkJWTBridge from './components/ClerkJWTBridge.jsx'
import './styles/index.css'
import DataProvider from './context/DataProvider.jsx'
import ProtectedRoute, { AdminRoute, UserRoute } from './components/auth/ProtectedRoute.jsx'

// Lazy-load main pages for performance
const Home = React.lazy(() => import('./pages/Home.jsx'))
const Catalog = React.lazy(() => import('./pages/Catalog.jsx'))
const Product = React.lazy(() => import('./pages/Product.jsx'))
const Cart = React.lazy(() => import('./pages/Cart.jsx'))
const Checkout = React.lazy(() => import('./pages/Checkout.jsx'))

// Auth components
const SignInForm = React.lazy(() => import('./components/auth/SignInForm.jsx'))
const SignUpForm = React.lazy(() => import('./components/auth/SignUpForm.jsx'))
const UserProfile = React.lazy(() => import('./components/auth/UserProfile.jsx'))
const AuthLayout = React.lazy(() => import('./components/AuthLayout.jsx'))

// User pages (lazy-loaded)
const Orders = React.lazy(() => import('./pages/Orders.jsx'))

// Static pages (lazy-loaded)
const About = React.lazy(() => import('./pages/About.jsx'))
const Contact = React.lazy(() => import('./pages/Contact.jsx'))
const FAQ = React.lazy(() => import('./pages/FAQ.jsx'))
const Terms = React.lazy(() => import('./pages/Terms.jsx'))
const Privacy = React.lazy(() => import('./pages/Privacy.jsx'))
const Legal = React.lazy(() => import('./pages/Legal.jsx'))
const Blog = React.lazy(() => import('./pages/Blog.jsx'))
const BlogDetail = React.lazy(() => import('./pages/BlogDetail.jsx'))
const Care = React.lazy(() => import('./pages/Care.jsx'))
const CareDetail = React.lazy(() => import('./pages/CareDetail.jsx'))

// Lazy-load admin pages and layout
const AdminLayout = React.lazy(() => import('./admin/AdminLayout.jsx'))
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard.jsx'))
const AdminProductsUnified = React.lazy(() => import('./admin/ProductsUnified.jsx'))
const AdminCategories = React.lazy(() => import('./admin/Categories.jsx'))
const AdminBlogManagement = React.lazy(() => import('./admin/BlogManagement.jsx'))
const AdminOrders = React.lazy(() => import('./admin/Orders.jsx'))
const AdminUsers = React.lazy(() => import('./admin/Users.jsx'))
const AdminReviews = React.lazy(() => import('./admin/Reviews.jsx'))
const AdminBulkUpload = React.lazy(() => import('./admin/BulkUpload.jsx'))

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ClerkProvider>
        <ClerkJWTBridge>
          <UserProvider>
          <ToastProvider>
          <CartProvider>
          <DataProvider>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
              <QueryErrorBoundary>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                  {/* Loading fallback with nursery branding */}
                  <Suspense fallback={<ClerkLoadingSpinner />}>
                    <Routes>
                      {/* Main Application Routes */}
                      {/* Authentication Routes with separate layout (no navbar/footer) */}
                      <Route path="account/login/*" element={<AuthLayout />}>
                        <Route index element={<SignInForm />} />
                        <Route path="*" element={<SignInForm />} />
                      </Route>
                      <Route path="account/register/*" element={<AuthLayout />}>
                        <Route index element={<SignUpForm />} />
                        <Route path="*" element={<SignUpForm />} />
                      </Route>

                      <Route path="/" element={<App />}> 
                        {/* Public Routes */}
                        <Route index element={<Home />} />
                        <Route path="catalog" element={<Catalog />} />
                        <Route path="product/:id" element={<Product />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="faq" element={<FAQ />} />
                        <Route path="terms" element={<Terms />} />
                        <Route path="privacy" element={<Privacy />} />
                        <Route path="legal" element={<Legal />} />
                        <Route path="blog" element={<Blog />} />
                        <Route path="blog/:id" element={<BlogDetail />} />
                        <Route path="care" element={<Care />} />
                        <Route path="care/:id" element={<CareDetail />} />
                        
                        {/* Protected User Routes */}
                        <Route path="cart" element={
                          <UserRoute pageTitle="Shopping Cart">
                            <Cart />
                          </UserRoute>
                        } />
                        <Route path="checkout" element={
                          <UserRoute pageTitle="Checkout">
                            <Checkout />
                          </UserRoute>
                        } />
                        <Route path="account/profile" element={
                          <UserRoute pageTitle="Profile">
                            <UserProfile />
                          </UserRoute>
                        } />
                        <Route path="account/orders" element={
                          <UserRoute pageTitle="Order History">
                            <Orders />
                          </UserRoute>
                        } />
                      </Route>

                      {/* Admin Routes */}
                      <Route path="admin" element={
                        <AdminRoute pageTitle="Admin Dashboard">
                          <AdminLayout />
                        </AdminRoute>
                      }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProductsUnified />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="blog" element={<AdminBlogManagement />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="reviews" element={<AdminReviews />} />
                        <Route path="bulk-upload" element={<AdminBulkUpload />} />
                      </Route>

                    </Routes>
                  </Suspense>
                </BrowserRouter>
                <ReactQueryDevtools initialIsOpen={false} />
              </QueryErrorBoundary>
            </ErrorBoundary>
          </QueryClientProvider>
          </DataProvider>
          </CartProvider>
          </ToastProvider>
          </UserProvider>
        </ClerkJWTBridge>
      </ClerkProvider>
    </HelmetProvider>
  </React.StrictMode>
)