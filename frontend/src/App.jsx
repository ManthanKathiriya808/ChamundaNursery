import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import Header from './components/Header';
import Footer from './components/Footer';
import NotificationSystem from './components/NotificationSystem';
import ErrorBoundary from './components/ErrorBoundary';
import QueryErrorBoundary from './components/QueryErrorBoundary';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import CareGuides from './pages/CareGuides';
import CareGuideDetail from './pages/CareGuideDetail';
import AdminDashboard from './pages/admin/SyncDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminSettings from './pages/AdminSettings';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useClerkJWTBridge } from './hooks/useClerkJWTBridge';
import { useRoleSync } from './hooks/useRoleSync';
import './App.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key")
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <QueryErrorBoundary>
          <AppContent />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryErrorBoundary>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

function AppContent() {
  // useClerkJWTBridge(); // Removed - already called in ClerkJWTBridge component
  useRoleSync();

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <NotificationSystem />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;