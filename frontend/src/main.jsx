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
const Care = React.lazy(() => import('./pages/Care.jsx'))

// Lazy-load admin pages and layout
const AdminLayout = React.lazy(() => import('./admin/AdminLayout.jsx'))
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard.jsx'))
const AdminProducts = React.lazy(() => import('./admin/Products.jsx'))
const AdminProductsEnhanced = React.lazy(() => import('./admin/ProductsEnhanced.jsx'))
const AdminCategories = React.lazy(() => import('./admin/Categories.jsx'))
const AdminOrders = React.lazy(() => import('./admin/Orders.jsx'))
const AdminUsers = React.lazy(() => import('./admin/Users.jsx'))
const DemoForm = React.lazy(() => import('./components/forms/DemoForm.jsx'))
const TestAuth = React.lazy(() => import('./pages/TestAuth.jsx'))
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
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ErrorBoundary>
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
                  <Route path="care" element={<Care />} />
                  
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
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products-enhanced" element={<AdminProductsEnhanced />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="bulk-upload" element={<AdminBulkUpload />} />
                </Route>
                
                {/* Demo Routes */}
            <Route path="/demo/form" element={<DemoForm />} />
            <Route path="/test-auth" element={<TestAuth />} />
              </Routes>
          </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
          </DataProvider>
          </CartProvider>
          </ToastProvider>
          </UserProvider>
        </ClerkJWTBridge>
      </ClerkProvider>
    </HelmetProvider>
  </React.StrictMode>
)