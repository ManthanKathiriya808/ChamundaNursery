import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import NotificationSystem from './components/NotificationSystem';
import { useRoleSync } from './hooks/useRoleSync';
import './App.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key")
}

function App() {
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